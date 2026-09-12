require('./verify-v6.cjs');
const {boot}=require('./verify-v4.cjs'),assert=require('assert');
const {t,storage,elements}=boot(),I=t.Interactive;
function complete(q){const a=t.ACTIVE_TASKS[q.id],d=I.fresh(q);if(a.kind==='order')d.order=a.tokens.map((_,i)=>i);if(a.kind==='evidence'){d.choice=q.answer;d.proof=a.proof;}if(a.kind==='edit'){d.part=a.bad;d.replacement=a.repair;}if(a.kind==='dialogue'){let node='start';while(node){const choice=a.nodes[node].choices.findIndex(c=>c.good);d.path.push({node,choice});node=a.nodes[node].choices[choice].next;}}return d;}
assert.equal(Object.keys(t.ACTIVE_TASKS).length,30);assert.equal(t.QUEST_WORDS.length,24);
for(const q of t.QUESTIONS.filter(q=>q.activity)){
 const d=complete(q),r=I.evaluate(q,d);assert(r.complete&&r.correct,q.id);assert(I.draft(d,q,true));
 const wrong=I.fresh(q),a=t.ACTIVE_TASKS[q.id];if(a.kind==='order'){wrong.order=a.tokens.map((_,i)=>i).reverse();}if(a.kind==='evidence'){wrong.choice=q.answer;wrong.proof=(a.proof+2)%a.sentences.length;if((a.proofs||[a.proof]).includes(wrong.proof))wrong.proof=2;}if(a.kind==='edit'){wrong.part=(a.bad+1)%a.chunks.length;wrong.replacement=a.repair;}if(a.kind!=='dialogue')assert(!I.evaluate(q,wrong).correct,q.id+' accepts incorrect component');
 if(a.kind==='dialogue'){
  let terminals=0;function walk(path,node){if(node===null){terminals++;const x=I.fresh(q);x.path=path;const r=I.evaluate(q,x);assert(r.complete);assert.equal(r.correct,path.every(s=>a.nodes[s.node].choices[s.choice].good));return;}assert(path.length<4,'Dialogue cycle');a.nodes[node].choices.forEach((c,choice)=>walk([...path,{node,choice}],c.next));}walk([],'start');assert(terminals>=6);
 }
}
for(const mode of ['order','evidence','edit','dialogue','daily'])for(const level of t.LEVELS){
 t.reset();t.start('play:'+mode+':'+level);assert(t.session&&t.session.questions.every(q=>q.level===level));assert.equal(t.session.questions.length,mode==='daily'?5:mode==='dialogue'?1:3);
 const q=t.session.questions[0],d=complete(q),r=I.evaluate(q,d);t.answer(r.selected,{draft:d});t.answer(r.selected,{draft:d});assert.equal(t.state.attempts.length,1);assert.equal(t.stats().xp,20);assert(t.state.attempts[0].interaction);t.leaveSession();
 const reload=boot(storage);reload.t.resume();assert(reload.t.session.answers[0].interaction);assert.equal(reload.t.session.answered,true);assert(!reload.elements.get('#feedback').innerHTML.includes('undefined'));
 assert(reload.t.profiles.validateBackup(reload.t.profiles.backup(reload.t.state))[0].data.active.answers[0].interaction);t.abandon();
}
t.reset();t.start('play:order:Explorer');let q=t.session.questions[0],draft=I.fresh(q);draft.order=[draft.bankOrder[0]];t.session.interactiveDraft=draft;t.leaveSession();const reload=boot(storage);reload.t.resume();assert.deepEqual([...reload.t.session.interactiveDraft.order],[...draft.order]);
const invalid=JSON.parse(JSON.stringify(reload.t.state));invalid.active.interactiveDraft.order=[0,0];assert.throws(()=>t.EQ.normalise(invalid,t.QUESTIONS,true));
t.abandon();t.reset();t.start('play:evidence:Explorer');q=t.session.questions[0];draft=complete(q);draft.proof=(draft.proof+1)%3;t.answer(q.answer,{draft});assert(!t.state.attempts[0].correct);assert.equal(t.state.attempts[0].selected,q.answer);assert.equal(t.stats().xp,5);assert(t.EQ.normalise(t.state,t.QUESTIONS,true).attempts[0].interaction);t.abandon();
const today=t.dateKey(),id=t.QUEST_WORDS[0].id;t.state.lexicon={saved:[{id,date:today}],custom:[],reviews:[]};assert(I.wordStatus(t.state,id,today).dueNow);
t.start('play:daily:Explorer');for(let n=0;n<4;n++){const cq=t.session.questions[t.session.index],cd=complete(cq);t.answer(I.evaluate(cq,cd).selected,{draft:cd});t.next();}assert.equal(t.session.questions[t.session.index].wordId,id);assert.equal(t.session.interactiveDraft,null);assert(t.profiles.validateBackup(t.profiles.backup(t.state))[0].data.active);t.leaveSession();const mixedReload=boot(storage);mixedReload.t.resume();assert.equal(mixedReload.t.session.questions[mixedReload.t.session.index].wordId,id);t.abandon();
t.start('play:words');assert.equal(t.session.questions.length,1);t.answer(t.session.questions[0].answer);assert.equal(t.state.lexicon.reviews.length,1);assert.equal(I.wordStatus(t.state,id,today).due,t.EQ.addDays(today,1));t.next();
t.start('play:words');t.answer(t.session.questions[0].answer);assert.equal(I.wordStatus(t.state,id,today).stage,1,'Same-day repeat advances memory');t.next();
const nextDay=t.EQ.addDays(today,1);t.state.lexicon.reviews.push({id,date:nextDay,correct:true,assisted:false,type:'quiz'});assert.equal(I.wordStatus(t.state,id,nextDay).due,t.EQ.addDays(nextDay,3));
t.state.lexicon.custom.push({id:'personal-test',word:'<img src=x>',meaning:'<script>bad</script>',example:'literal & safe',picture:'family'});t.state.lexicon.saved.push({id:'personal-test',date:today});assert.equal(t.EQ.normalise(t.state,t.QUESTIONS,true).lexicon.custom[0].picture,'family');t.interactive.change({target:{id:'word-filter',value:'saved'}});assert(!t.interactive.dictionary().includes('<img src=x>'));assert(t.interactive.dictionary().includes('&lt;img'));
assert.throws(()=>I.lexicon({saved:[],reviews:[],custom:'bad'},true));assert.throws(()=>I.lexicon({saved:[{id:'unknown',date:today}],reviews:[],custom:[]},true));
t.save();const saved=t.profiles.backup(t.state);assert(saved.profiles[0].data.lexicon.custom.length===1);const added=t.profiles.create('Separate child');t.profiles.select(added.id);t.reloadProfile();assert.equal(t.state.lexicon.saved.length,0);assert(!t.state.attempts.some(a=>a.interaction));
console.log('PASS: 30 interactive tasks, all dialogue paths, 24 vocabulary cards, level selection, component scoring, duplicate guards, draft/answer reload, backup validation, memory intervals, custom-word escaping and profile isolation.');
