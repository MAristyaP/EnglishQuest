const EventQuest=(()=>{
 const levels=['Explorer','Challenger','Champion'];
 const parse=mode=>{
  const match=/^event:(komperasia|omnas|ruangguru|stemco):(daily|training|exam)$/.exec(mode);
  return match?{event:match[1],kind:match[2]}:null;
 };
 const isExam=mode=>mode==='exam'||parse(mode)?.kind==='exam';
 const pool=id=>QUESTIONS.filter(q=>q.event===id);
 const shuffle=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 function balanced(bank,count,attempts){
  const seen=new Map();for(const a of attempts)seen.set(a.id,(seen.get(a.id)||0)+1);
  const groups=shuffle([...new Set(bank.map(q=>q.concept||q.tag))]).map(tag=>shuffle(bank.filter(q=>(q.concept||q.tag)===tag)).sort((a,b)=>(seen.get(a.id)||0)-(seen.get(b.id)||0)));
  const selected=[];while(selected.length<count&&groups.some(g=>g.length))for(const group of groups)if(group.length&&selected.length<count)selected.push(group.shift());
  return shuffle(PictureQuest.mix(selected.map(q=>({q,reason:'Coba soal baru'})),bank,attempts,Math.min(3,Math.ceil(count/5))).map(x=>x.q));
 }
 function plan(mode,state,today){
  if(mode.startsWith('picture:')){const level=mode.slice(8);if(!['all',...levels].includes(level))return {error:'Tingkat gambar tidak tersedia.'};return {questions:balanced(QUESTIONS.filter(q=>q.picture&&(level==='all'||q.level===level)),5,state.attempts),title:'Picture Quest · '+(level==='all'?'Petualangan gambar':level),level};}
  if(mode.startsWith('concept:')){
   const c=EVENT_CONCEPTS.find(c=>c.id===mode.slice(8));
   return c?{questions:balanced(QUESTIONS.filter(q=>q.concept===c.id),5,state.attempts),title:'Bekal '+EVENT_SYLLABI.find(e=>e.id===c.event).name+' · '+c.tag}:{error:'Submateri tidak ditemukan.'};
  }
  const p=parse(mode);if(!p)return mode.startsWith('event:')?{error:'Paket event tidak ditemukan.'}:null;
  const days=new Set(state.attempts.filter(a=>a.date<=today).map(a=>a.date)).size;
  const gate=p.kind==='training'?3:p.kind==='exam'?7:0;
  if(days<gate)return {error:`Paket ini terbuka setelah ${gate} hari belajar. Saat ini ${days} hari tercatat.`};
  const bank=pool(p.event),name=EVENT_SYLLABI.find(e=>e.id===p.event).name;
  if(p.kind==='daily'){
   const plan=EQ.adaptive(state.attempts,bank,TOPICS,today,5,state);
   return {questions:plan.map(x=>x.q),title:name+' · Daily adaptif',planReasons:Object.fromEntries(plan.map(x=>[x.q.id,x.reason]))};
  }
  const counts=p.kind==='exam'?[10,10,10]:[9,8,8];
  const questions=shuffle(levels.flatMap((level,i)=>balanced(bank.filter(q=>q.level===level),counts[i],state.attempts)));
  const count=counts.reduce((a,b)=>a+b,0);
  return questions.length===count?{questions,title:name+(p.kind==='exam'?' · Ujian gabungan':' · Latihan campuran'),exam:p.kind==='exam'}:{error:'Stok soal paket ini belum cukup.'};
 }
 function visual(q){
  if(q.picture)return PictureQuest.visual(q);
  if(q.visual==='map')return `<figure class="event-visual"><svg viewBox="0 0 520 330" role="img" aria-label="Peta dengan utara di atas. Library di barat laut, café di timur laut, garden di barat daya, pond di tengah bawah, dan gate di timur bawah. Jalan menghubungkan library dengan café, library dengan garden, garden dengan pond, pond dengan gate, dan gate dengan café."><rect width="520" height="330" rx="20" fill="#e8f6e6"/><g stroke="#b7a688" stroke-width="14" fill="none"><path d="M100 90H420V255H100V90"/></g><g fill="#fff8dc" stroke="#856bad" stroke-width="2"><rect x="30" y="50" width="145" height="80" rx="15"/><rect x="350" y="50" width="140" height="80" rx="15"/><rect x="30" y="220" width="140" height="65" rx="15"/><rect x="350" y="220" width="140" height="65" rx="15"/></g><ellipse cx="260" cy="255" rx="65" ry="40" fill="#a7ddeb" stroke="#4a8196" stroke-width="2"/><g text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#453057"><text x="103" y="98">Library</text><text x="420" y="98">Café</text><text x="100" y="260">Garden</text><text x="260" y="262">Pond</text><text x="420" y="260">Gate</text><text x="260" y="40">N ↑</text></g></svg><figcaption>School park · Follow the marked paths.</figcaption></figure>`;
  const n={'cursive-cat':1,'cursive-book':2,'cursive-night':3}[q.visual];
  return n?`<figure class="event-visual handwriting"><img src="handwriting-${n}.svg" alt="Contoh kata dalam tulisan sambung; baca bentuk huruf pada gambar." width="320" height="135"><figcaption>Read the joined-up handwriting.</figcaption></figure>`:'';
 }
 return {parse,isExam,pool,balanced,plan,visual};
})();

function createEventQuest(api){
 const {esc}=api;
 function cards(){
  const days=new Set(api.state.attempts.filter(a=>a.date<=api.dateKey()).map(a=>a.date)).size;
  return `<div class="event-grid">${EVENT_SYLLABI.map(e=>{
   const bank=EventQuest.pool(e.id),ids=new Set(bank.map(q=>q.id)),attempts=api.state.attempts.filter(a=>ids.has(a.id)),seen=new Set(attempts.map(a=>a.id));
   return `<section class="panel event-card" style="--event-tint:${e.color}"><div class="title-row"><span class="big-icon">${e.icon}</span><span class="tag">${bank.length} soal orisinal</span></div><h2>${e.name}</h2><p>${esc(e.scope)}</p><p>${EVENT_CONCEPTS.filter(c=>c.event===e.id).length} submateri · ${seen.size}/${bank.length} soal pernah dicoba</p><div class="progress-track"><div class="progress-fill" style="width:${seen.size/bank.length*100}%"></div></div><div class="event-actions"><button class="primary" data-start="event:${e.id}:daily">Daily · 5 soal →</button><button class="secondary" data-start="event:${e.id}:training" ${days>=3?'':'disabled'}>Latihan campuran · 25 soal ${days>=3?'':'🔒'}</button><button class="secondary" data-start="event:${e.id}:exam" ${days>=7?'':'disabled'}>Ujian · 30 soal ${days>=7?'':'🔒'}</button></div><a class="text-btn" href="#syllabus-${e.id}">Lihat materi & bekal belajar ↓</a></section>`;
  }).join('')}</div>`;
 }
 function syllabus(){return `<section class="event-intro panel"><span class="eyebrow">OLYMPIAD EXPEDITIONS</span><h2>Empat event, banyak cara bertumbuh ✨</h2><p>Materi dari lima gambar silabusmu sudah masuk ke daily adaptif, misi, latihan per tingkat, dan ujian utama. Pilih paket di bawah untuk fokus pada satu event.</p><p class="notice">Latihan event terbuka setelah 3 hari belajar: 9 Explorer + 8 Challenger + 8 Champion. Ujian terbuka setelah 7 hari: 10 soal setiap tingkat, dengan pembahasan di akhir. Latihan utama tetap 25 soal per tingkat.</p></section>${cards()}<p class="notice">Disusun berdasarkan dokumen yang kamu berikan. Soal dan pembahasan dibuat untuk latihan; paket ini bukan soal resmi atau simulasi format resmi penyelenggara. Tingkat Explorer–Champion adalah tingkat dalam EnglishQuest.</p><div class="event-materials">${EVENT_SYLLABI.map(e=>`<section id="syllabus-${e.id}" class="panel event-material" style="--event-tint:${e.color}"><h2>${e.icon} Bekal ${e.name}</h2><p class="notice">Sumber: ${esc(e.source)} · ${esc(e.scope)}</p>${EVENT_CONCEPTS.filter(c=>c.event===e.id).map(c=>{const count=QUESTIONS.filter(q=>q.concept===c.id).length;return `<details><summary>${esc(c.tag)} <span class="tag">${count} soal · 3 tingkat</span></summary><p>${esc(c.lesson)}</p><button class="secondary" data-start="concept:${c.id}">Coba materi · ${Math.min(5,count)} soal →</button></details>`;}).join('')}${e.id==='stemco'?'<p class="notice">Baris “Others …” pada dokumen tidak merinci materi tambahan. Dua contoh di STEMCO1 dipetakan ke subject–verb agreement dan phrasal verbs. Pengenalan tulisan sambung dilatih lewat gambar; belum berupa latihan menulis tangan.</p>':''}</section>`).join('')}</div>`;}
 function progress(){return `<div class="section-head"><h2>Jejak belajar olimpiade</h2><button class="text-btn" data-page="syllabus">Pilih event →</button></div><div class="event-grid">${EVENT_SYLLABI.map(e=>{
  const bank=EventQuest.pool(e.id),ids=new Set(bank.map(q=>q.id)),all=api.state.attempts.filter(a=>ids.has(a.id)),latest=new Map(all.map(a=>[a.id,a])),right=[...latest.values()].filter(a=>a.correct&&!a.assisted).length;
  return `<section class="panel event-card" style="--event-tint:${e.color}"><h3>${e.icon} ${e.name}</h3><p>${latest.size}/${bank.length} soal pernah dicoba · ${right} jawaban terakhir benar tanpa petunjuk.</p><div class="progress-track"><div class="progress-fill" style="width:${latest.size/bank.length*100}%"></div></div><p>${all.length} percobaan · ${all.length?Math.round(all.filter(a=>a.correct).length/all.length*100)+'% benar':'Belum ada hasil'}</p></section>`;
 }).join('')}</div><p class="notice">Cakupan menunjukkan soal yang pernah dicoba, bukan sertifikasi penguasaan. Jejak event menghitung bank soal baru yang dipetakan langsung ke dokumen event, termasuk saat muncul dalam paket campuran.</p>`;}
 return {syllabus,progress};
}
