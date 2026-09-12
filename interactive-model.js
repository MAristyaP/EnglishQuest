const Interactive=(()=>{
 const task=q=>q&&ACTIVE_TASKS[q.id],isActive=s=>!!s?.mode?.startsWith('play:')&&!!task(s.questions?.[s.index]);
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 function fresh(q){const t=task(q);return {qid:q.id,order:[],bankOrder:t?.tokens?shuffle(t.tokens.map((_,i)=>i)):[],choice:null,proof:null,part:null,replacement:null,path:[]};}
 function nodeFor(t,path){let node='start';for(const step of path){if(!node||step.node!==node||!t.nodes[node]?.choices[step.choice])return undefined;node=t.nodes[node].choices[step.choice].next;}return node;}
 function draft(raw,q,strict=false){
  if(raw==null)return null;const t=task(q),int=(v,n)=>v===null||Number.isInteger(v)&&v>=0&&v<n;
  let valid=!!t&&raw.qid===q.id&&Array.isArray(raw.order)&&Array.isArray(raw.bankOrder)&&Array.isArray(raw.path)&&raw.path.length<=4;
  if(valid&&t.kind==='order')valid=raw.order.length<=t.tokens.length&&new Set(raw.order).size===raw.order.length&&raw.order.every(v=>int(v,t.tokens.length)&&v!==null)&&raw.bankOrder.length===t.tokens.length&&new Set(raw.bankOrder).size===t.tokens.length&&raw.bankOrder.every(v=>int(v,t.tokens.length)&&v!==null);
  if(valid&&t.kind==='evidence')valid=int(raw.choice,4)&&int(raw.proof,t.sentences.length);
  if(valid&&t.kind==='edit')valid=int(raw.part,t.chunks.length)&&int(raw.replacement,t.replacements.length);
  if(valid&&t.kind==='dialogue')valid=raw.path.every(s=>s&&typeof s.node==='string'&&Number.isInteger(s.choice))&&nodeFor(t,raw.path)!==undefined;
  if(!valid){if(strict)throw Error('Draf aktivitas interaktif tidak valid.');return null;}
  const clean=fresh(q);if(t.kind==='order'){clean.order=[...raw.order];clean.bankOrder=[...raw.bankOrder];}if(t.kind==='evidence'){clean.choice=raw.choice;clean.proof=raw.proof;}if(t.kind==='edit'){clean.part=raw.part;clean.replacement=raw.replacement;}if(t.kind==='dialogue')clean.path=raw.path.map(s=>({node:s.node,choice:s.choice}));return clean;
 }
 function evaluate(q,raw){
  const t=task(q),d=draft(raw,q);if(!d)return {complete:false};
  let complete=false,correct=false,response='',selected=1,detail='';
  if(t.kind==='order'){complete=d.order.length===t.tokens.length;response=d.order.map(i=>t.tokens[i]).join(' ');correct=response===t.tokens.join(' ');selected=correct?q.answer:Math.max(1,q.options.indexOf(response));detail='Urutan yang tepat: '+t.tokens.join(' ');}
  if(t.kind==='evidence'){complete=d.choice!==null&&d.proof!==null;const proofCorrect=(t.proofs||[t.proof]).includes(d.proof);correct=d.choice===q.answer&&proofCorrect;selected=d.choice??0;response=(q.options[d.choice]||'Belum dipilih')+' · Bukti: '+(t.sentences[d.proof]||'Belum dipilih');detail='Jawaban '+(d.choice===q.answer?'tepat':'belum tepat')+'; bukti '+(proofCorrect?'tepat':'belum tepat')+'. Bukti yang mendukung: '+t.sentences[t.proof];}
  if(t.kind==='edit'){complete=d.part!==null&&d.replacement!==null;correct=d.part===t.bad&&d.replacement===t.repair;selected=d.replacement??0;response=t.chunks.map((c,i)=>i===d.part?t.replacements[d.replacement]||c:c).join(' ');detail='Bagian yang diperbaiki: “'+t.chunks[t.bad]+'” → “'+t.replacements[t.repair]+'”. Kalimat: '+t.fixed;}
  if(t.kind==='dialogue'){complete=nodeFor(t,d.path)===null;correct=complete&&d.path.every(s=>t.nodes[s.node].choices[s.choice].good);selected=d.path[0]?.choice??0;response=d.path.map(s=>t.nodes[s.node].choices[s.choice].text).join(' → ');detail=d.path.map(s=>t.nodes[s.node].choices[s.choice].reply).join(' ');}
  return {complete,correct,response,selected,detail};
 }
 function answerData(a,bank,strict=false){
  if(a.interaction==null)return undefined;const q=bank.find(q=>q.id===a.id),clean=draft(a.interaction.draft,q,strict),result=clean?evaluate(q,clean):null;
  if(!result?.complete||result.correct!==a.correct){if(strict)throw Error('Hasil aktivitas tidak cocok dengan jawabannya.');return undefined;}return {draft:clean};
 }
 function lexicon(raw,strict=false){
  if(raw==null)return {saved:[],reviews:[],custom:[]};const known=new Set(QUEST_WORDS.map(w=>w.id)),custom=Array.isArray(raw.custom)?raw.custom:[];
  const customOK=w=>w&&/^personal-[a-z0-9-]+$/.test(w.id)&&typeof w.word==='string'&&w.word.trim().length>0&&w.word.length<=50&&typeof w.meaning==='string'&&w.meaning.trim().length>0&&w.meaning.length<=150&&typeof w.example==='string'&&w.example.length<=300&&(w.picture===undefined||Object.hasOwn(PictureQuest.scenes,w.picture));
  const safeCustom=custom.filter(customOK).slice(0,200);safeCustom.forEach(w=>known.add(w.id));
  const saveOK=s=>s&&known.has(s.id)&&EQ.validDate(s.date),reviewOK=r=>r&&known.has(r.id)&&EQ.validDate(r.date)&&typeof r.correct==='boolean'&&typeof r.assisted==='boolean'&&['quiz','self'].includes(r.type);
  if(strict&&(!Array.isArray(raw.saved)||!Array.isArray(raw.reviews)||raw.custom!==undefined&&!Array.isArray(raw.custom)||raw.saved.length>224||raw.reviews.length>10000||custom.length>200||custom.some(w=>!customOK(w))||new Set(custom.map(w=>w.id)).size!==custom.length||raw.saved.some(s=>!saveOK(s))||new Set(raw.saved.map(s=>s.id)).size!==raw.saved.length||raw.reviews.some(r=>!reviewOK(r))))throw Error('Kamus pribadi pada cadangan tidak valid.');
  return {custom:safeCustom.map(w=>({id:w.id,word:w.word,meaning:w.meaning,example:w.example,...(w.picture?{picture:w.picture}:{})})),saved:[...new Map((Array.isArray(raw.saved)?raw.saved:[]).filter(saveOK).map(s=>[s.id,{id:s.id,date:s.date}])).values()].slice(0,224),reviews:(Array.isArray(raw.reviews)?raw.reviews:[]).filter(reviewOK).slice(-10000).map(r=>({id:r.id,date:r.date,correct:r.correct,assisted:r.assisted,type:r.type}))};
 }
 function wordStatus(state,id,today){let stage=0,last=null,due=state.lexicon?.saved.find(s=>s.id===id)?.date||today;for(const r of state.lexicon?.reviews||[]){if(r.id!==id||r.date>today)continue;if(!r.correct){stage=0;due=EQ.addDays(r.date,1);last=r.date;}else if(!r.assisted&&r.date!==last){stage=Math.min(4,stage+1);last=r.date;due=EQ.addDays(r.date,[1,1,3,7,14][stage]);}}return {stage,due,dueNow:due<=today};}
 function plan(mode,state,today){
  if(!mode.startsWith('play:'))return null;const [,kind,requested='all']=mode.split(':'),levels=['all',...EQ.levels];if(!levels.includes(requested)||!['daily','order','evidence','edit','dialogue','words'].includes(kind))return {error:'Aktivitas tidak ditemukan.'};
  const seen=new Map();for(const a of state.attempts)seen.set(a.id,(seen.get(a.id)||0)+1);
  const rank=a=>shuffle(a).sort((a,b)=>(seen.get(a.id)||0)-(seen.get(b.id)||0));let pool=QUESTIONS.filter(q=>q.activity&&(requested==='all'||q.level===requested)),questions=[];
  if(kind==='words'){const ids=new Set((state.lexicon?.saved||[]).map(s=>s.id));questions=rank(QUESTIONS.filter(q=>q.wordId&&ids.has(q.wordId))).sort((a,b)=>Number(wordStatus(state,b.id,today).dueNow)-Number(wordStatus(state,a.id,today).dueNow)).slice(0,5);if(!questions.length)return {error:'Simpan kata dari koleksi untuk membuka kuis. Kata buatanmu tersedia dalam kartu ingatan.'};}
  else if(kind==='daily'){const target=requested==='all'?'Explorer':requested;pool=QUESTIONS.filter(q=>q.activity&&q.level===target);for(const type of ['order','evidence','edit','dialogue'])questions.push(rank(pool.filter(q=>q.activity===type))[0]);questions=questions.filter(Boolean);const due=QUESTIONS.find(q=>q.wordId&&q.level===target&&state.lexicon?.saved.some(s=>s.id===q.id)&&wordStatus(state,q.id,today).dueNow);questions.push(due||rank(pool.filter(q=>!questions.includes(q)))[0]);questions=questions.filter(Boolean);}
  else questions=rank(pool.filter(q=>q.activity===kind)).slice(0,kind==='dialogue'?1:5);
  return {questions,title:({daily:'Daily interaktif',order:'Susun Kalimat',evidence:'Cari Bukti',edit:'Bengkel Kalimat',dialogue:'Percakapan Bercabang',words:'Kuis Kamus Petualang'})[kind]+' · '+(requested==='all'?(kind==='daily'?'Explorer':'Campuran'):requested),level:kind==='daily'&&requested==='all'?'Explorer':requested};
 }
 return {task,isActive,fresh,draft,nodeFor,evaluate,answerData,lexicon,wordStatus,plan};
})();
