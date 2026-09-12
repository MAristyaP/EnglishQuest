require('./verify-v5.cjs');
const {boot}=require('./verify-v4.cjs'),assert=require('assert');
const {t,storage}=boot();
const pictured=t.QUESTIONS.filter(q=>q.picture);
assert.equal(pictured.length,36);assert.equal(new Set(pictured.map(q=>q.picture)).size,12);
for(const level of t.LEVELS){assert.equal(pictured.filter(q=>q.level===level).length,12);t.start('picture:'+level);assert.equal(t.session.questions.length,5);assert(t.session.questions.every(q=>q.picture&&q.level===level));t.abandon();}
t.start('picture:all');const oldIds=t.session.questions.map(q=>q.id);t.answer(t.session.questions[0].answer);t.leaveSession();const reload=boot(storage);reload.t.resume();assert.deepEqual([...reload.t.session.questions.map(q=>q.id)],[...oldIds]);assert.equal(reload.t.session.answers.length,1);
t.abandon();
for(let i=0;i<20;i++){t.start('daily');assert(t.session.questions.some(q=>q.picture||q.visual),'Main daily should include a visual');t.abandon();}
for(let i=0;i<7;i++)t.state.attempts.push({id:'words-1',correct:true,date:t.dayAgo(i),seconds:10});
for(const mode of ['training:Explorer','training:Challenger','training:Champion','exam','event:komperasia:exam','event:omnas:exam','event:ruangguru:exam','event:stemco:exam']){t.start(mode);assert(t.session.questions.some(q=>q.picture||q.visual),mode+' lacks visuals');assert.equal(new Set(t.session.questions.map(q=>q.id)).size,t.session.questions.length);t.abandon();}
console.log('PASS: 36 visual questions, 12 scenes, three difficulty modes, picture-session resume, visuals in daily/training/main and event exams.');
