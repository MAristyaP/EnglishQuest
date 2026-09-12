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
    const runOK=r=>r&&typeof r.id==='string'&&typeof r.title==='string'&&r.title.length<=200&&validDate(r.date)&&Number.isInteger(r.total)&&r.total>0&&r.total<=100&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.total&&Number.isFinite(r.xp)&&r.xp>=0;
    if(strict&&(raw.runs!==undefined&&!Array.isArray(raw.runs)||Array.isArray(raw.runs)&&raw.runs.some(r=>!runOK(r))))throw Error('Hasil paket tidak valid.');
    const runs=(Array.isArray(raw.runs)?raw.runs:[]).filter(runOK).map(r=>({id:r.id,title:r.title,date:r.date,total:r.total,correct:r.correct,xp:r.xp,mode:typeof r.mode==='string'?r.mode:'mixed',level:levels.includes(r.level)?r.level:'all',seconds:Number.isFinite(r.seconds)?Math.max(0,r.seconds):0}));
    let active=null;
    if(raw.active){
      const a=raw.active,valid=Array.isArray(a.questionIds)&&a.questionIds.length>0&&a.questionIds.length<=100&&new Set(a.questionIds).size===a.questionIds.length&&a.questionIds.every(id=>ids.has(id))&&Number.isInteger(a.index)&&a.index>=0&&a.index<a.questionIds.length&&Array.isArray(a.answers)&&a.answers.length>=a.index&&a.answers.length<=a.index+1&&a.answers.every((x,i)=>attemptOK(x)&&x.id===a.questionIds[i]&&Number.isInteger(x.selected))&&typeof a.id==='string'&&typeof a.title==='string'&&typeof a.mode==='string';
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
