/* Pure learning rules shared by the UI and verification suite. */
const EQ = (()=>{
  const levels=['Explorer','Challenger','Champion'];
  const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const addDays=(date,n)=>{const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+n);return dateKey(d);};
  const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(new Date(s+'T12:00:00'))&&dateKey(new Date(s+'T12:00:00'))===s;
  const blank=()=>({attempts:[],runs:[],active:null,speaking:[],reflections:[],skippedReflections:[],lexicon:{saved:[],reviews:[],custom:[]}});
  function normalise(raw,bank,strict=false){
    if(!raw||!Array.isArray(raw.attempts))throw Error('Data profil harus memiliki daftar attempts.');
    const ids=new Set(bank.map(q=>q.id));
    const attemptOK=a=>a&&ids.has(a.id)&&typeof a.correct==='boolean'&&validDate(a.date)&&Number.isFinite(a.seconds)&&a.seconds>=0&&a.seconds<=600&&(a.selected===undefined||(Number.isInteger(a.selected)&&a.selected>=0&&a.selected<=3))&&(a.confidence===undefined||a.confidence===null||['sure','guess'].includes(a.confidence))&&(a.confused===undefined||typeof a.confused==='boolean')&&(a.interaction===undefined||!!Interactive.answerData(a,bank,false));
    if(raw.attempts.length>100000||strict&&raw.attempts.some(a=>!attemptOK(a)))throw Error('Riwayat berisi soal tidak dikenal atau data jawaban tidak valid.');
    const attempts=raw.attempts.filter(attemptOK).map(a=>({id:a.id,correct:a.correct,date:a.date,seconds:a.seconds,...(a.selected!==undefined?{selected:a.selected}:{}),...(typeof a.runId==='string'?{runId:a.runId}:{}),...(typeof a.mode==='string'?{mode:a.mode}:{}),...(levels.includes(a.level)?{level:a.level}:{}),assisted:a.assisted===true,confidence:['sure','guess'].includes(a.confidence)?a.confidence:null,confused:a.confused===true,...(a.interaction?{interaction:Interactive.answerData(a,bank,strict)}:{})}));
    const runOK=r=>r&&typeof r.id==='string'&&typeof r.title==='string'&&r.title.length<=200&&validDate(r.date)&&Number.isInteger(r.total)&&r.total>0&&r.total<=(r.mode?.startsWith('recap:')?bank.length:100)&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.total&&Number.isFinite(r.xp)&&r.xp>=0;
    if(strict&&(raw.runs!==undefined&&!Array.isArray(raw.runs)||Array.isArray(raw.runs)&&raw.runs.some(r=>!runOK(r))))throw Error('Hasil paket tidak valid.');
    const runs=(Array.isArray(raw.runs)?raw.runs:[]).filter(runOK).map(r=>({id:r.id,title:r.title,date:r.date,total:r.total,correct:r.correct,xp:r.xp,mode:typeof r.mode==='string'?r.mode:'mixed',level:levels.includes(r.level)?r.level:'all',seconds:Number.isFinite(r.seconds)?Math.max(0,r.seconds):0}));
    let active=null;
    if(raw.active){
      const a=raw.active,valid=Array.isArray(a.questionIds)&&a.questionIds.length>0&&a.questionIds.length<=(a.mode?.startsWith('recap:')?bank.length:100)&&new Set(a.questionIds).size===a.questionIds.length&&a.questionIds.every(id=>ids.has(id))&&Number.isInteger(a.index)&&a.index>=0&&a.index<a.questionIds.length&&Array.isArray(a.answers)&&a.answers.length>=a.index&&a.answers.length<=a.index+1&&a.answers.every((x,i)=>attemptOK(x)&&x.id===a.questionIds[i]&&Number.isInteger(x.selected))&&typeof a.id==='string'&&typeof a.title==='string'&&typeof a.mode==='string';
      if(!valid&&strict)throw Error('Sesi aktif pada cadangan tidak valid.');
      if(valid&&strict&&(a.confidences!==undefined&&(!a.confidences||typeof a.confidences!=='object'||Array.isArray(a.confidences)||Object.entries(a.confidences).some(([id,v])=>!a.questionIds.includes(id)||!['sure','guess',null].includes(v)))||a.confusedIds!==undefined&&(!Array.isArray(a.confusedIds)||a.confusedIds.some(id=>!a.questionIds.includes(id)))))throw Error('Tanda keyakinan dalam sesi aktif tidak valid.');
      if(valid)active={id:a.id,title:a.title.slice(0,200),mode:a.mode,level:levels.includes(a.level)?a.level:'all',questionIds:a.questionIds,index:a.index,answers:a.answers,interactiveDraft:Interactive.draft(a.interactiveDraft,bank.find(q=>q.id===a.questionIds[a.index]),strict),exam:EventQuest.isExam(a.mode),elapsed:Number.isFinite(a.elapsed)?Math.min(600000,Math.max(0,a.elapsed)):0,answered:a.answers.length>a.index,confidences:a.confidences&&typeof a.confidences==='object'?Object.fromEntries(Object.entries(a.confidences).filter(([id,v])=>a.questionIds.includes(id)&&['sure','guess',null].includes(v))):{},confusedIds:Array.isArray(a.confusedIds)?[...new Set(a.confusedIds.filter(id=>a.questionIds.includes(id)))]:[],helped:Array.isArray(a.helped)?a.helped.filter(id=>ids.has(id)):[],planReasons:a.planReasons&&typeof a.planReasons==='object'?Object.fromEntries(Object.entries(a.planReasons).filter(([id,v])=>ids.has(id)&&typeof v==='string').map(([id,v])=>[id,v.slice(0,300)])):{}};
    }
    const speaking=(Array.isArray(raw.speaking)?raw.speaking:[]).filter(s=>s&&validDate(s.date)&&typeof s.promptId==='string'&&Number.isFinite(s.seconds)&&s.seconds>=0&&s.seconds<=65).map(s=>({date:s.date,promptId:s.promptId,seconds:s.seconds}));
    const studentData=StudentModel.normalise(raw,attempts,runs,bank,strict);
    return {attempts,runs,active,speaking,...studentData,lexicon:Interactive.lexicon(raw.lexicon,strict)};
  }
  function review(attempts,today){
    const entries=new Map();
    for(const a of attempts){
      if(a.date>today)continue;
      let e=entries.get(a.id);
      if(!a.correct){e={id:a.id,stage:0,due:addDays(a.date,1),lastDate:a.date,lastCorrect:false,misses:(e?.misses||0)+1};entries.set(a.id,e);}
      else if(e){
        if(a.assisted){e.lastCorrect=true;continue;}
        if(a.date>e.lastDate){e.stage=Math.min(4,e.stage+1);e.lastDate=a.date;e.due=addDays(a.date,[1,3,7,14,30][e.stage]);}
        e.lastCorrect=true;
      }
    }
    return [...entries.values()].map(e=>({...e,dueNow:e.due<=today})).sort((a,b)=>a.due.localeCompare(b.due)||b.misses-a.misses);
  }
  function skills(attempts,bank,topics){
    const lookup=new Map(bank.map(q=>[q.id,q]));
    return topics.map(t=>{
      const all=attempts.filter(a=>lookup.get(a.id)?.topic===t.id),recent=all.filter(a=>!a.assisted).slice(-12),correct=recent.filter(a=>a.correct).length;
      const last=recent.slice(-5),current=last.length?levels.indexOf(lookup.get(last[last.length-1].id).level):0;
      const ratio=last.length?last.filter(a=>a.correct).length/last.length:0;
      let target=Math.max(0,current);if(last.length===5){if(ratio>=.8)target=Math.min(2,target+1);else if(ratio<=.4)target=Math.max(0,target-1);}
      return {...t,total:all.length,sample:recent.length,correct,accuracy:recent.length?Math.round(correct/recent.length*100):null,assisted:all.filter(a=>a.assisted).length,target:levels[target],ready:recent.length>=5};
    });
  }
  function concepts(attempts,bank){
    const lookup=new Map(bank.map(q=>[q.id,q])),groups=new Map();
    for(const q of bank)if(!groups.has(q.topic+'|'+q.tag))groups.set(q.topic+'|'+q.tag,{topic:q.topic,tag:q.tag,answers:[]});
    for(const a of attempts){const q=lookup.get(a.id);if(q&&!a.assisted)groups.get(q.topic+'|'+q.tag).answers.push(a);}
    return [...groups.values()].map(g=>{const recent=g.answers.slice(-8);return {topic:g.topic,tag:g.tag,sample:recent.length,accuracy:recent.length?Math.round(recent.filter(a=>a.correct).length/recent.length*100):null};});
  }
  function adaptive(attempts,bank,topics,today,count=8,studentState=null){
    const pool=bank.filter(q=>!q.listening),lookup=new Map(pool.map(q=>[q.id,q])),summary=skills(attempts,pool,topics),tags=concepts(attempts,pool),seen=new Set(attempts.map(a=>a.id)),selected=[],used=new Set();
    const add=(q,reason)=>{if(q&&!used.has(q.id)&&selected.length<count){used.add(q.id);selected.push({q,reason});}};
    for(const e of review(attempts,today).filter(e=>e.dueNow&&lookup.has(e.id)).slice(0,2))add(lookup.get(e.id),'Sudah waktunya mengingat kembali soal ini.');
    const ranked=pool.map(q=>{const s=summary.find(s=>s.id===q.topic),c=tags.find(c=>c.topic===q.topic&&c.tag===q.tag);return {q,s,tie:Math.random(),score:(s.accuracy===null?55:100-s.accuracy)+(q.level===s.target?45:-30)+(seen.has(q.id)?0:18)+(c.sample>=2?(100-c.accuracy)*.7:0)};}).sort((a,b)=>b.score-a.score||a.tie-b.tie);
    for(const {q,s} of ranked){if(selected.length>=count-2)break;if(selected.filter(x=>x.q.topic===q.topic).length<3)add(q,s.ready?`Latihan ${q.level} untuk menguatkan ${q.tag} di ${s.name}.`:`Kenali kemampuanmu di ${s.name}, mulai dari ${q.level}.`);}
    const strong=summary.filter(s=>s.ready&&s.accuracy>=80).sort((a,b)=>b.accuracy-a.accuracy)[0];
    if(strong)add(ranked.find(x=>x.q.topic===strong.id&&!used.has(x.q.id))?.q,'Rawat kemampuan yang sudah kuat dengan satu pengulangan.');
    for(const {q} of ranked){if(selected.length>=count)break;add(q,seen.has(q.id)?'Ulangi konsep penting dengan teliti.':'Coba soal baru untuk memperluas kemampuan.');}
    const adjusted=studentState?StudentModel.blend(selected,studentState,bank,today,count):selected;
    return PictureQuest.mix(adjusted,bank,attempts,2);
  }
  const hints={
    'Advanced vocabulary':'Gunakan kata atau kejadian di sekitarnya sebagai petunjuk makna. Coba ganti kata yang ditanyakan dengan setiap opsi.',
    'Word relationship & thematic expressions':'Tentukan dulu hubungan dua kata: lawan kata, fungsi, bahan, atau asal. Ungkapan kadang memiliki makna kiasan.',
    'General knowledge':'Kenali kategori atau proses yang dibahas. Bandingkan ciri utama setiap pilihan, bukan hanya kata yang terasa akrab.',
    'Grammar':'Cari subjek dan kata kerja utama. Periksa apakah bentuknya sesuai dengan subjek dan fungsi kata dalam kalimat.',
    'Tenses & advanced sentence structure':'Tandai urutan waktunya dan kata penghubung. Tentukan kejadian yang lebih dulu, sedang berlangsung, atau masih berupa kemungkinan.',
    'Simple past tense':'Cari penanda masa lampau. Setelah did atau did not, periksa apakah kata kerja kembali ke bentuk dasar.',
    'Simple future tense':'Perhatikan penanda waktu mendatang. Prediksi atau keputusan spontan biasanya memakai will + kata kerja dasar.',
    'Determiner':'Periksa apakah bendanya tunggal atau jamak, sudah disebut atau belum. A/an mengikuti bunyi pertama, bukan hanya huruf.',
    'Quantifier':'Apakah kata benda dapat dihitung? Lalu tentukan apakah jumlahnya cukup, terlalu banyak, atau sangat sedikit.',
    'Pronoun':'Temukan orang atau benda yang digantikan. Periksa fungsi kata: subjek, objek, kepemilikan, atau diri sendiri.',
    'Reference':'Baca satu kalimat sebelum kata rujukan. Ganti kata rujukan dengan calon jawabannya dan periksa apakah maknanya masuk akal.',
    'Informational & longer texts':'Cari kalimat bukti di teks. Pisahkan informasi yang dinyatakan dari dugaan yang belum dibuktikan.',
    'Paragraph':'Cari satu gagasan yang menyatukan paragraf. Perhatikan urutan, kata sambung, dan kalimat yang keluar dari topik.',
    'Finding main idea':'Cari gagasan yang mencakup sebagian besar teks. Pilihan yang hanya menyebut satu detail biasanya terlalu sempit.',
    'Purpose of the text':'Tanyakan tujuan penulis: memberi informasi, menceritakan pengalaman, menjelaskan langkah, atau mengajak pembaca?',
    'Content of the text':'Cari nama, waktu, tempat, atau tindakan yang ditanyakan. Cocokkan dengan kalimat bukti, jangan menambah informasi sendiri.',
    'Incomplete text':'Baca bagian sebelum dan sesudah celah. Cari hubungan tambahan, pertentangan, alasan, atau urutan.',
    'Everyday English':'Bayangkan situasinya. Pilih ungkapan yang memenuhi kebutuhan pembicara dan terdengar wajar.',
    'Communication & social functions':'Apa yang dibutuhkan lawan bicara: bantuan, empati, izin, atau klarifikasi? Cari respons yang relevan dan sopan.',
    'Greeting':'Perhatikan waktu dan situasi: baru berkenalan, menyapa pagi hari, atau berpamitan.',
    'Family tree':'Gambarkan setiap orang dengan kotak kecil. Hubungkan satu generasi dahulu sebelum menentukan hubungan keluarga.',
    'Gratitude':'Bedakan ucapan terima kasih dan balasannya. Pilih kalimat yang menghargai bantuan yang benar-benar diberikan.',
    'Language reasoning':'Ubah petunjuk menjadi urutan atau aturan sederhana. Jangan membalik aturan “semua A adalah B” tanpa bukti.',
    'Inference & critical thinking':'Pilih kesimpulan yang paling didukung petunjuk. Waspadai kata “semua”, “pasti”, atau klaim sebab-akibat yang belum terbukti.',
    'Narrative text':'Ikuti tokoh, masalah, tindakan, dan akibatnya. Pelajaran cerita biasanya terlihat dari perubahan tokoh di akhir.',
    'Recount text':'Tandai first, next, then, dan finally. Susun kembali kejadian lampau sesuai urutan teks.',
    'Biography':'Urutkan masa kecil, pendidikan, karya, dan dampak tokoh. Sifat tokoh perlu didukung tindakan nyata dalam teks.',
    'Descriptive text':'Cari ciri tempat atau benda: bentuk, warna, letak, dan suasana. Bedakan detail yang terlihat dengan dugaan.'
  };
  function hint(q){return q.hint||hints[q.tag]||'Baca kembali pertanyaan dan cari bukti yang paling sesuai.';}
  function contrast(q,i){if(q.optionNotes?.[i])return q.optionNotes[i];return i===q.answer?q.explanation:`“${q.options[i]}” bukan jawaban yang sesuai dalam konteks soal ini. Petunjuk penentunya: ${q.explanation}`;}
  const worlds=[
    {id:'words',guide:'Pip si rubah',symbol:'🦊',relic:'Daun Makna',chapters:[['Gerbang kata','Pip menemukan gerbang dengan simbol yang pudar. Bantu ia mengenali makna kata untuk membuka jalan ke hutan.','Gerbang terbuka! Pip menemukan jejak menuju pohon kamus.'],['Jembatan ungkapan','Jembatan hutan menghubungkan kata yang memiliki hubungan. Pip membutuhkan ketelitianmu agar bisa menyeberang.','Hubungan kata berhasil ditemukan. Jembatan kini aman dilalui.'],['Pohon kamus','Daun Makna tersimpan di pucuk pohon kamus. Pecahkan tantangan kosakata terakhir untuk memulihkan cahaya hutan.','Daun Makna kembali bersinar. Pip mengangkatmu sebagai penjaga Word Forest.']]},
    {id:'grammar',guide:'Nova sang astronot',symbol:'👩‍🚀',relic:'Bintang Waktu',chapters:[['Mesin kalimat','Mesin kapal Nova tersendat karena susunan kalimat berantakan. Bantu menata polanya.','Mesin menyala! Kapal siap terbang ke stasiun waktu.'],['Stasiun masa lampau','Nova harus membedakan kejadian lampau dan rencana mendatang agar kapal tidak salah jalur.','Jalur waktu kembali teratur. Satu planet lagi menunggu.'],['Orbit logika','Bintang Waktu terkunci di orbit kalimat kompleks. Hubungkan syarat dan urutan kejadian untuk meraihnya.','Bintang Waktu ditemukan. Grammar Galaxy kembali stabil.']]},
    {id:'reading',guide:'Kora sang penjelajah',symbol:'🧭',relic:'Kompas Pemahaman',chapters:[['Pesan dalam botol','Kora menemukan pesan di pantai. Cari informasi penting agar ia tahu arah perjalanan.','Pesan terbaca. Kora menemukan jalan menuju mercusuar.'],['Mercusuar bacaan','Mercusuar hanya menyala jika gagasan utama dan tujuan pesan ditemukan. Bantu Kora membaca dengan teliti.','Mercusuar menyala dan menunjukkan pulau terakhir.'],['Arsip pulau','Kompas Pemahaman tersimpan dalam arsip panjang. Pisahkan fakta, rujukan, dan kesimpulan agar Kora tidak tersesat.','Kompas Pemahaman kembali. Semua pelaut bisa membaca petunjuk pulau.']]},
    {id:'social',guide:'Milo si kurir',symbol:'🐻',relic:'Lencana Persahabatan',chapters:[['Salam untuk kota','Milo baru tiba di kota. Bantu ia menyapa warga dan mengucapkan terima kasih.','Warga menyambut Milo. Ia siap mengantar pesan berikutnya.'],['Pesan yang tertukar','Beberapa pesan tertukar saat festival. Pilih ungkapan yang sesuai agar semua warga saling memahami.','Pesan sampai kepada penerima yang tepat. Festival hampir siap.'],['Festival persahabatan','Dua kelompok berbeda pendapat. Bantu Milo menanggapi dengan sopan dan mencari jalan bersama.','Festival sukses! Kota memberikan Lencana Persahabatan.']]},
    {id:'logic',guide:'Detektif Luna',symbol:'🕵️',relic:'Lensa Bukti',chapters:[['Jejak pertama','Luna menemukan beberapa petunjuk. Pisahkan fakta dari opini untuk memulai penyelidikan.','Petunjuk awal cocok. Luna menemukan saksi berikutnya.'],['Ruang kemungkinan','Tidak semua dugaan benar. Hubungkan urutan dan petunjuk tanpa terburu-buru menarik kesimpulan.','Satu dugaan gugur. Bukti mengarah ke ruang terakhir.'],['Misteri lensa','Lensa Bukti tersembunyi di balik klaim yang menyesatkan. Gunakan bukti dan logika untuk menyelesaikan misterinya.','Kasus selesai! Lensa Bukti menjadi bekal penyelidikanmu berikutnya.']]},
    {id:'stories',guide:'Aria sang penjaga cerita',symbol:'🧝',relic:'Mahkota Cerita',chapters:[['Halaman yang hilang','Aria kehilangan urutan halaman buku. Kenali tokoh, tempat, dan kejadian untuk menyusunnya kembali.','Halaman pertama tersusun. Pintu perpustakaan terbuka.'],['Lorong pengalaman','Di lorong ini, pengalaman dan kehidupan tokoh saling bercampur. Bantu Aria menemukan urutan dan maknanya.','Kisah-kisah kembali ke rak yang tepat. Menara terakhir terbuka.'],['Menara makna','Mahkota Cerita memerlukan pembaca yang memahami pesan di balik cerita. Tunjukkan bukti, bukan sekadar menebak.','Mahkota Cerita kembali! Aria mencatat namamu sebagai sahabat perpustakaan.']]}
  ];
  function chapterWon(runs,id,index){return runs.some(r=>r.mode===`story:${id}:${index}`&&r.total>=5&&r.correct/r.total>=.6);}
  function chapterOpen(runs,id,index){return index===0||chapterWon(runs,id,index-1);}
  const advice={words:'Pilih 3 kata dari latihan. Minta anak membuat kalimat sendiri dan menjelaskan petunjuk maknanya.',grammar:'Ajak anak mengubah 3 kalimat dari hari ini menjadi kemarin atau besok, lalu menjelaskan perubahan kata kerjanya.',reading:'Baca satu paragraf pendek bersama. Minta anak menunjuk kalimat bukti sebelum menjawab pertanyaan.',social:'Mainkan dialog 2 menit: meminta bantuan, menolak undangan dengan sopan, lalu berterima kasih.',logic:'Tanyakan “Bukti apa yang mendukung jawabanmu?” dan “Adakah kemungkinan lain?” pada satu soal.',stories:'Minta anak menceritakan kembali tokoh, masalah, tindakan, dan pelajaran dari satu bacaan.'};
  function trend(attempts,today){const current=attempts.filter(a=>a.date>=addDays(today,-6)&&a.date<=today),previous=attempts.filter(a=>a.date>=addDays(today,-13)&&a.date<addDays(today,-6));const accuracy=a=>a.length?Math.round(a.filter(x=>x.correct).length/a.length*100):null;return {current:current.length,previous:previous.length,currentAccuracy:accuracy(current),previousAccuracy:accuracy(previous),delta:current.length>=5&&previous.length>=5?accuracy(current)-accuracy(previous):null};}
  return {levels,dateKey,addDays,validDate,blank,normalise,review,skills,concepts,adaptive,hint,contrast,worlds,chapterWon,chapterOpen,advice,trend};
})();
// Derived from persisted attempts: no migration or extra student data required.
const Weekly=(()=>{
 const day=d=>Math.floor(Date.parse(d+'T00:00:00Z')/86400000);
 function dailyWords(words,today){const start=((day(today)*6)%words.length+words.length)%words.length;return Array.from({length:Math.min(6,words.length)},(_,i)=>words[(start+i)%words.length]);}
 function cycles(state,today,bank){
  const known=new Set(bank.map(q=>q.id)),source=state.attempts.filter(a=>known.has(a.id)&&!a.mode?.startsWith('recap:')&&a.date<=today);
  if(!source.length)return [];
  const first=source.map(a=>a.date).sort()[0],groups=new Map();
  for(const a of source){const n=Math.floor((day(a.date)-day(first))/3),start=EQ.addDays(first,n*3);if(!groups.has(n))groups.set(n,{number:n+1,start,end:EQ.addDays(start,2),ids:[]});const g=groups.get(n);
   // Unfinished exam answers are kept private until the result is released.
   if(!a.correct&&!(state.active?.exam&&a.runId===state.active.id)&&!g.ids.includes(a.id))g.ids.push(a.id);
  }
  return [...groups.values()].sort((a,b)=>a.start.localeCompare(b.start)).map(g=>({...g,closed:today>g.end,attempts:state.attempts.filter(a=>a.mode==='recap:'+g.start&&a.date<=today)}));
 }
 function plan(mode,state,today,bank){if(!mode.startsWith('recap:'))return null;const c=cycles(state,today,bank).find(c=>'recap:'+c.start===mode);if(!c||!c.closed)return {error:'Rekap tersedia setelah siklus 3 hari selesai.'};if(!c.ids.length)return {error:'Tidak ada soal salah dalam siklus ini.'};return {questions:c.ids.map(id=>bank.find(q=>q.id===id)),title:'Rekap kesalahan · '+c.start+' – '+c.end,level:'all'};}
 function reportLines(state,name,today,bank,topics){
  const activeExam=state.active?.exam?state.active.id:null,all=state.attempts.filter(a=>a.runId!==activeExam&&a.date<=today),safe={...state,attempts:all};
  const accuracy=items=>items.length?Math.round(items.filter(a=>a.correct).length/items.length*100)+'%':'Belum ada data';
  const recent=all.filter(a=>a.date>=EQ.addDays(today,-6));
  const lines=['ENGLISHQUEST | LAPORAN PERKEMBANGAN','Profil siswa: '+name,'Tanggal laporan: '+today,'','RINGKASAN BELAJAR',all.length+' jawaban | Akurasi '+accuracy(all),new Set(all.map(a=>a.date)).size+' hari belajar | '+all.reduce((n,a)=>n+(a.correct?20:5),0)+' XP',Math.round(all.reduce((n,a)=>n+a.seconds,0)/60)+' menit aktif tercatat','7 hari terakhir: '+recent.length+' jawaban | Akurasi '+accuracy(recent),'','AKURASI PER DUNIA'];
  for(const t of topics){const list=all.filter(a=>bank.find(q=>q.id===a.id)?.topic===t.id);lines.push(t.name+': '+accuracy(list)+' ('+list.length+' jawaban)');}
  lines.push('','LATIHAN REKAP KESALAHAN');
  const cs=cycles(safe,today,bank);if(!cs.length)lines.push('Belum ada siklus belajar.');
  for(const c of cs)lines.push('Siklus '+c.number+' | '+c.start+' s.d. '+c.end,c.ids.length+' soal salah unik | '+(c.closed?'Selesai':'Sedang dikumpulkan'),'Hasil latihan rekap: '+accuracy(c.attempts)+' ('+c.attempts.length+' jawaban)');
  lines.push('','AKURASI REKAP PER DUNIA');for(const t of topics){const list=all.filter(a=>a.mode?.startsWith('recap:')&&bank.find(q=>q.id===a.id)?.topic===t.id);lines.push(t.name+': '+accuracy(list)+' ('+list.length+' jawaban)');}
  lines.push('','CATATAN HARIAN (7 HARI TERAKHIR)');for(let i=6;i>=0;i--){const date=EQ.addDays(today,-i),list=all.filter(a=>a.date===date);lines.push(date+' | '+list.length+' jawaban | '+accuracy(list));}
  lines.push('','PENDAMPINGAN', 'Dampingi anak membahas alasan jawabannya, lalu latih kembali soal pada rekap kesalahan.','Survei kesulitan tersedia di Sesi Siswa; catatan pribadi tidak dimasukkan ke PDF ini.','Data berasal dari profil lokal. Akurasi mencakup pengulangan dan bantuan, bukan penilaian kemampuan resmi.','Hasil ujian yang belum selesai tidak disertakan.');return lines;
 }
 function download(state,name,today,bank,topics){
  const images=questReportPages(state,name,today,bank,topics);
  const enc=new TextEncoder(),parts=[],offsets=[0];let length=0;const put=s=>{const b=typeof s==='string'?enc.encode(s):s;parts.push(b);length+=b.length;};const obj=(id,body)=>{offsets[id]=length;put(id+' 0 obj\n');put(body);put('\nendobj\n');};put('%PDF-1.4\n');obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Count '+images.length+' /Kids ['+images.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>');
  images.forEach((bytes,i)=>{const id=3+i*3;obj(id,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Img '+(id+1)+' 0 R >> >> /Contents '+(id+2)+' 0 R /Annots ['+[0,1,2].map(n=>(3+images.length*3+i*3+n)+' 0 R').join(' ')+'] >>');offsets[id+1]=length;put((id+1)+' 0 obj\n<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+bytes.length+' >>\nstream\n');put(bytes);put('\nendstream\nendobj\n');const commands='q 595 0 0 842 0 0 cm /Img Do Q';obj(id+2,'<< /Length '+commands.length+' >>\nstream\n'+commands+'\nendstream');});
  images.forEach((_,i)=>{for(let n=0;n<3;n++){const x=(62+n*377)*595/1240,x2=(62+n*377+362)*595/1240,y=842-208*842/1754,y2=842-146*842/1754;obj(3+images.length*3+i*3+n,'<< /Type /Annot /Subtype /Link /Rect ['+[x,y,x2,y2].join(' ')+'] /Border [0 0 0] /A << /S /GoTo /D ['+(3+n*3)+' 0 R /Fit] >> >>');}});
  const xref=length;put('xref\n0 '+offsets.length+'\n0000000000 65535 f \n');for(const n of offsets.slice(1))put(String(n).padStart(10,'0')+' 00000 n \n');put('trailer\n<< /Size '+offsets.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');const url=URL.createObjectURL(new Blob(parts,{type:'application/pdf'})),a=document.createElement('a');a.href=url;a.download='EnglishQuest-Perkembangan-'+name.replace(/[^a-zA-Z0-9_-]/g,'_')+'-'+today+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
 return {cycles,plan,dailyWords,reportLines,download};
})();



/* Canvas pages for an offline, illustrated parent report. */
function questReportPages(state,name,today,bank,topics){
 const hidden=state.active?.exam?state.active.id:null;
 const all=state.attempts.filter(a=>a.date<=today&&a.runId!==hidden),recent=all.filter(a=>a.date>=EQ.addDays(today,-6)),lookup=new Map(bank.map(q=>[q.id,q]));
 const score=a=>a.length?Math.round(100*a.filter(x=>x.correct).length/a.length):null;
 const worlds=topics.map(t=>({...t,answers:all.filter(a=>lookup.get(a.id)?.topic===t.id),recap:all.filter(a=>a.mode?.startsWith('recap:')&&lookup.get(a.id)?.topic===t.id)}));
 const cs=Weekly.cycles({...state,attempts:all},today,bank).reverse();
 const pages=[],canvas=document.createElement('canvas');canvas.width=1240;canvas.height=1754;const c=canvas.getContext('2d');
 const C={ink:'#25334b',muted:'#53637a',purple:'#6543a6',mint:'#e0f2ec',lilac:'#eee6fa',peach:'#ffeddb',blue:'#e4effb',line:'#d7dfeb'};
 const round=(x,y,w,h,fill,r=24)=>{c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
 function txt(value,x,y,width,size=26,color=C.ink,bold=false){c.font=(bold?'bold ':'')+size+'px Arial';c.fillStyle=color;let yy=y;
  for(const para of String(value).split('\n')){let line='';for(const word of para.split(/\s+/)){if(c.measureText((line?line+' ':'')+word).width>width&&line){c.fillText(line,x,yy);yy+=size*1.38;line=word;}else line+=(line?' ':'')+word;}c.fillText(line,x,yy);yy+=size*1.38;}return yy;
 }
 function start(title,subtitle,active){c.fillStyle='#f7f8fc';c.fillRect(0,0,1240,1754);round(0,0,1240,125,C.purple,0);txt('EnglishQuest',62,58,600,36,'#ffffff',true);txt('CATATAN TUMBUH & BELAJAR',64,96,1000,20,'#e9ddff');
  ['01  Ringkasan','02  Kemampuan','03  Rekap & langkah'].forEach((s,i)=>{round(62+i*377,146,362,62,active===i?C.purple:'#e9e2f3',14);txt(s,84+i*377,187,325,25,active===i?'#ffffff':C.purple,true);});
  txt(title,62,277,1116,44,C.ink,true);txt(subtitle,62,322,1116,24,C.muted);}
 function finish(){txt('EnglishQuest • '+today+' • Halaman '+(pages.length+1),62,1688,850,20,C.muted);txt('Klik tab di atas untuk berpindah bagian.',62,1720,1116,19,C.muted);const b=atob(canvas.toDataURL('image/jpeg',.94).split(',')[1]);pages.push(Uint8Array.from(b,x=>x.charCodeAt(0)));}
 function metric(x,y,w,title,value,note,fill){round(x,y,w,172,fill);txt(title,x+22,y+35,w-44,22,C.muted,true);txt(value,x+22,y+99,w-44,String(value).length>10?28:46,C.ink,true);txt(note,x+22,y+140,w-44,19,C.muted);}
 function bar(x,y,w,value,color){round(x,y,w,16,'#dce3ee',8);if(value)round(x,y,w*value/100,16,color,8);}
 const pct=n=>n===null?'Belum ada data':n+'%';
 start('Setiap langkah berarti.', 'Ringkasan untuk orang tua • Dicetak '+today,0);
 round(62,359,1116,118,C.lilac);txt('PROFIL SISWA',86,392,1068,20,C.purple,true);txt(name,86,436,1068,32,C.ink,true);
 metric(62,504,357,'Hari belajar',String(new Set(recent.map(a=>a.date)).size)+' / 7','Dalam 7 hari terakhir',C.mint);
 metric(441,504,357,'Jawaban dikerjakan',String(recent.length),'Termasuk latihan ulang',C.blue);
 metric(820,504,358,'Akurasi 7 hari',pct(score(recent)),'Benar / seluruh jawaban',C.peach);
 round(62,708,1116,393,'#ffffff');txt('Ritme belajar minggu ini',88,754,1060,31,C.ink,true);txt('Tinggi batang menunjukkan jumlah soal yang dijawab setiap hari.',88,793,1060,23,C.muted);
 const dates=Array.from({length:7},(_,i)=>EQ.addDays(today,i-6)),counts=dates.map(d=>recent.filter(a=>a.date===d).length),max=Math.max(1,...counts);
 dates.forEach((d,i)=>{const x=118+i*151,h=counts[i]/max*168;round(x,1004-h,72,Math.max(h,3),i===6?C.purple:'#aa94cc',8);txt(counts[i],x,988-h,100,24,C.ink,true);txt(d.slice(8)+'/'+d.slice(5,7),x-12,1045,135,22,C.muted);});
 round(62,1130,1116,282,C.mint);txt('Yang layak dirayakan',90,1177,1056,30,C.ink,true);
 const correct=all.filter(a=>a.correct).length,unique=new Set(all.filter(a=>a.correct&&!a.assisted).map(a=>a.id)).size;
 txt(all.length?unique+' soal berbeda berhasil dijawab tanpa bantuan.':'Belum ada hasil. Satu misi singkat adalah awal yang baik.',90,1234,1048,28,C.ink,true);
 txt('Sejak mulai: '+all.length+' jawaban • '+correct+' benar • '+(all.length-correct)+' perlu diulang',90,1290,1048,24);
 txt('Waktu aktif tercatat: '+Math.round(all.reduce((n,a)=>n+a.seconds,0)/60)+' menit. Rayakan usaha dan ajak anak menjelaskan cara berpikirnya.',90,1335,1048,24);
 round(62,1440,1116,158,C.lilac);txt('Cara membaca laporan',88,1481,1060,27,C.purple,true);txt('Mulai dari kebiasaan, lihat dunia yang perlu didampingi, lalu pilih satu langkah kecil. Akurasi mencakup pengulangan dan bantuan; ini bukan nilai kemampuan resmi.',88,1522,1060,23);
 finish();
 start('Kenali kekuatan & tantangannya.', 'Semua riwayat pada profil ini • Satu dunia, satu fokus belajar',1);
 round(62,363,1116,102,C.blue);txt('Bar utama: semua jawaban. Bar ungu: hasil latihan rekap kesalahan.',86,403,1068,24);txt('Kurang dari 5 jawaban: data awal, belum cukup untuk menyimpulkan.',86,438,1068,22,C.muted);
 worlds.forEach((t,i)=>{const y=493+i*166,n=score(t.answers),r=score(t.recap),label=t.answers.length<5?'Data awal':n>=80?'Mulai kuat':n>=60?'Sedang tumbuh':'Perlu didampingi';round(62,y,1116,150,'#ffffff');txt(t.name,86,y+37,640,28,C.ink,true);txt(label,820,y+37,335,22,C.purple,true);bar(86,y+57,640,n,'#448c7b');txt(pct(n)+' · '+t.answers.length+' jawaban',750,y+73,400,22);bar(86,y+96,640,r,C.purple);txt('Rekap: '+pct(r)+' · '+t.recap.length+' jawaban',750,y+112,410,21);});
 txt('Warna adalah petunjuk pendampingan, bukan label untuk anak. Bandingkan juga jumlah dan tingkat soal yang dikerjakan.',86,1551,1068,23,C.muted);finish();
 const weak=worlds.filter(t=>t.answers.length>=5).sort((a,b)=>score(a.answers)-score(b.answers))[0];
 const chunks=Math.max(1,Math.ceil(cs.length/4));
 for(let part=0;part<chunks;part++){
 start(part?'Arsip rekap kesalahan.':'Kesalahan jadi bekal berikutnya.', 'Siklus 3 hari kalender • Paket latihan dibuka setelah siklus selesai',2);
 const chunk=cs.slice(part*4,part*4+4);
 if(!chunk.length){round(62,370,1116,180,C.mint);txt('Belum ada siklus belajar.',88,424,1060,32,C.ink,true);txt('Kerjakan misi pertama. Soal yang belum tepat akan terkumpul otomatis.',88,477,1060,26);}
 chunk.forEach((s,i)=>{const y=369+i*204,n=score(s.attempts);round(62,y,1116,182,i%2?C.blue:C.lilac);txt('Siklus '+s.number+'  |  '+s.start+' – '+s.end,86,y+39,1068,27,C.ink,true);txt(s.closed?(s.ids.length?'Paket siap dilatih':'Tidak ada soal salah di siklus ini'):'Sedang dikumpulkan • tersedia '+EQ.addDays(s.end,1),86,y+78,1068,23,C.purple,true);txt(s.ids.length+' soal salah unik',86,y+128,420,29,C.ink,true);txt('Latihan rekap: '+pct(n),550,y+122,600,27,C.ink,true);txt(s.attempts.length+' jawaban ulang tercatat',550,y+156,600,21,C.muted);});
 round(62,1220,1116,347,C.peach);txt('Coba bersama, 10 menit saja',88,1265,1060,31,C.ink,true);
 txt('1. Tanyakan: “Bagian mana yang paling membuatmu berpikir?”',88,1320,1060,25);
 txt('2. '+(weak?'Fokus pada '+weak.name+'. Baca satu soal dan minta anak menjelaskan alasannya.':'Pilih satu soal yang sulit. Baca bersama, lalu minta anak menjelaskan alasannya.'),88,1371,1060,25);
 txt('3. Coba latihan rekap, lalu rayakan hal yang kini lebih dipahami.',88,1454,1060,25);
 txt('Hasil ujian belum selesai dan curhatan pribadi tidak dimasukkan ke PDF.',88,1518,1060,20,C.muted);finish();
 }
 return pages;
}
