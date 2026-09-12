'use strict';
// Isolate app names from browser globals such as window.top.
(() => {
const $=s=>document.querySelector(s), KEY='english-quest-v1';
const LEVELS=['Explorer','Challenger','Champion'];
const PRACTICE=QUESTIONS.filter(q=>!q.listening);
let profileManager,features,student,events,interactive;
let state={attempts:[],runs:[],active:null},page='home',session=null,storageOK=true;
let missionFilters={term:'',level:'all'},accuracyScope='all';
try{
  profileManager=new QuestProfiles(localStorage,QUESTIONS);state=profileManager.load();
}catch(e){storageOK=false;profileManager=new QuestProfiles(null,QUESTIONS);state=EQ.blank();}

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function dateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function dayAgo(n){let d=new Date();d.setDate(d.getDate()-n);return dateKey(d);}
function stats(list=state.attempts){const correct=list.filter(a=>a.correct).length;return{total:list.length,correct,xp:correct*20+(list.length-correct)*5,accuracy:list.length?Math.round(correct/list.length*100):0,minutes:Math.round(list.reduce((s,a)=>s+a.seconds,0)/60)};}
function streak(){let n=0,start=state.attempts.some(a=>a.date===dayAgo(0))?0:1;while(state.attempts.some(a=>a.date===dayAgo(start+n)))n++;return n;}
function save(){try{profileManager.persist(state);storageOK=true;return true;}catch(e){storageOK=false;toast('Penyimpanan browser tidak tersedia. Jangan tutup halaman; ekspor cadangan sebelum keluar.');return false;}}
function toast(msg){$('#toast').textContent=msg;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',4500);}
function top(){features?.updateProfile();let s=stats();$('#streak').textContent=`🔥 ${streak()} hari`;$('#level').textContent=`✦ Level ${1+Math.floor(s.xp/200)}`;document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));}
function statCards(){let s=stats();return `<div class="stats">${[['✦',s.xp,'Total XP'],['🎯',s.total?s.accuracy+'%':'—','Akurasi jawaban'],['📚',s.total,'Soal dikerjakan'],['⏱',s.minutes+' mnt','Waktu belajar aktif']].map(x=>`<div class="stat"><span class="stat-icon">${x[0]}</span><div><strong>${x[1]}</strong><small>${x[2]}</small></div></div>`).join('')}</div>`;}
function matchingQuestions(t,filters=missionFilters){
  const term=filters.term.trim().toLowerCase();
  const topicMatch=t&&(t.name+' '+t.desc).toLowerCase().includes(term);
  return PRACTICE.filter(q=>(!t||q.topic===t.id)&&(filters.level==='all'||q.level===filters.level)&&
    (!term||topicMatch||q.tag.toLowerCase().includes(term)||(q.event&&q.event.includes(term))||(!t&&TOPICS.find(t=>t.id===q.topic).name.toLowerCase().includes(term))));
}
function cards(topics=TOPICS,filters={term:'',level:'all'}){
  return '<div class="missions">'+topics.map(t=>{
    const pool=matchingQuestions(t,filters);
    if(!pool.length)return '';
    const label=filters.level==='all'?'Semua tingkat':filters.level;
    return `<article class="mission" style="--tint:${t.color}"><div class="mission-top"><span class="mission-icon">${t.icon}</span><span class="tag">${pool.length} soal · ${label}</span></div><h3>${t.name}</h3><p>${t.desc}</p><div class="level-label">${label} · ${[...new Set(pool.map(q=>q.tag))].length} subtopik</div><div class="mission-bottom"><span>${Math.min(5,pool.length)} soal / misi · +20 XP / benar</span><button data-start="${t.id}" aria-label="Mulai ${t.name} ${label}">Main →</button></div></article>`;
  }).join('')+'</div>';
}
function updateMissions(){
  const topics=TOPICS.filter(t=>matchingQuestions(t).length);
  const count=topics.reduce((n,t)=>n+matchingQuestions(t).length,0);
  $('#mission-list').innerHTML=topics.length?cards(topics,missionFilters):'<div class="empty">Tidak ada soal yang cocok. Coba topik atau tingkat lain.</div>';
  $('#filter-status').textContent=`${missionFilters.level==='all'?'Semua tingkat':missionFilters.level} · ${topics.length} dunia · ${count} soal cocok${missionFilters.term?' · pencarian: '+missionFilters.term:''}`;
  $('#mixed-start').disabled=!count;
}
function chart(){const days=Array.from({length:7},(_,i)=>dayAgo(6-i));const values=days.map(d=>state.attempts.filter(a=>a.date===d).length),max=Math.max(5,...values);return `<div class="chart" role="img" aria-label="Jumlah soal per hari: ${days.map((d,i)=>d+': '+values[i]).join(', ')}">${days.map((d,i)=>`<div class="chart-col ${i===6?'today':''}"><span>${values[i]}</span><div class="bar-track"><div class="bar" style="height:${values[i]/max*100}%"></div></div><span>${new Date(d+'T12:00:00').toLocaleDateString('id-ID',{weekday:'short'})}</span><span>${d.slice(8)}/${d.slice(5,7)}</span></div>`).join('')}</div>`;}
function home(){let today=state.attempts.filter(a=>a.date===dateKey()).length;return `<div class="title-row"><h1>Halo, ${esc(profileManager.current().name)}! 👋</h1><span class="tag">${new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</span></div><p class="sub">Siap menemukan hal baru dan selangkah lebih dekat jadi juara?</p><section class="hero"><div class="hero-content"><div class="eyebrow">YOUR NEXT GREAT ADVENTURE</div><h2>Small steps.<br>Brilliant English.</h2><p>Taklukkan tantangan olimpiade, kumpulkan bintang, dan tumbuh jadi penjelajah bahasa yang percaya diri.</p><button class="primary" data-start="daily">Mulai tantangan hari ini ↗</button></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="planet">🚀</div><div class="float a">Aa ✦</div><div class="float b">A+</div><div class="float c">🏆 Future champion</div><span class="spark">✧</span></div></section>${features.adaptiveCard()}${student.widget()}${statCards()}<div class="section-head"><h2>Pilih petualanganmu</h2><button class="text-btn" data-page="missions">Lihat semua misi →</button></div>${cards(TOPICS.slice(0,3))}<div class="lower"><section class="panel"><div class="title-row"><h2>Langkah kecil, progres nyata</h2><span class="tag">7 hari terakhir</span></div><p>Jumlah soal yang kamu kerjakan setiap hari.</p>${chart()}</section><section class="panel daily"><span class="big-icon">🎯</span><h3>Misi harian:<br>5 soal, satu langkah maju!</h3><p>Bangun kebiasaan belajar. Kamu sudah mengerjakan <b>${today} dari 5 soal</b> hari ini.</p><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,today/5*100)}%"></div></div><button class="text-btn" data-start="daily">${today>=5?'Target tercapai! Main lagi':'Selesaikan misi'} →</button></section></div>`;}
function missions(){return `<h1>Peta petualanganmu 🧭</h1><p class="sub">Pilih tingkat dan topik. Jumlah soal serta misi akan langsung mengikuti pilihanmu.</p><section class="panel event-intro"><h2>Siap untuk olimpiade? 🏆</h2><p>KOMPERASIA, OMNAS, RUANGGURU, dan STEMCO: pilih bekal materi, daily, latihan, atau ujian event.</p><button class="primary" data-page="syllabus">Pilih event olimpiade →</button></section><div class="filters"><input id="search" value="${esc(missionFilters.term)}" placeholder="Cari topik, misalnya pronoun…" aria-label="Cari topik"><select id="difficulty" aria-label="Tingkat kesulitan"><option value="all" ${missionFilters.level==='all'?'selected':''}>Semua tingkat</option>${LEVELS.map(l=>'<option '+(missionFilters.level===l?'selected':'')+'>'+l+'</option>').join('')}</select><button class="primary" id="mixed-start" data-start="mixed">Latihan campuran ↗</button><button class="text-btn" id="reset-filters">Reset filter</button></div><p class="notice">Explorer: fondasi · Challenger: penerapan · Champion: penalaran lebih lanjut. Pencarian subtopik juga menyaring soal yang dimainkan.</p><p id="filter-status" class="filter-status" role="status" aria-live="polite"></p><div id="mission-list"></div>${milestones()}<div class="section-head"><h2>Belajar dari kesalahan</h2></div><div class="panel"><p>Ulangi soal yang jawaban terakhirmu masih salah dari semua tingkat. XP tetap didapat dari setiap usaha; akurasi menghitung semua percobaan.</p><button class="secondary" data-start="review">🔁 Latih lagi soal yang sulit</button></div>`;}
function studyDays(){return new Set(state.attempts.filter(a=>a.date<=dateKey()).map(a=>a.date)).size;}
function milestones(){
  const days=studyDays(),training=days>=3,exam=days>=7;
  return `<div class="section-head"><h2>Akademi juara</h2><span class="tag">${days} hari belajar</span></div><p class="notice">Satu hari belajar = satu tanggal dengan minimal satu jawaban tercatat. Tidak harus berturut-turut. Paket yang terbuka bisa dimainkan lagi.</p><div class="milestone-grid"><section class="panel milestone training"><div class="title-row"><span class="big-icon">🏅</span><span class="tag">${training?'Terbuka':'🔒 Butuh 3 hari belajar'}</span></div><h3>Latihan hari ke-3</h3><p><b>25 soal per tingkat.</b> Pilih Explorer, Challenger, atau Champion. Pembahasan langsung membantu kamu berlatih lebih dalam.</p><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,days/3*100)}%"></div></div><small>${Math.min(days,3)} / 3 hari${training?' · Siap dimainkan':' · '+(3-days)+' hari lagi'}</small><div class="milestone-actions">${LEVELS.map(l=>`<button class="secondary" data-start="training:${l}" ${training?'':'disabled'}>${l} · 25 soal</button>`).join('')}</div></section><section class="panel milestone exam"><div class="title-row"><span class="big-icon">🏆</span><span class="tag">${exam?'Terbuka':'🔒 Butuh 7 hari belajar'}</span></div><h3>Ujian hari ke-7</h3><p><b>30 soal gabungan:</b> 10 Explorer, 10 Challenger, dan 10 Champion. Nilai serta pembahasan ditampilkan setelah ujian selesai.</p><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,days/7*100)}%"></div></div><small>${Math.min(days,7)} / 7 hari${exam?' · Saatnya unjuk kemampuan':' · '+(7-days)+' hari lagi'}</small><div class="milestone-actions"><button class="primary" data-start="exam" ${exam?'':'disabled'}>Mulai ujian · 30 soal →</button></div></section></div>`;
}
function runHistory(){
  return '<div class="section-head"><h2>Hasil misi, latihan & ujian</h2></div><section class="panel">'+(state.runs.length?`<div class="table-scroll"><table class="history"><thead><tr><th>Tanggal</th><th>Paket</th><th>Benar</th><th>Nilai</th><th>XP</th></tr></thead><tbody>${[...state.runs].reverse().map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.title)}</td><td>${r.correct}/${r.total}</td><td>${Math.round(r.correct/r.total*100)}%</td><td>${r.xp}</td></tr>`).join('')}</tbody></table></div>`:'<p class="empty">Selesaikan satu paket untuk melihat nilainya di sini. Jawaban dari misi yang belum selesai tetap masuk catatan harian.</p>')+'</section>';
}
function resumeCard(){
  if(!state.active)return '';
  return `<section class="panel resume-card"><div><b>📌 Lanjutkan ${esc(state.active.title||'latihan')}</b><p>${Array.isArray(state.active.answers)?state.active.answers.length:0} dari ${Array.isArray(state.active.questionIds)?state.active.questionIds.length:0} soal sudah dijawab. Progres sesi tersimpan.</p></div><div class="milestone-actions"><button class="primary" id="resume">Lanjutkan →</button><button class="text-btn" id="discard">Akhiri sesi ini</button></div></section>`;
}
function progress(){let s=stats(),days=[...new Set(state.attempts.map(a=>a.date))].sort().reverse();return `<div class="title-row"><h1>Perkembanganku 🌱</h1><button class="secondary" id="export">↓ Ekspor CSV</button></div><p class="sub">Setiap usaha tercatat. Lihat kebiasaan dan topik yang perlu dilatih.</p>${statCards()}<div class="lower"><section class="panel"><h2>Aktivitas 7 hari terakhir</h2><p>Jumlah soal dijawab, termasuk latihan ulang.</p>${chart()}</section><section class="panel daily"><span class="big-icon">${s.total>=50?'🏆':s.total>=10?'⭐':'🌱'}</span><h3>${s.total>=50?'Penjelajah tangguh':s.total>=10?'Bintang belajar':'Petualangan baru dimulai'}</h3><p>${s.total?`Kamu telah berlatih ${days.length} hari. Pertahankan rasa ingin tahumu!`:'Kerjakan misi pertama untuk mulai mencatat perkembangan.'}</p><p>Level ${1+Math.floor(s.xp/200)} · ${s.xp%200}/200 XP menuju level berikutnya</p><div class="progress-track"><div class="progress-fill" style="width:${s.xp%200/2}%"></div></div></section></div><div class="section-head"><h2>Akurasi per dunia</h2><select id="accuracy-scope" aria-label="Sumber akurasi"><option value="all" ${accuracyScope==='all'?'selected':''}>Semua jawaban</option><option value="recap" ${accuracyScope==='recap'?'selected':''}>Latihan rekap kesalahan</option></select></div><section class="panel">${TOPICS.map(t=>{let a=stats(state.attempts.filter(a=>(accuracyScope!=='recap'||a.mode?.startsWith('recap:'))&&QUESTIONS.find(q=>q.id===a.id).topic===t.id));return `<div class="topic-row"><span>${t.icon}</span><div><b>${t.name}</b><div class="progress-track"><div class="progress-fill" style="width:${a.accuracy}%"></div></div><small>${a.total} percobaan · ${a.total?a.accuracy+'% benar':'Belum dilatih'}</small></div><button class="text-btn" data-start="${t.id}">Latih →</button></div>`;}).join('')}</section><div class="section-head"><h2>Catatan harian</h2></div><section class="panel">${days.length?`<div style="overflow:auto"><table class="history"><thead><tr><th>Tanggal</th><th>Soal</th><th>Akurasi</th><th>XP</th><th>Menit aktif</th></tr></thead><tbody>${days.map(d=>{let a=stats(state.attempts.filter(x=>x.date===d));return `<tr><td>${d}</td><td>${a.total}</td><td>${a.accuracy}%</td><td>${a.xp}</td><td>${a.minutes}</td></tr>`;}).join('')}</tbody></table></div>`:'<div class="empty">Belum ada hasil. Ayo mulai petualangan pertamamu!</div>'}</section><p class="notice">Progres disimpan di browser perangkat ini, tanpa akun atau sinkronisasi antarperangkat. Waktu aktif dihitung selama halaman terlihat, maksimal 10 menit per soal. Soal adalah latihan orisinal bergaya olimpiade, bukan soal resmi.</p>`;}
function syllabus(){return `<h1>Ruang untuk terus bertumbuh 📖</h1><p class="sub">${TOPICS.reduce((n,t)=>n+t.tags.length,0)} topik silabus · ${QUESTIONS.length} soal tersedia · 3 tingkat tantangan</p><div class="syllabus-grid">${TOPICS.map(t=>`<section class="panel"><h2>${t.icon} ${t.name}</h2><p>${t.desc}</p><div class="chips">${t.tags.map(tag=>`<span class="chip">${esc(tag)}</span>`).join('')}</div><p>${QUESTIONS.filter(q=>q.topic===t.id).length} soal dengan pembahasan</p><button class="text-btn" data-start="${t.id}">Jelajahi topik →</button></section>`).join('')}</div><p class="notice">Semua materi di atas tersedia dalam bank soal utama. Soal event memiliki pemetaan submateri, tiga tingkat kesulitan, dan pembahasan. Coba bekal per submateri untuk belajar lebih terarah.</p>`;}
function pictureCard(){return `<section class="panel picture-launch"><span class="eyebrow">LOOK · THINK · DISCOVER</span><h2>Picture Quest 🎨</h2><p>Baca gambar, cari petunjuk, dan pecahkan tantangannya! Ada denah, komik, poster, pohon keluarga, dan banyak lagi.</p><div class="milestone-actions"><button class="primary" data-start="picture:all">Main bergambar · 5 soal →</button>${LEVELS.map(l=>`<button class="secondary" data-start="picture:${l}">${l}</button>`).join('')}</div><p class="notice">Gambar juga hadir dalam paket belajar biasa. Gunakan Perbesar gambar untuk melihat detail.</p></section>`;}
function render(){
  top();$('#app').innerHTML=resumeCard()+({home,missions,progress,syllabus,...features.pages,student:student.student,workshop:interactive.hub,dictionary:interactive.dictionary}[page]||home)();
  features.afterRender();
  if(page==='home'||page==='missions')$('#app').insertAdjacentHTML('afterbegin',pictureCard());
  if(page==='home'||page==='missions')$('#app').insertAdjacentHTML('afterbegin',interactive.card());
  if(['home','missions','progress'].includes(page))$('#app').insertAdjacentHTML('beforeend',weeklyPanel());
  if(page==='parents')$('#app').insertAdjacentHTML('afterbegin','<button class="secondary" id="download-parent-pdf">↓ Download laporan PDF</button>');
  if(page==='progress'||page==='parents')$('#app').insertAdjacentHTML('beforeend',interactive.progress());
  if(page==='missions')updateMissions();
  if(page==='home'||page==='progress')$('#app').insertAdjacentHTML('beforeend',milestones());
  if(page==='progress')$('#app').insertAdjacentHTML('beforeend',runHistory());
  if(page==='parents')$('#app').insertAdjacentHTML('beforeend',student.parentPanel());
  if(page==='syllabus')$('#app').insertAdjacentHTML('afterbegin',events.syllabus());
  if(page==='progress'||page==='parents')$('#app').insertAdjacentHTML('beforeend',events.progress());
  if(!storageOK)$('#app').insertAdjacentHTML('afterbegin','<p class="notice">Penyimpanan lokal tidak tersedia. Gunakan ekspor CSV agar hasil tidak hilang.</p>');
}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function prioritise(pool){
  const seen=new Set(state.attempts.map(a=>a.id));
  return shuffle(pool).sort((a,b)=>Number(seen.has(a.id))-Number(seen.has(b.id)));
}
function balanced(pool,count){
  const buckets=shuffle(TOPICS).map(t=>prioritise(pool.filter(q=>q.topic===t.id)));
  const selected=[];
  while(selected.length<count&&buckets.some(b=>b.length))for(const bucket of buckets){
    if(bucket.length&&selected.length<count)selected.push(bucket.shift());
  }
  return shuffle(PictureQuest.mix(selected.map(q=>({q,reason:'Coba soal baru'})),pool,state.attempts,Math.min(3,Math.ceil(count/5))).map(x=>x.q));
}
function snapshotSession(){
  if(!session)return;
  const {questions,...rest}=session;
  state.active={...rest,questionIds:questions.map(q=>q.id)};
  save();
}
function start(mode){
  let level=page==='missions'?missionFilters.level:'all',pool=[],count=5,title='',exam=EventQuest.isExam(mode);
  const training=mode.startsWith('training:'),days=studyDays();
  if(training&&!LEVELS.includes(mode.split(':')[1]))return;
  if((training&&days<3)||(exam&&days<7)){toast('Paket ini belum terbuka. Lanjutkan belajar pada hari yang berbeda.');return;}
  if(state.active){toast('Lanjutkan atau akhiri sesi yang tersimpan terlebih dahulu.');session=null;render();return;}
  const custom=Weekly.plan(mode,state,dateKey(),QUESTIONS)||Interactive.plan(mode,state,dateKey())||EventQuest.plan(mode,state,dateKey())||student.customMode(mode)||features.customMode(mode);
  if(custom?.error){toast(custom.error);return;}
  features.cleanup();
  if(custom){pool=custom.questions;title=custom.title;level=custom.level||'all';count=pool.length;}
  else if(training){level=mode.split(':')[1];count=25;pool=PRACTICE.filter(q=>q.level===level);title='Latihan 3 hari · '+level;}
  else if(exam){level='all';count=30;title='Ujian 7 hari · Gabungan';}
  else if(mode==='review'){
    const latest=new Map(state.attempts.map(a=>[a.id,a]));
    pool=QUESTIONS.filter(q=>latest.has(q.id)&&!latest.get(q.id).correct);title='Latihan ulang';
  }else if(mode==='daily'){pool=PRACTICE;title='Tantangan harian';}
  else {
    const filters=page==='missions'?missionFilters:{term:'',level:'all'};
    const topics=mode==='mixed'?TOPICS:TOPICS.filter(t=>t.id===mode);
    pool=topics.flatMap(t=>matchingQuestions(t,filters));
    title=(mode==='mixed'?'Latihan campuran':topics[0]?.name||'Misi')+(level==='all'?'':' · '+level);
  }
  let selected=custom?custom.questions:exam?shuffle(LEVELS.flatMap(l=>balanced(PRACTICE.filter(q=>q.level===l),10))):balanced(pool,count);
  if((training||exam)&&selected.length!==count){toast('Stok soal untuk paket ini belum cukup.');return;}
  if(!selected.length){toast(mode==='review'?'Belum ada soal yang perlu diulang. Coba misi baru!':'Tidak ada soal yang cocok dengan filter.');return;}
  session={id:'run-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),questions:selected,index:0,answers:[],mode,level,title,exam,helped:[],confidences:{},confusedIds:[],planReasons:custom?.planReasons||{},elapsed:0,last:Date.now(),answered:false};
  snapshotSession();page='missions';top();renderQuestion();window.scrollTo(0,0);
}
function resume(){
  const a=state.active;
  if(!a||!Array.isArray(a.questionIds)||!Array.isArray(a.answers))return invalidSession();
  const questions=a.questionIds.map(id=>QUESTIONS.find(q=>q.id===id));
  if(!questions.length||questions.some(q=>!q)||!Number.isInteger(a.index)||a.index<0||a.index>=questions.length||a.answers.length<a.index||a.answers.length>a.index+1||
    a.answers.some((x,i)=>!x||x.id!==questions[i].id||!Number.isInteger(x.selected)||x.selected<0||x.selected>3))return invalidSession();
  session={...a,questions,exam:EventQuest.isExam(a.mode),elapsed:Number.isFinite(a.elapsed)?a.elapsed:0,last:Date.now(),answered:a.answers.length>a.index};
  page='missions';top();renderQuestion();window.scrollTo(0,0);
}
function invalidSession(){state.active=null;session=null;save();render();toast('Sesi tersimpan tidak dapat dibuka. Riwayat jawaban tetap tersimpan.');}
function leaveSession(){tick();snapshotSession();session=null;features?.cleanup();}
function tick(){if(session&&!session.answered){let now=Date.now();if(!document.hidden)session.elapsed+=now-session.last;session.last=now;}}
document.addEventListener('visibilitychange',()=>{if(session)session.last=Date.now();});setInterval(tick,1000);
function renderQuestion(){
  const q=session.questions[session.index];session.last=Date.now();
  $('#app').innerHTML=`<div class="quiz"><div class="section-head"><h2>${session.exam?'🏆':'📚'} ${esc(session.title)}</h2><button class="text-btn" data-page="missions">Simpan & keluar ×</button></div><p class="notice">${session.exam?'Mode ujian: jawaban benar dan pembahasan muncul setelah 30 soal selesai.':'Pilih jawaban, lalu pelajari pembahasannya.'} Sesi bisa dilanjutkan setelah halaman ditutup.</p><section class="panel"><div class="quiz-meta"><span>Soal ${session.index+1} dari ${session.questions.length}</span><span>${q.level} · ${esc(q.tag)}</span></div><div class="progress-track"><div class="progress-fill" style="width:${session.index/session.questions.length*100}%"></div></div>${q.passage?`<div class="passage">${esc(q.passage)}</div>`:''}<h1 class="question">${esc(Interactive.isActive(session)?({order:"Build the sentence from the word tiles.",edit:"Find the error and repair the sentence.",dialogue:"Choose your responses to continue the conversation."}[q.activity]||q.prompt):q.prompt)}</h1>${EventQuest.visual(q)}${features.questionExtras(q)}${Interactive.isActive(session)?interactive.question(q):`<div class="options">${q.options.map((o,i)=>`<button class="option" data-answer="${i}"><span>${'ABCD'[i]}</span>${esc(o)}</button>`).join('')}</div>`}${student.tools()}${interactive.extras(q)}<div id="feedback" aria-live="polite"></div><div class="quiz-actions"><span class="notice">Baca petunjuknya. Tidak perlu terburu-buru.</span><span class="tag">${session.exam?'Nilai di akhir ujian':'✦ +20 XP jika benar'}</span></div></section></div>`;
  if(session.answered)showAnswer();
}
function showAnswer(){
  student.lockConfidence();interactive.lock();
  const q=session.questions[session.index],a=session.answers[session.index];
  document.querySelectorAll('[data-answer]').forEach(b=>{
    b.disabled=true;
    if(session.exam){if(+b.dataset.answer===a.selected)b.classList.add('selected');}
    else if(+b.dataset.answer===q.answer)b.classList.add('correct');
    else if(+b.dataset.answer===a.selected)b.classList.add('wrong');
  });
  $('#feedback').innerHTML=(session.exam?'<div class="feedback"><b>✓ Jawaban tersimpan.</b> Lanjutkan sampai selesai untuk melihat nilai dan pembahasan.</div>':a.interaction?`<div class="feedback">${interactive.feedback(q,a)}</div>`:`<div class="feedback"><b>${a.correct?'✨ Tepat sekali! +20 XP':'🌱 Belum tepat, tapi kamu sedang belajar. +5 XP'}</b><br>Jawaban: <b>${esc(q.options[q.answer])}</b><br>${esc(q.explanation)}${features.feedbackDetails(q)}</div>`)+`<div class="quiz-actions"><span></span><button class="primary" id="next">${session.index===session.questions.length-1?'Selesaikan & lihat hasil':'Soal berikutnya'} →</button></div>`;
}

function answer(i,interactionData=null){
  if(!session||session.answered||!Number.isInteger(i)||i<0||i>3)return;
  const activity=Interactive.isActive(session),assessment=activity?Interactive.evaluate(session.questions[session.index],interactionData?.draft):null;
  if(activity&&!assessment.complete)return;
  tick();session.answered=true;
  const q=session.questions[session.index],a={id:q.id,selected:i,correct:activity?assessment.correct:i===q.answer,...(activity?{interaction:{draft:Interactive.draft(interactionData.draft,q,true)}}:{}),date:dateKey(),seconds:Math.min(600,Math.max(1,Math.round(session.elapsed/1000))),runId:session.id,mode:session.mode,level:q.level,assisted:session.helped?.includes(q.id)||false,confidence:session.confidences?.[q.id]||null,confused:session.confusedIds?.includes(q.id)||false};
  state.attempts.push(a);session.answers.push(a);interactive.record(q,a);snapshotSession();if(!session.exam)top();showAnswer();$('#next').focus();
}
function next(){
  if(!session?.answered)return;
  features.stopSpeech();
  if(session.index<session.questions.length-1){
    session.index++;session.interactiveDraft=null;session.answered=false;session.elapsed=0;session.last=Date.now();snapshotSession();renderQuestion();
  }else{
    const s=stats(session.answers),finished=session;
    if(!state.runs.some(r=>r.id===finished.id))state.runs.push({id:finished.id,date:dateKey(),title:finished.title,mode:finished.mode,level:finished.level,total:s.total,correct:s.correct,xp:s.xp,seconds:finished.answers.reduce((n,a)=>n+a.seconds,0)});
    session=null;state.active=null;save();top();
    $('#app').innerHTML=`<section class="panel results">${features.storyResult(finished,s)}<div class="big-icon">${s.accuracy>=80?'🏆':'🌟'}</div><h1>${finished.exam?'Ujian selesai!':'Misi selesai. Hebat sudah mencoba!'}</h1><p>${esc(finished.title)}</p><div class="score">${s.correct}<span style="font-size:24px;color:var(--muted)"> / ${s.total}</span></div><p>+${s.xp} XP · Nilai ${s.accuracy}% · Hasil tersimpan di Perkembanganku.</p><div class="result-levels">${LEVELS.map(l=>{const a=stats(finished.answers.filter(a=>a.level===l));return a.total?`<span class="chip">${l}: ${a.correct}/${a.total} benar</span>`:'';}).join('')}</div><p>${s.accuracy>=80?'Kamu berhasil menghubungkan petunjuk dengan sangat baik!':'Terus berlatih. Pembahasan di bawah membantu kamu memahami setiap jawaban.'}</p><button class="primary" data-start="review">Latih soal yang sulit ↗</button> <button class="secondary" data-page="progress">Lihat perkembangan</button>${weeklyPanel()}${student.form(finished.id)}<div class="section-head"><h2>Pembahasan lengkap</h2></div>${finished.questions.map((q,i)=>`<div class="feedback" style="text-align:left"><b>${finished.answers[i].correct?'✓':'↻'} ${i+1}. ${esc(q.prompt)}</b><br><small>${q.level} · ${esc(q.tag)}</small>${q.passage?`<details><summary>Baca teks soal</summary><div class="passage">${esc(q.passage)}</div></details>`:''}${EventQuest.visual(q)}<br>${finished.answers[i].interaction?interactive.result(q,finished.answers[i]):`Jawabanmu: ${esc(q.options[finished.answers[i].selected])}<br>Jawaban benar: <b>${esc(q.options[q.answer])}</b><br>${esc(q.explanation)}${features.feedbackDetails(q)}`}</div>`).join('')}</section>`;
  }
  window.scrollTo(0,0);
}
function weeklyPanel(){
 const cycles=Weekly.cycles(state,dateKey(),QUESTIONS);
 return `<section class="panel weekly-recap"><h2>🔁 Rekap kesalahan · siklus 7 hari</h2><p>Soal salah dikumpulkan sekali per soal dari semua modul. Paket terbuka setelah 3 hari kalender, dimulai dari tanggal belajar pertama. Hasil latihan rekap dinilai terpisah.</p>${cycles.length?cycles.slice().reverse().map(c=>`<details ${c===cycles[cycles.length-1]?'open':''}><summary>Siklus ${c.number} · ${c.start} – ${c.end} · ${c.ids.length} soal</summary><p>${c.closed?'Siklus selesai':'Sedang dikumpulkan · tersedia '+EQ.addDays(c.end,1)} · ${c.attempts.length?Math.round(c.attempts.filter(a=>a.correct).length/c.attempts.length*100)+'% benar dari '+c.attempts.length+' jawaban rekap':'Belum ada jawaban latihan rekap'}</p>${c.ids.length?`<button class="secondary" data-start="recap:${c.start}" ${c.closed?'':'disabled'}>Latih ${c.ids.length} soal rekap →</button>`:'<p>Tidak ada soal salah dalam siklus ini.</p>'}</details>`).join(''):'<p>Mulai belajar untuk membuka siklus pertamamu.</p>'}</section>`;
}
function exportCSV(){if(!state.attempts.length){toast('Kerjakan soal dahulu sebelum mengekspor hasil.');return;}let rows=[['Tanggal','Topik','ID soal','Benar','Detik aktif','XP'],...state.attempts.map(a=>[a.date,TOPICS.find(t=>t.id===QUESTIONS.find(q=>q.id===a.id).topic).name,a.id,a.correct?1:0,a.seconds,a.correct?20:5])];const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');let url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=url;a.download='english-quest-'+dateKey()+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.page){leaveSession();page=b.dataset.page;render();window.scrollTo(0,0);}
  else if(b.dataset.start)start(b.dataset.start);
  else if(b.dataset.answer!==undefined)answer(+b.dataset.answer);
  else if(b.id==='next')next();
  else if(b.id==='export')exportCSV();
  else if(b.id==='download-parent-pdf'){try{Weekly.download(state,profileManager.current().name,dateKey(),QUESTIONS,TOPICS);toast('Laporan PDF berhasil dibuat.');}catch(e){toast('Laporan PDF belum dapat dibuat. Silakan coba kembali.');}}
  else if(b.id==='resume')resume();
  else if(b.id==='discard'){state.active=null;session=null;save();render();toast('Sesi diakhiri. Jawaban yang sudah diberikan tetap masuk riwayat.');}
  else if(b.id==='reset-filters'){missionFilters={term:'',level:'all'};render();}
  else if(!interactive.click(b)&&!PictureQuest.click(b)&&!student.click(b))features.click(b);
});
document.addEventListener('input',e=>{if(e.target.id==='search'){missionFilters.term=e.target.value;updateMissions();}else interactive.input(e);});
document.addEventListener('change',e=>{if(e.target.id==='accuracy-scope'){accuracyScope=e.target.value==='recap'?'recap':'all';render();}else if(e.target.id==='difficulty'){missionFilters.level=LEVELS.includes(e.target.value)?e.target.value:'all';updateMissions();}else if(!interactive.change(e)&&!student.change(e))features.change(e);});
window.addEventListener('pagehide',()=>{tick();snapshotSession();features.cleanup();});
const extensionAPI={
  $,esc,get state(){return state},get session(){return session},get page(){return page},get profiles(){return profileManager},
  dateKey,stats,balanced,toast,save,answer,snapshot:snapshotSession,leave:leaveSession,
  loadProfile(){session=null;state=profileManager.load();missionFilters={term:'',level:'all'};student?.reset();interactive?.reset();},
  navigate(p){leaveSession();page=p;render();window.scrollTo(0,0);}
};
features=createQuestFeatures(extensionAPI);student=createStudentSession(extensionAPI);events=createEventQuest(extensionAPI);interactive=createInteractiveQuest(extensionAPI);
let dictionaryDate=dateKey();setInterval(()=>{const today=dateKey();if(today!==dictionaryDate){dictionaryDate=today;if(page==='dictionary'&&!session)render();}},30000);
document.querySelector('.brand').addEventListener('click',()=>{leaveSession();page='home';render();});render();
})();
