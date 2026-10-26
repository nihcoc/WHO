const express=require('express'),crypto=require('crypto'),fs=require('fs'),path=require('path');
const seed=require('../../data/seed');
const sha=s=>crypto.createHash('sha256').update(String(s)).digest();
const eq=(a,b)=>crypto.timingSafeEqual(sha(a),sha(b));
function lev(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
const proximity=g=>Math.round(100*(1-lev(g,seed.target)/Math.max(g.length,seed.target.length)));
function createApp(o={}){
const dir=o.dataDir||path.join(__dirname,'../../data/runtime');
const adminPw=o.adminPassword??process.env.ADMIN_PASSWORD;
const now=o.now||Date.now;
fs.mkdirSync(dir,{recursive:true});
const file=path.join(dir,'state.json');
const fresh=()=>({status:'idle',startedAt:0,elapsedMs:0,winner:null,duration:3600,showLeaderboard:true,attempts:[],players:{},
 hints:[{at:10,text:'Start with who actually held Genesis permissions.'},{at:20,text:'Compare file exports against network sessions and forum metadata.'},{at:30,text:'Look at who an employee follows, and what they posted from where.'}]});
let s;try{s=JSON.parse(fs.readFileSync(file,'utf8'));if(!s||!s.players||!Array.isArray(s.hints))throw 0}catch{s=fresh()}
const save=()=>{const t=file+'.tmp';fs.writeFileSync(t,JSON.stringify(s));fs.renameSync(t,file)};
const el=()=>s.status==='running'?s.elapsedMs+now()-s.startedAt:s.elapsedMs;
const chk=()=>{if(s.status==='running'&&el()>=s.duration*1000){s.elapsedMs=s.duration*1000;s.status='ended';save()}};
const pub=()=>{chk();const e=Math.floor(el()/1000);return{status:s.status,elapsed:e,duration:s.duration,hints:s.hints.filter(h=>h.at*60<=e),winner:s.winner?{name:s.winner.name,at:s.winner.at}:null,
 leaderboard:s.showLeaderboard?Object.values(s.players).map(p=>({name:p.name,progress:p.auth.length+p.opened.length})).sort((a,b)=>b.progress-a.progress).slice(0,10):null}};
const clients=new Set();
const bc=()=>{const m='event: state\ndata: '+JSON.stringify(pub())+'\n\n';clients.forEach(c=>c.write(m))};
const tick=setInterval(()=>{if(clients.size)bc()},1000);tick.unref();
const hits=new Map();const rl=(k,max,ms)=>{const t=now(),a=(hits.get(k)||[]).filter(x=>t-x<ms);a.push(t);hits.set(k,a);return a.length<=max};
const ck=r=>Object.fromEntries((r.headers.cookie||'').split(';').filter(Boolean).map(x=>{const i=x.indexOf('=');return[x.slice(0,i).trim(),x.slice(i+1)]}));
const setCk=(res,n,v)=>res.setHeader('Set-Cookie',`${n}=${v}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${process.env.COOKIE_SECURE==='1'?'; Secure':''}`);
const app=express();app.disable('x-powered-by');
app.use((req,res,next)=>{res.set({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"});next()});
app.use(express.json({limit:'4kb'}));
app.use('/api',(req,res,next)=>{if(req.method!=='GET'&&req.headers['x-requested-with']!=='fetch')return res.status(403).json({error:'Forbidden'});next()});
const player=(req,res,next)=>{const sid=ck(req).sid;const p=sid&&s.players[sid];if(!p)return res.status(401).json({error:'Join the game first'});req.p=p;req.sid=sid;next()};
const live=(req,res,next)=>{chk();if(s.status!=='running')return res.status(423).json({error:'Game is not running',state:pub()});next()};
const admins=new Set();
const adm=(req,res,next)=>{if(!adminPw)return res.status(503).json({error:'Admin disabled'});if(!admins.has(ck(req).adm))return res.status(401).json({error:'Unauthorized'});next()};
app.post('/api/join',(req,res)=>{if(!rl('join'+req.ip,30,60000))return res.status(429).json({error:'Slow down'});
 const n=typeof req.body.name==='string'?req.body.name.trim():'';
 if(n.length<2||n.length>20||!/^[\p{L}\p{N} ._'-]+$/u.test(n)||/admin|organi[sz]er/i.test(n))return res.status(400).json({error:'Name must be 2-20 letters/numbers'});
 if(Object.keys(s.players).length>=300)return res.status(503).json({error:'Game full'});
 let sid=ck(req).sid;if(!s.players[sid]){sid=crypto.randomBytes(24).toString('hex');s.players[sid]={name:n,auth:[],opened:[]}}else s.players[sid].name=n;
 save();setCk(res,'sid',sid);res.json({name:n})});
app.get('/api/me',player,(req,res)=>res.json({name:req.p.name,auth:req.p.auth,state:pub()}));
app.get('/api/state',(req,res)=>res.json(pub()));
app.get('/api/events',(req,res)=>{res.writeHead(200,{'content-type':'text/event-stream','cache-control':'no-cache',connection:'keep-alive'});res.write('retry: 2000\nevent: state\ndata: '+JSON.stringify(pub())+'\n\n');clients.add(res);req.on('close',()=>clients.delete(res))});
const strip=e=>({id:e.id,name:e.name,user:e.user,dept:e.dept,title:e.title,gc:e.gc,bio:e.bio});
const emp=id=>seed.employees.find(e=>e.id===id);
app.get('/api/app/:name',player,live,(req,res)=>{const n=req.params.name;
 if(n==='teamplay')return res.json({employees:seed.employees.map(strip),tasks:seed.tasks});
 if(n==='iplogger')return res.json({events:seed.events});
 if(n==='nexmail')return res.json({emails:seed.emails.map(m=>({...m,from:emp(m.from)?.name||m.from,to:emp(m.to)?.name||m.to}))});
 if(n==='atlas')return res.json({locations:seed.locations});
 if(n==='tenplan')return res.json({threads:seed.threads});
 if(n==='grammie')return res.json({profiles:seed.employees.map(e=>({user:e.user,name:e.name,bio:e.bio,follows:seed.follows[e.user]||[],posts:(seed.posts[e.user]||[]).map(([id,cap,loc,ts,com])=>({id,cap,loc,ts,comments:com}))}))});
 res.status(404).json({error:'Unknown app'})});
app.post('/api/grammie/login',player,live,(req,res)=>{if(!rl('lg'+req.sid,10,60000))return res.status(429).json({error:'Too many attempts'});
 const u=typeof req.body.username==='string'?req.body.username.slice(0,40):'',pw=typeof req.body.password==='string'?req.body.password.slice(0,64):'';
 const e=seed.employees.find(x=>x.user===u);const ok=eq(pw,e?e.pw:'\0')&&!!e;
 s.attempts.push({name:req.p.name,user:u,ok,t:Math.floor(el()/1000)});if(s.attempts.length>500)s.attempts.shift();
 if(!ok){save();return res.status(401).json({error:'Invalid username or password'})}
 if(!req.p.auth.includes(u))req.p.auth.push(u);save();res.json({ok:true,user:u})});
const authed=(req,res,next)=>{if(!req.p.auth.includes(req.params.user))return res.status(403).json({error:'Not logged in to this account'});next()};
app.get('/api/grammie/chats/:user',player,live,authed,(req,res)=>res.json({chats:(seed.chats[req.params.user]||[]).map(c=>({id:c.id,with:c.with,last:c.msgs[c.msgs.length-1][1]}))}));
app.get('/api/grammie/chats/:user/:cid',player,live,authed,(req,res)=>{
 const c=(seed.chats[req.params.user]||[]).find(x=>x.id===req.params.cid);if(!c)return res.status(404).json({error:'No such chat'});
 let won=false;
 if(c.decisive&&req.params.user===seed.culprit&&s.status==='running'&&!s.winner){ // synchronous block: atomic in single-threaded Node
  s.winner={name:req.p.name,sid:req.sid,at:Math.floor(el()/1000)};s.elapsedMs=el();s.status='ended';won=true}
 if(!req.p.opened.includes(c.id))req.p.opened.push(c.id);save();if(won)bc();
 res.json({id:c.id,with:c.with,messages:c.msgs.map(([from,text,ts])=>({from,text,ts})),decisive:!!c.decisive,won})});
app.post('/api/passtrace',player,live,(req,res)=>{if(!rl('pt'+req.sid,20,60000))return res.status(429).json({error:'Rate limit: wait a moment'});
 const g=req.body.guess;if(typeof g!=='string'||g.length<1||g.length>40)return res.status(400).json({error:'Guess must be 1-40 characters'});
 res.json({guess:g,proximity:proximity(g)})});
app.post('/api/admin/login',(req,res)=>{if(!adminPw)return res.status(503).json({error:'Admin disabled'});if(!rl('al'+req.ip,5,60000))return res.status(429).json({error:'Too many attempts'});
 if(typeof req.body.password!=='string'||!eq(req.body.password,adminPw))return res.status(401).json({error:'Wrong password'});
 const t=crypto.randomBytes(24).toString('hex');admins.add(t);setCk(res,'adm',t);res.json({ok:true})});
const act={start:()=>{if(s.status!=='idle')return false;s.status='running';s.startedAt=now();s.elapsedMs=0;return true},
 pause:()=>{if(s.status!=='running')return false;s.elapsedMs=el();s.status='paused';return true},
 resume:()=>{if(s.status!=='paused')return false;s.startedAt=now();s.status='running';return true},
 end:()=>{if(s.status!=='running'&&s.status!=='paused')return false;s.elapsedMs=el();s.status='ended';return true},
 reset:()=>{Object.assign(s,{status:'idle',startedAt:0,elapsedMs:0,winner:null,attempts:[]});Object.values(s.players).forEach(p=>{p.auth=[];p.opened=[]});return true}};
app.post('/api/admin/:a',adm,(req,res)=>{const a=req.params.a;
 if(a==='config'){const b=req.body;if(Number.isInteger(b.duration)&&b.duration>=60&&b.duration<=86400)s.duration=b.duration;
  if(Array.isArray(b.hints)&&b.hints.length<=10&&b.hints.every(h=>Number.isFinite(h.at)&&typeof h.text==='string'&&h.text.length<300))s.hints=b.hints.map(h=>({at:h.at,text:h.text}));
  if(typeof b.showLeaderboard==='boolean')s.showLeaderboard=b.showLeaderboard;save();bc();return res.json({ok:true})}
 if(!act[a])return res.status(404).json({error:'Unknown action'});
 if(a==='reset'&&s.status==='running'&&req.body.confirm!==true)return res.status(400).json({error:'Confirm reset of an active game'});
 if(!act[a]())return res.status(409).json({error:'Invalid in current state'});save();bc();res.json(pub())});
app.get('/api/admin/status',adm,(req,res)=>res.json({...pub(),allHints:s.hints,players:Object.values(s.players).map(p=>({name:p.name,accounts:p.auth.length,chats:p.opened.length})),attempts:s.attempts.slice(-50),winner:s.winner&&{name:s.winner.name,at:s.winner.at},uptime:Math.floor(process.uptime())}));
app.use(express.static(path.join(__dirname,'../public')));
app.use('/api',(req,res)=>res.status(404).json({error:'Not found'}));
app.use((err,req,res,next)=>res.status(err.status||500).json({error:err.status&&err.status<500?'Bad request':'Server error'}));
return{app,close:()=>{clearInterval(tick);clients.forEach(c=>c.end())}}}
module.exports={createApp,proximity};
if(require.main===module){if(!process.env.ADMIN_PASSWORD)console.warn('ADMIN_PASSWORD not set: admin disabled');const p=process.env.PORT||3000;createApp().app.listen(p,()=>console.log('BREACH PROTOCOL on :'+p))}
