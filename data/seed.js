// Fictional seed data. Timezone: +04:00 (Gulf Standard Time) everywhere.
const E=(id,name,user,dept,title,gc,pw,bio)=>({id,name,user,dept,title,gc,pw,bio});
const employees=[
E('E01','Nikhil Varghese','nikhil.v.codes','Engineering','Verification Engineer',1,'Biscuit@Alleppey2019','Dog dad. Verification by day, ghee roast by night. Email nerd, @ everywhere.'),
E('E02','Meera Nair','meera.nair.ic','Engineering','Genesis Verification Lead',1,'Chai!Sunrise88','Leading verification. Filter coffee loyalist.'),
E('E03','Farhan Siddiqui','farhan.sid','Engineering','Senior Architect',1,'Falcon#Dubai07','Architect. Calls with the fab at odd hours.'),
E('E04','Divya Krishnan','divya.k','PMO','Project Manager',1,'Gantt$Kochi2020','Keeping Genesis on schedule. Cousin Ashwin works at 10Plan, we do not talk shop.'),
E('E05','Samir Haddad','samir.h','IT','IT Administrator',0,'Reset&Repeat1','Password resets are my love language.'),
E('E06','Leena Thomas','leena.designs','Design','Product Designer',0,'Pixel*Orchid21','Designer. Sister runs Chai & Chapters on Orchid Street.'),
E('E07','Arjun Pillai','arjun.p','Engineering','Firmware Engineer',1,'Boot@Varkala15','Firmware. Weekend surfer.'),
E('E08','Fatima Al Mansoori','fatima.mansoori','Legal','Corporate Counsel',0,'Clause#Ragab09','Contracts and cardamom tea.'),
E('E09','Joseph Mathew','jo.mathew','Finance','Finance Analyst',0,'Ledger%Pala12','Numbers and cricket.'),
E('E10','Aisha Rahman','aisha.r','HR','HR Partner',0,'People!Sharjah5','People first.'),
E('E11','Vishnu Nambiar','vishnu.nb','Engineering','QA Engineer',1,'Bug*Thrissur33','Breaking things professionally.'),
E('E12','Noor Khan','noor.k','Procurement','Procurement Lead',0,'Vendor@Ajman77','Vendors, vendors.'),
E('E13','Thomas Kurian','tkurian','Facilities','Facilities Manager',0,'Keys#Kottayam4','Keys, badges, lifts.'),
E('E14','Sneha Menon','sneha.m','Marketing','Brand Manager',0,'Brand$Munnar18','Brand storyteller.'),
E('E15','Rashid Ali','rashid.ali','IT','Network Engineer',0,'Packet!Fujairah2','Packets and politics.'),
E('E16','Priya Raj','priya.raj','Analytics','Data Analyst',0,'Chart@Kollam66','Charts with chai.'),
E('E17','Mohammed Zayed','mo.zayed','Security','Security Officer',0,'Guard#Abu1Dhabi','Physical security.'),
E('E18','Anita George','anita.g','Operations','Executive Assistant',0,'Diary*Idukki09','Calendars are art.'),
E('E19','Kabir Joseph','kabir.j','Engineering','Engineering Intern',0,'Intern!Alain01','First job, big dreams.'),
E('E20','Lakshmi Iyer','lakshmi.i','Hardware','Hardware Designer',1,'Layout$Palakkad3','PCB layouts and kathakali.')];
const posts={
'nikhil.v.codes':[
['n1','Biscuit turns 5 today. Adopted him in 2019 and he has run my life since.','Home, Ragab','2027-01-02T09:10:00+04:00',[['aisha.r','Happy gotcha day Biscuit!']]],
['n2','Back home for Onam last year. Backwaters hit different.','Alleppey, Kerala','2026-09-14T17:30:00+04:00',[['arjun.p','Take me next time']]],
['n3','Good coffee, better conversation. Sat morning.','Cafe Zahra, Harbor Row','2027-01-09T11:35:00+04:00',[['vishnu.nb','Who is the mystery friend?']]]],
'meera.nair.ic':[['m1','Genesis verification kickoff. Proud of this team.','NEXORA HQ','2027-01-04T10:00:00+04:00',[['nikhil.v.codes','Congrats lead.']]]],
'farhan.sid':[['f1','3 AM fab call again. Send coffee.','Home, Ragab','2027-01-08T22:40:00+04:00',[['divya.k','Go to sleep!']]]],
'divya.k':[['d1','Friday audit archive done. Weekend mode.','NEXORA HQ','2027-01-08T16:40:00+04:00',[['meera.nair.ic','Thanks for the audit pack']]]],
'leena.designs':[['l1','Sat brunch at my sister\'s cafe. Best chai in Ragab.','Chai & Chapters, Orchid Street','2027-01-09T10:15:00+04:00',[['sneha.m','Save me a seat']]]],
'samir.h':[['s1','Guest Wi-Fi is down AGAIN. Not my fault.','NEXORA HQ','2027-01-09T02:30:00+04:00',[['rashid.ali','Router is cursed']]]]};
const chatLines=['Did you finish the slides?','Lunch at Marina Park?','Weekend plan: beach!','Mum says hi.','Can you cover Thursday?','New phone is amazing.','Football on Friday?','Parking is a nightmare.','Did you see the match?','Happy birthday!'];
const chats={};
employees.forEach((e,i)=>{chats[e.user]=[{id:'c'+e.id,with:employees[(i+1)%20].user,msgs:[[employees[(i+1)%20].user,chatLines[i%10],'2027-01-09T19:0'+(i%10)+':00+04:00'],[e.user,'Sure, talk tomorrow.','2027-01-09T19:1'+(i%10)+':00+04:00']]}]});
chats['nikhil.v.codes'].push({id:'c-kestrel',with:'kestrel_ob',decisive:1,msgs:[
['kestrel_ob','Great meeting you at Zahra. The team at 10Plan loves the offer we discussed. Senior role, double your salary.','2027-01-09T12:05:00+04:00'],
['nikhil.v.codes','I am still not sure. Meera got the lead role after 3 years of my work.','2027-01-09T12:20:00+04:00'],
['kestrel_ob','Then show them what that was worth. The Genesis tape-out checklist is all we need.','2027-01-09T12:22:00+04:00'],
['nikhil.v.codes','I exported it Friday before leaving. I will send it tonight from home.','2027-01-10T22:52:00+04:00'],
['kestrel_ob','Received. Posting it on the forum soon. Your offer letter follows Monday.','2027-01-10T22:54:00+04:00']]});
const follows={'divya.k':['kestrel_ob'],'nikhil.v.codes':['biscuit.the.dog','meera.nair.ic']};
const tasks=[['GC-101','Genesis RTL freeze','E02','done','2027-01-05T17:00:00+04:00'],['GC-212','Tape-out checklist export','E01','done','2027-01-08T16:12:00+04:00'],['AUD-88','Weekly audit archive','E04','done','2027-01-08T16:10:00+04:00'],['GC-230','Fab interface review','E03','open','2027-01-08T22:10:00+04:00'],['IT-541','Reset password (guest net)','E05','done','2027-01-09T02:20:00+04:00']].map(([id,title,emp,status,ts])=>({id,title,emp,status,ts}));
const events=[
['V1','E01','2027-01-08T16:12:00+04:00','10.20.4.31','NEXORA-LT-0231 / Chrome','file_export','Exported GC_tapeout_checklist_v3.pdf','S-4471',0],
['V2','E04','2027-01-08T16:10:00+04:00','10.20.3.14','NEXORA-LT-0114 / Edge','archive_download','GC_weekly_audit.zip (ticket AUD-88)','S-4402',0],
['V3','E03','2027-01-08T22:10:00+04:00','10.20.2.9','NEXORA-LT-0099 / Chrome','login','VPN session 3h with fab calendar','S-4430',0],
['V4','E05','2027-01-09T02:14:00+04:00','10.20.9.250','Guest-WiFi / Unknown','login_failed','3 failed logins, guest network','S-4440',1],
['V5','E01','2027-01-10T22:30:00+04:00','10.20.4.88','Personal-Linux / Firefox','vpn_login','VPN login, 40 min','S-4519',0]].map(([id,emp,ts,ip,device,type,detail,session,flag])=>({id,emp,ts,ip,device,type,detail,session,flag}));
const emails=[
['M1','director@nexora.com','E02','2026-12-14T09:00:00+04:00','Genesis team update','Meera Nair becomes Genesis Verification Lead from January. Nikhil continues on checklist export (GC-212).'],
['M2','E03','director@nexora.com','2027-01-05T08:00:00+04:00','Re: schedule','This timeline is unrealistic. I will keep the fab at midnight if needed.'],
['M3','E04','E02','2027-01-08T16:15:00+04:00','Audit archive ready','Weekly Genesis audit archive downloaded per AUD-88.'],
['M4','E06','E10','2027-01-07T12:00:00+04:00','Weekend leave','At my sister\'s cafe, Orchid Street, Saturday brunch.'],
['M5','E05','E03','2027-01-09T02:20:00+04:00','Guest Wi-Fi reset','Reset done; failed logins came from the guest Wi-Fi.'],
['M6','all@nexora.com','E18','2027-01-08T16:30:00+04:00','Week wrapped','Offices close at 4:30 PM. Enjoy the weekend.']].map(([id,from,to,ts,subject,body])=>({id,from,to,ts,subject,body}));
const locations=[
{id:'L1',name:'NEXORA HQ',x:300,y:200,info:'Main office, Central District'},
{id:'L2',name:'Cafe Zahra',x:520,y:300,info:'Harbor Row. Listed as 10Plan Ragab meetup spot.'},
{id:'L3',name:'10Plan Office',x:420,y:120,info:'Rival office, Orchid District'},
{id:'L4',name:'Chai & Chapters',x:440,y:140,info:'Orchid Street, 2 blocks from 10Plan office'},
{id:'L5',name:'Marina Park',x:560,y:340,info:'Waterfront park next to Harbor Row'}];
const threads=[
{id:'T1',title:'[Ragab] Meetup Sat 9 Jan 11 AM at Cafe Zahra',by:'kestrel_ob',ts:'2027-01-05T09:00:00+04:00',body:'Coffee for anyone in chip verification.',replies:[['kestrel_ob','Table at the back.']]},
{id:'T2',title:'Genesis Chip tape-out checklist (leak)',by:'kestrel_ob',ts:'2027-01-10T23:45:00+04:00',body:'File: GC_tapeout_checklist_v3.pdf. Metadata: producer NEXORA-DLP, watermark NXR-WM S-4471.',replies:[['chipfan','Authentic?'],['kestrel_ob','Source is solid.']]}];
module.exports={employees,posts,chats,follows,tasks,events,emails,locations,threads,target:'Biscuit@Alleppey2019',culprit:'nikhil.v.codes'};
