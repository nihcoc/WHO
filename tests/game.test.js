const test=require('node:test'),assert=require('node:assert'),os=require('os'),fs=require('fs'),path=require('path');
const {createApp}=require('../src/server/app');
const seed=require('../data/seed');
let t=1e6;const clock=()=>t;
async function setup(){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bp-'));const g=createApp({dataDir:dir,adminPassword:'pw',now:clock});
 const srv=await new Promise(r=>{const x=g.app.listen(0,()=>r(x))});const base='http://localhost:'+srv.address().port;
 const mk=()=>{let c='';return async(p,b)=>{const r=await fetch(base+p,{method:b===undefined?'GET':'POST',headers:{'content-type':'application/json','x-requested-with':'fetch',cookie:c},body:b===undefined?undefined:JSON.stringify(b)});const sc=r.headers.get('set-cookie');if(sc)c=c.split('; ').filter(x=>x&&!x.startsWith(sc.split('=')[0]+'=')).concat(sc.split(';')[0]).join('; ');return{status:r.status,body:await r.json().catch(()=>({}))}}};
 const admin=mk();await admin('/api/admin/login',{password:'pw'});
 return{g,srv,mk,admin,done:()=>{g.close();srv.closeAllConnections();srv.close()}}}
const join=async(c,n)=>c('/api/join',{name:n});
const login=(c,u,p)=>c('/api/grammie/login',{username:u,password:p});
test('full investigation path, atomic single winner, auth isolation',async()=>{
 const x=await setup();const a=x.mk(),b=x.mk();await join(a,'Alice');await join(b,'Bob');
 assert.equal((await a('/api/app/grammie')).status,423);
 await x.admin('/api/admin/start',{});
 assert.equal((await login(a,'nikhil.v.codes','wrong')).status,401);
 assert.equal((await a('/api/grammie/chats/nikhil.v.codes')).status,403);
 assert.equal((await login(a,'nikhil.v.codes',seed.target)).status,200);
 assert.equal((await b('/api/grammie/chats/nikhil.v.codes')).status,403);
 await login(b,'nikhil.v.codes',seed.target);
 const r=await Promise.all([a('/api/grammie/chats/nikhil.v.codes/c-kestrel'),b('/api/grammie/chats/nikhil.v.codes/c-kestrel')]);
 assert.equal(r.filter(q=>q.body.won).length,1);
 const st=await a('/api/state');assert.equal(st.body.status,'ended');assert.ok(st.body.winner);
 assert.equal((await a('/api/app/atlas')).status,423);
 const ad=await x.admin('/api/admin/status');assert.equal(ad.status,200);
 await x.admin('/api/admin/reset',{});const s2=await a('/api/state');assert.equal(s2.body.winner,null);assert.equal(s2.body.status,'idle');
 x.done()});
test('passtrace deterministic and validated; no solution leak',async()=>{
 const x=await setup();const a=x.mk();await join(a,'Alice');await x.admin('/api/admin/start',{});
 const r1=await a('/api/passtrace',{guess:'Biscuit2019'}),r2=await a('/api/passtrace',{guess:'Biscuit2019'});
 assert.equal(r1.body.proximity,r2.body.proximity);assert.ok(r1.body.proximity>0&&r1.body.proximity<100);
 assert.equal((await a('/api/passtrace',{guess:''})).status,400);assert.equal((await a('/api/passtrace',{guess:'x'.repeat(99)})).status,400);
 assert.ok(!JSON.stringify((await a('/api/app/teamplay')).body).includes(seed.target));x.done()});
test('timer pause/resume, hints, admin auth, invalid input',async()=>{
 const x=await setup();const a=x.mk();await join(a,'Alice');const anon=x.mk();
 assert.equal((await anon('/api/admin/start',{})).status,401);assert.equal((await join(a,'<b>x</b>')).status,400);
 await x.admin('/api/admin/start',{});t+=9*60000;assert.equal((await a('/api/state')).body.hints.length,0);
 await x.admin('/api/admin/pause',{});t+=60*60000;await x.admin('/api/admin/resume',{});
 let s=(await a('/api/state')).body;assert.equal(s.elapsed,540);assert.equal(s.hints.length,0);
 t+=61000;s=(await a('/api/state')).body;assert.equal(s.hints.length,1);
 assert.equal((await a('/api/grammie/login',{username:{},password:5})).status,401);
 t+=3600000;assert.equal((await a('/api/state')).body.status,'ended');
 x.done()});
