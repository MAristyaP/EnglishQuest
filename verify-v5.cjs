const {boot}=require('./verify-v4.cjs');
const assert=require('assert'),fs=require('fs'),vm=require('vm');
const ctx={console,Math,Date};vm.createContext(ctx);
for(const file of ['questions.js','questions-extra.js','audio-lessons.js','event-questions.js','picture-questions.js','picture-quest.js','interactive-content.js','interactive-model.js','event-quest.js','learning.js','student-model.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),ctx);
vm.runInContext('globalThis.data={QUESTIONS,TOPICS,EVENT_SYLLABI,EVENT_CONCEPTS,EventQuest,EQ}',ctx);
const {QUESTIONS,TOPICS,EVENT_SYLLABI,EVENT_CONCEPTS,EventQuest,EQ}=ctx.data;
const expected={komperasia:45,omnas:45,ruangguru:48,stemco:48};
const today='2026-09-11';
function stateDays(n){const s=EQ.blank();for(let i=0;i<n;i++)s.attempts.push({id:'words-1',correct:true,date:EQ.addDays(today,-i),seconds:10});return s;}
for(const event of EVENT_SYLLABI){
 const bank=EventQuest.pool(event.id);assert.equal(bank.length,expected[event.id]);
 for(const level of EQ.levels)assert(bank.filter(q=>q.level===level).length>=10);
 for(const c of EVENT_CONCEPTS.filter(c=>c.event===event.id)){
  assert(c.lesson.length>50);for(const level of EQ.levels)assert(bank.some(q=>q.concept===c.id&&q.level===level));
  const mini=EventQuest.plan('concept:'+c.id,stateDays(0),today);assert(mini.questions.length>=3&&mini.questions.length<=5);assert(mini.questions.every(q=>q.concept===c.id));
 }
 assert(EventQuest.plan('event:'+event.id+':training',stateDays(2),today).error);
 assert(EventQuest.plan('event:'+event.id+':exam',stateDays(6),today).error);
 for(const [kind,count,days] of [['daily',5,0],['training',25,3],['exam',30,7]]){
  for(let n=0;n<15;n++){
   const plan=EventQuest.plan('event:'+event.id+':'+kind,stateDays(days),today);
   assert(!plan.error);assert.equal(plan.questions.length,count);assert.equal(new Set(plan.questions.map(q=>q.id)).size,count);assert(plan.questions.every(q=>q.event===event.id));
   if(kind==='exam')for(const level of EQ.levels)assert.equal(plan.questions.filter(q=>q.level===level).length,10);
   if(kind!=='daily')assert(new Set(plan.questions.map(q=>q.concept)).size>=10||new Set(plan.questions.map(q=>q.concept)).size===EVENT_CONCEPTS.filter(c=>c.event===event.id).length);
  }
 }
}
assert(EventQuest.plan('event:unknown:exam',stateDays(7),today).error);
assert(EventQuest.plan('concept:unknown',stateDays(0),today).error);
const future=stateDays(2);future.attempts.push({id:'words-1',correct:true,date:EQ.addDays(today,1),seconds:1});assert(EventQuest.plan('event:omnas:training',future,today).error);
const allNew=new Set();for(let i=0;i<150;i++)for(const x of EQ.adaptive([],QUESTIONS,TOPICS,today,5,EQ.blank()))if(x.q.event)allNew.add(x.q.event);
assert.equal(allNew.size,4,'All events eligible in main daily');
const {t,storage,elements}=boot();
function seed(n){t.reset();for(let i=0;i<n;i++)t.state.attempts.push({id:'words-1',correct:true,date:t.dayAgo(i),seconds:10});}
for(const e of EVENT_SYLLABI){
 seed(3);t.start('event:'+e.id+':training');assert.equal(t.session.questions.length,25);assert(t.session.questions.every(q=>q.event===e.id));assert(!t.session.exam);t.abandon();
 seed(7);t.start('event:'+e.id+':exam');assert(t.session.exam);const id=t.session.questions[0].id;t.answer(t.session.questions[0].answer);assert(!elements.get('#feedback').innerHTML.includes('Jawaban:'));t.leaveSession();
 const reload=boot(storage);reload.t.resume();assert(reload.t.session.exam);assert.equal(reload.t.session.questions[0].id,id);assert(!reload.elements.get('#feedback').innerHTML.includes('Jawaban:'));
 const backup=reload.t.profiles.backup(reload.t.state);assert(backup.profiles.some(p=>p.data.active?.mode==='event:'+e.id+':exam'));
 while(reload.t.session){const s=reload.t.session;if(!s.answered)reload.t.answer(s.questions[s.index].answer);reload.t.next();}
 assert.equal(reload.t.state.runs.at(-1).total,30);assert.equal(reload.t.state.runs.at(-1).correct,30);assert.equal(reload.t.state.runs.at(-1).mode,'event:'+e.id+':exam');
 assert(reload.elements.get('#app').innerHTML.includes('Pembahasan lengkap'));t.abandon();
}
const visuals=QUESTIONS.filter(q=>q.visual);assert.equal(visuals.length,6);for(const q of visuals)assert(EventQuest.visual(q).includes('<figure'));
for(let n=1;n<=3;n++){const svg=fs.readFileSync(__dirname+'/handwriting-'+n+'.svg','utf8');assert(svg.includes('<path'));assert(!svg.includes('<text'));}
console.log('PASS: all 39 mapped concepts covered at 3 levels, 153 new questions, event daily/training/exam selection and gates, no cross-event leakage, visual stimuli, exam reload, results and backups.');
