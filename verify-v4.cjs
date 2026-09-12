const fs=require('fs'),vm=require('vm'),assert=require('assert');
module.exports={boot};
const root=__dirname;
const read=f=>fs.readFileSync(root+'/'+f,'utf8');
const bank=['questions.js','questions-extra.js','audio-lessons.js','event-questions.js','picture-questions.js','picture-quest.js','interactive-content.js','interactive-model.js','event-quest.js','option-notes.js','learning.js','student-model.js','profiles.js','features.js','student-ui.js','interactive-ui.js'].map(read).join('\n');
let saved={};
function boot(initial={}){
  const storage={...initial},elements=new Map();
  const el=()=>({innerHTML:'',textContent:'',value:'',style:{},dataset:{},disabled:false,classList:{toggle(){},add(){}},setAttribute(){},addEventListener(){},insertAdjacentHTML(position,html){this.innerHTML+=html;},focus(){}});
  const ctx={console,Date,Math,Set,Map,Blob,URL,setTimeout(){},clearTimeout(){},setInterval(){},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},document:{hidden:false,querySelector:s=>{if(!elements.has(s))elements.set(s,el());return elements.get(s);},querySelectorAll:()=>[],addEventListener(){}},window:{scrollTo(){},addEventListener(){}}};
  Object.defineProperty(ctx,'top',{get:()=>ctx.window,configurable:false});vm.createContext(ctx);
  const api=`globalThis.test={get state(){return state},get session(){return session},get filters(){return missionFilters},get page(){return page},setPage(p){page=p},setFilters(f){missionFilters=f},reset(){state={attempts:[],runs:[],active:null};session=null;missionFilters={term:'',level:'all'}},abandon(){session=null;state.active=null},get features(){return features},get profiles(){return profileManager},reloadProfile(){session=null;state=profileManager.load()},get student(){return student},get interactive(){return interactive},Weekly,Interactive,ACTIVE_TASKS,QUEST_WORDS,StudentModel,EQ,PRACTICE,studyDays,stats,streak,start,answer,next,resume,leaveSession,render,save,matchingQuestions,cards,updateMissions,dateKey,dayAgo,QUESTIONS,TOPICS,LEVELS};`;
  vm.runInContext(bank+'\n'+read('app.js').replace(/\}\)\(\);\s*$/,api+'\n})();'),ctx);
  return {t:ctx.test,storage,elements};
}
const {t,storage,elements}=boot();
assert.equal(t.QUESTIONS.length,437);
assert.equal(new Set(t.QUESTIONS.map(q=>q.id)).size,437);
const original={};vm.createContext(original);vm.runInContext(read('questions.js')+'\nglobalThis.original=QUESTIONS;',original);
for(const old of original.original)assert.equal(t.QUESTIONS.find(q=>q.id===old.id).prompt,old.prompt,'Original IDs must remain stable');
for(const q of t.QUESTIONS){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert(q.explanation.length>15);assert(t.LEVELS.includes(q.level));assert(t.TOPICS.some(t=>t.id===q.topic&&t.tags.includes(q.tag)));}
assert.equal(new Set(t.QUESTIONS.map(q=>q.prompt+'|'+q.passage)).size,437,'Duplicate question text');
for(const topic of t.TOPICS){for(const tag of topic.tags)assert(t.QUESTIONS.some(q=>q.topic===topic.id&&q.tag===tag));for(const level of t.LEVELS)assert(t.QUESTIONS.filter(q=>q.topic===topic.id&&q.level===level).length>=5);}
console.log('PASS: 437 valid questions, stable original IDs, no duplicates, all syllabus topics and levels.');
t.setPage('missions');t.render();const all=elements.get('#filter-status').textContent;
t.setFilters({term:'',level:'Champion'});t.updateMissions();assert.notEqual(elements.get('#filter-status').textContent,all);assert(elements.get('#filter-status').textContent.includes('Champion'));assert(!elements.get('#mission-list').innerHTML.includes('Semua tingkat'));
for(const level of t.LEVELS){t.setFilters({term:'',level});t.start('mixed');assert(t.session.questions.every(q=>q.level===level));t.abandon();}
t.setFilters({term:'pronoun',level:'Champion'});t.updateMissions();assert.equal(t.TOPICS.filter(topic=>t.matchingQuestions(topic).length).length,1);t.start('grammar');assert(t.session.questions.every(q=>q.tag==='Pronoun'&&q.level==='Champion'));t.abandon();
t.setFilters({term:'zzzzz',level:'Champion'});t.updateMissions();assert(elements.get('#mixed-start').disabled);t.start('mixed');assert.equal(t.session,null);t.setFilters({term:'',level:'all'});t.updateMissions();assert(!elements.get('#mixed-start').disabled);
console.log('PASS: all difficulty filters, visible counts, combined topic search, matching session, empty state.');
t.reset();t.start('daily');assert.equal(t.session.questions.length,5);for(let i=0;i<5;i++){t.answer(t.session.questions[t.session.index].answer);t.answer(0);t.next();}assert.equal(t.stats().xp,100);assert.equal(t.state.attempts.length,5);assert.equal(t.state.runs.length,1);assert.equal(t.streak(),1);assert.equal(t.state.active,null);
t.start('grammar');const wrongId=t.session.questions[0].id;t.answer((t.session.questions[0].answer+1)%4);t.leaveSession();assert(t.state.active);const attempts=t.state.attempts.length;t.start('daily');assert.equal(t.session,null);t.resume();assert.equal(t.session.questions[0].id,wrongId);t.answer(0);assert.equal(t.state.attempts.length,attempts);t.next();assert.equal(t.session.index,1);t.leaveSession();
const reloaded=boot(storage);assert.equal(reloaded.t.state.attempts.length,attempts);reloaded.t.resume();assert.equal(reloaded.t.session.index,1);assert.equal(reloaded.t.session.questions[0].id,wrongId);assert.equal(reloaded.t.state.runs.length,1);
t.abandon();t.start('review');assert(t.session.questions.some(q=>q.id===wrongId));t.abandon();
console.log('PASS: scoring, duplicate guard, history, active-session guard, reload/resume, wrong-answer review.');
function seedDays(n){t.reset();for(let i=0;i<n;i++)t.state.attempts.push({id:'words-1',correct:true,date:t.dayAgo(i*2),seconds:10});}
seedDays(2);t.start('training:Explorer');assert.equal(t.session,null);t.start('exam');assert.equal(t.session,null);
seedDays(3);assert.equal(t.studyDays(),3);for(const level of t.LEVELS){t.start('training:'+level);assert.equal(t.session.questions.length,25);assert(t.session.questions.every(q=>q.level===level));assert.equal(new Set(t.session.questions.map(q=>q.id)).size,25);assert.equal(new Set(t.session.questions.map(q=>q.topic)).size,6);t.abandon();}t.start('exam');assert.equal(t.session,null);
seedDays(6);t.start('exam');assert.equal(t.session,null);
seedDays(7);t.state.attempts.push({id:'words-1',correct:true,date:t.dayAgo(0),seconds:10});assert.equal(t.studyDays(),7);
t.start('exam');assert.equal(t.session.questions.length,30);for(const l of t.LEVELS)assert.equal(t.session.questions.filter(q=>q.level===l).length,10);assert.equal(new Set(t.session.questions.map(q=>q.id)).size,30);
for(let i=0;i<30;i++){t.answer(t.session.questions[t.session.index].answer);assert(elements.get('#feedback').innerHTML.includes('Jawaban tersimpan'));assert(!elements.get('#feedback').innerHTML.includes('Jawaban:'));t.next();}
assert.equal(t.state.runs.length,1);assert.equal(t.state.runs[0].total,30);assert.equal(t.state.runs[0].correct,30);assert.equal(t.state.runs[0].xp,600);assert.equal(t.state.active,null);assert(elements.get('#app').innerHTML.includes('Pembahasan lengkap'));t.next();assert.equal(t.state.runs.length,1);
t.start('training:Champion');for(let i=0;i<25;i++){t.answer(t.session.questions[t.session.index].answer);t.next();}assert.equal(t.state.runs.length,2);assert.equal(t.state.runs[1].total,25);
for(const p of ['home','missions','progress','syllabus']){t.setPage(p);t.render();assert(elements.get('#app').innerHTML.length>100);}
assert.equal(JSON.parse(storage['english-quest-v1']).runs.length,2);
console.log('PASS: 2/3/6/7-day locks, nonconsecutive dates, 25 questions per level, balanced 30-question exam, deferred feedback, completion history.');
console.log('Question levels:',Object.fromEntries(t.LEVELS.map(l=>[l,t.QUESTIONS.filter(q=>q.level===l).length])));
t.reset();t.start('adaptive');assert.equal(t.session.questions.length,8);assert(t.session.questions.every(q=>q.level==='Explorer'));assert.equal(new Set(t.session.questions.map(q=>q.id)).size,8);assert.equal(Object.keys(t.session.planReasons).length,8);
t.features.click({id:'hint'});assert(t.session.helped.includes(t.session.questions[0].id));t.answer(t.session.questions[0].answer);assert(t.state.attempts[0].assisted);assert.equal(t.stats().xp,20);t.leaveSession();const hintedReload=boot(storage);hintedReload.t.resume();assert(hintedReload.t.session.helped.length);assert(hintedReload.t.session.answers[0].assisted);t.abandon();
const today=t.dateKey(),yesterday=t.EQ.addDays(today,-1),old=t.EQ.addDays(today,-3);
const attempt=(id,date,correct,assisted=false)=>({id,date,correct,assisted,seconds:10});
let log=[attempt('words-1',old,false),attempt('words-1',old,true)];
let entry=t.EQ.review(log,today)[0];assert.equal(entry.stage,0);assert.equal(entry.due,t.EQ.addDays(old,1));
log.push(attempt('words-1',yesterday,true));entry=t.EQ.review(log,today)[0];assert.equal(entry.stage,1);assert.equal(entry.due,t.EQ.addDays(yesterday,3));
log.push(attempt('words-1',today,true,true));assert.equal(t.EQ.review(log,today)[0].stage,1);
log.push(attempt('words-1',today,false));assert.equal(t.EQ.review(log,today)[0].stage,0);
const grammar=t.PRACTICE.filter(q=>q.topic==='grammar'&&q.level==='Challenger').slice(0,5),words=t.PRACTICE.filter(q=>q.topic==='words'&&q.level==='Challenger').slice(0,5);
const evidence=[...grammar.map(q=>attempt(q.id,old,false)),...words.map(q=>attempt(q.id,today,true))];
const personalised=t.EQ.adaptive(evidence,t.QUESTIONS,t.TOPICS,today);
assert(personalised.filter(x=>x.q.topic==='grammar').length>=2);assert(personalised.some(x=>x.q.topic==='words'));assert(personalised.some(x=>x.reason.includes('waktunya')));
assert.equal(t.EQ.skills(evidence,t.QUESTIONS,t.TOPICS).find(s=>s.id==='words').target,'Champion');
assert.equal(t.EQ.skills(evidence.map(a=>({...a,assisted:true})),t.QUESTIONS,t.TOPICS).find(s=>s.id==='words').sample,0);
const pronouns=t.PRACTICE.filter(q=>q.tag==='Pronoun').slice(0,3),grammarStrong=t.PRACTICE.filter(q=>q.topic==='grammar'&&q.tag!=='Pronoun').slice(0,8);
const conceptEvidence=[...grammarStrong.map(q=>attempt(q.id,today,true)),...pronouns.map(q=>attempt(q.id,today,false))];
assert.equal(t.EQ.concepts(conceptEvidence,t.QUESTIONS).find(c=>c.tag==='Pronoun').accuracy,0);
assert(t.EQ.adaptive(conceptEvidence,t.QUESTIONS,t.TOPICS,today).filter(x=>x.q.tag==='Pronoun').length>=2);
assert.equal(t.EQ.trend([],today).delta,null);
assert(!t.EQ.validDate('2026-02-30'));
console.log('PASS: adaptive cold start, evidence-based level choice, maintenance, hint persistence, review intervals and same-day/assisted guards.');
t.reset();t.start('story:words:1');assert.equal(t.session,null);
for(let chapter=0;chapter<3;chapter++){t.start('story:words:'+chapter);assert.equal(t.session.questions.length,5);assert(t.session.questions.every(q=>q.level===t.LEVELS[chapter]));for(let i=0;i<5;i++){t.answer(t.session.questions[t.session.index].answer);t.next();}assert(t.EQ.chapterWon(t.state.runs,'words',chapter));}
t.start('story:words:99');assert.equal(t.session,null);assert.equal(t.EQ.worlds.length,6);assert(t.EQ.worlds.every(w=>w.chapters.length===3));
t.start('listening:Champion');assert.equal(t.session.questions.length,4);assert(t.session.questions.every(q=>q.listening&&q.transcript));t.features.click({id:'transcript'});assert(t.session.helped.length);t.abandon();
for(const p of ['story','notebook','audio','parents','profiles']){t.setPage(p);t.render();assert(elements.get('#app').innerHTML.length>100);}
console.log('PASS: story chapter gates and earned relics, 12 listening lessons, transcript assistance, five new pages.');
const originalState={attempts:[attempt('words-1',today,true)],runs:[],active:null};
const isolated=boot({'english-quest-v1':JSON.stringify(originalState)});const p=isolated.t.profiles;assert.equal(isolated.t.state.attempts.length,1);
p.persist(isolated.t.state);const second=p.create('Nara','🦊');p.select(second.id);isolated.t.reloadProfile();assert.equal(isolated.t.state.attempts.length,0);
isolated.t.start('adaptive');isolated.t.answer(isolated.t.session.questions[0].answer);isolated.t.leaveSession();p.select('default');isolated.t.reloadProfile();assert.equal(isolated.t.state.attempts.length,1);assert.equal(isolated.t.state.active,null);
const backup=p.backup(isolated.t.state);assert.equal(backup.profiles.length,2);assert(backup.profiles[1].data.active);
const imported=p.validateBackup(JSON.parse(JSON.stringify(backup)));p.append(imported);assert.equal(p.meta.profiles.length,4);assert.equal(JSON.parse(isolated.storage['english-quest-v1']).attempts.length,1);
assert.throws(()=>p.validateBackup({format:'Other',version:1,profiles:[]}));
const broken=JSON.parse(JSON.stringify(backup));broken.profiles[0].data.attempts[0].id='unknown-id';assert.throws(()=>p.validateBackup(broken));
p.rename('<img src=x>');assert.equal(p.current().name,'<img src=x>');isolated.t.setPage('profiles');isolated.t.render();assert(!isolated.elements.get('#app').innerHTML.includes('<img src=x>'));
const data={};let failMeta=false;const mockStore={getItem:k=>data[k]??null,setItem(k,v){if(failMeta&&k==='english-quest-profiles-v1')throw Error('quota');data[k]=v},removeItem:k=>delete data[k]};
const TestProfiles=p.constructor,rollback=new TestProfiles(mockStore,t.QUESTIONS);failMeta=true;assert.throws(()=>rollback.create('Failure'));assert.equal(Object.keys(data).length,0);assert.equal(rollback.meta.profiles.length,1);
console.log('PASS: legacy data migration, independent profiles and sessions, full backup/restore, invalid backups, escaped names, quota rollback.');
t.reset();t.start('daily');const dailyId=t.session.id;
t.student.setConfidence('guess');t.student.flag();const firstId=t.session.questions[0].id;t.answer(t.session.questions[0].answer);
assert.equal(t.state.attempts[0].confidence,'guess');assert(t.state.attempts[0].confused);const answerCount=t.state.attempts.length;
t.student.setConfidence('sure');assert.equal(t.session.confidences[firstId],'guess','Confidence locked after answer');
t.leaveSession();const flagReload=boot(storage);flagReload.t.resume();assert.equal(flagReload.t.session.confidences[firstId],'guess');assert(flagReload.t.session.confusedIds.includes(firstId));assert.equal(flagReload.t.session.answers[0].confidence,'guess');
t.resume();t.student.flag();assert(!t.state.attempts[0].confused);t.student.flag();assert(t.state.attempts[0].confused);
for(let i=0;i<5;i++){if(!t.session.answered)t.answer(t.session.questions[t.session.index].answer);t.next();}
assert.equal(t.state.attempts.length,5);assert(elements.get('#app').innerHTML.includes('reflection-form'));const scoreBefore=t.stats().xp;
const reflection=t.StudentModel.create(t.state,dailyId,{mood:'confused',difficulties:['grammar'],help:'steps',note:'Aku masih bingung dengan tenses.',questionIds:[firstId]},today,t.QUESTIONS);
t.state.reflections=[reflection];t.save();assert.equal(t.stats().xp,scoreBefore);assert.equal(t.StudentModel.evidence(t.state,dailyId).guessedCorrect,1);
assert.throws(()=>t.StudentModel.create(t.state,dailyId,reflection,today,t.QUESTIONS),'Duplicate survey');
assert.throws(()=>t.StudentModel.create(t.state,'missing',{mood:'tired',difficulties:['focus'],help:'break',note:''},today,t.QUESTIONS));
const invalidRef={...reflection,difficulties:['none','grammar']};assert.throws(()=>t.StudentModel.normalise({reflections:[invalidRef]},t.state.attempts,t.state.runs,t.QUESTIONS,true));
assert.throws(()=>t.StudentModel.normalise({reflections:[{...reflection,questionIds:['listening-12']}]},t.state.attempts,t.state.runs,t.QUESTIONS,true));
const support=t.StudentModel.support(t.state,reflection,t.QUESTIONS);assert.equal(support.questions.length,3);assert(support.questions.every(q=>q.topic==='grammar'&&q.level==='Explorer'));
t.start('support:'+dailyId);assert.equal(t.session.questions.length,3);assert(t.session.questions.every(q=>q.topic==='grammar'));t.abandon();
t.start('daily');assert(t.session.questions.filter(q=>q.topic==='grammar').length>=2);assert(Object.values(t.session.planReasons).some(x=>x.startsWith('Dari ceritamu')));t.abandon();
const rest={...reflection,help:'break',difficulties:['focus'],questionIds:[]};assert(t.StudentModel.support(t.state,rest,t.QUESTIONS).rest);assert.equal(t.StudentModel.support(t.state,rest,t.QUESTIONS).questions.length,0);
const plainBase=t.EQ.adaptive(t.state.attempts,t.QUESTIONS,t.TOPICS,today,8);
assert.strictEqual(t.StudentModel.blend(plainBase,{...t.state,reflections:[rest]},t.QUESTIONS,today,8),plainBase);
assert.strictEqual(t.StudentModel.blend(plainBase,{...t.state,reflections:[{...reflection,difficulties:['none']}]},t.QUESTIONS,today,8),plainBase,'No difficulty is not an academic deficit');
assert.strictEqual(t.StudentModel.blend(plainBase,{...t.state,reflections:[{...reflection,difficulties:['focus']}]},t.QUESTIONS,today,8),plainBase,'Focus alone must not be labelled as a grammar deficit');
const dueCheck=t.EQ.addDays(today,3);assert.equal(t.StudentModel.dueDate(reflection),dueCheck);assert.throws(()=>t.StudentModel.checkIn(reflection,'better',today));
const same=t.StudentModel.checkIn(reflection,'same',dueCheck);assert.equal(t.StudentModel.dueDate(same),t.EQ.addDays(dueCheck,3));
const better=t.StudentModel.checkIn(same,'better',t.EQ.addDays(dueCheck,3));assert.equal(t.StudentModel.dueDate(better),null);
const savedFeedback=boot(storage);assert.equal(savedFeedback.t.state.reflections.length,1);assert.equal(savedFeedback.t.state.reflections[0].note,reflection.note);assert.equal(savedFeedback.t.state.attempts[0].confidence,'guess');
const roundTrip=t.profiles.validateBackup(t.profiles.backup(t.state));assert.equal(roundTrip[0].data.reflections.length,1);assert.equal(roundTrip[0].data.attempts[0].confused,true);
const blankProfile=t.profiles.create('Separate reflection');t.profiles.select(blankProfile.id);t.reloadProfile();assert.equal(t.state.reflections.length,0);t.profiles.select('default');t.reloadProfile();assert.equal(t.state.reflections.length,1);
t.state.reflections[0].note='<img src=x onerror=alert(1)>';t.setPage('student');t.render();assert(!elements.get('#app').innerHTML.includes('<img src=x'));t.setPage('parents');t.render();assert(elements.get('#app').innerHTML.includes('Suara siswa'));assert(!elements.get('#app').innerHTML.includes('<img src=x'));
console.log('PASS: optional confidence, confusion marks, reload, reflection validation, no score impact, personalised support, rest choice, 3-day followups, isolation, backups, escaped notes.');
