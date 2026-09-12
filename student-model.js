/* Student reflections are self-reports, separate from scored answers. */
const StudentModel=(()=>{
  const moods=[['easy','😄','Mudah'],['challenge','🙂','Cukup menantang'],['confused','😕','Bingung'],['tired','😴','Lelah']];
  const difficulties=[['vocabulary','Ada kata yang belum dipahami'],['grammar','Bingung grammar atau tenses'],['reading','Bacaan terasa panjang'],['inference','Sulit mencari petunjuk atau menyimpulkan'],['choices','Pilihan jawaban terasa mirip'],['listening','Sulit memahami audio'],['focus','Sulit berkonsentrasi'],['none','Tidak ada kesulitan']];
  const helps=[['example','Contoh lebih sederhana'],['steps','Penjelasan bertahap'],['practice','Latihan tambahan'],['break','Istirahat dahulu'],['none','Belum perlu bantuan']];
  const followups=[['better','🙂 Lebih mudah sekarang'],['same','😐 Masih sama'],['harder','😕 Masih perlu lebih banyak bantuan']];
  const label=(list,id)=>list.find(x=>x[0]===id)?.at(-1)||id;
  const academic=ref=>ref.difficulties.some(d=>!['none','focus'].includes(d));
  function questionsFor(state,runId){return [...new Set(state.attempts.filter(a=>a.runId===runId).map(a=>a.id))];}
  function normalise(raw,attempts,runs,bank,strict=false){
    const runIds=new Set(runs.map(r=>r.id)),ids=new Set(bank.map(q=>q.id)),date=s=>EQ.validDate(s);
    const valid=r=>r&&typeof r.runId==='string'&&runIds.has(r.runId)&&date(r.date)&&moods.some(m=>m[0]===r.mood)&&Array.isArray(r.difficulties)&&r.difficulties.length>0&&new Set(r.difficulties).size===r.difficulties.length&&r.difficulties.every(d=>difficulties.some(x=>x[0]===d))&&(!r.difficulties.includes('none')||r.difficulties.length===1)&&helps.some(h=>h[0]===r.help)&&typeof r.note==='string'&&r.note.length<=1500&&Array.isArray(r.questionIds)&&new Set(r.questionIds).size===r.questionIds.length&&r.questionIds.every(id=>ids.has(id)&&attempts.some(a=>a.runId===r.runId&&a.id===id))&&(r.checkins===undefined||Array.isArray(r.checkins)&&r.checkins.every(c=>c&&date(c.date)&&c.date>=r.date&&followups.some(f=>f[0]===c.feeling)));
    if(strict&&(raw.reflections!==undefined&&!Array.isArray(raw.reflections)||Array.isArray(raw.reflections)&&(raw.reflections.some(r=>!valid(r))||new Set(raw.reflections.map(r=>r.runId)).size!==raw.reflections.length)))throw Error('Data Sesi Siswa tidak valid atau tidak cocok dengan riwayat paket.');
    const seen=new Set(),reflections=(Array.isArray(raw.reflections)?raw.reflections:[]).filter(r=>valid(r)&&!seen.has(r.runId)&&seen.add(r.runId)).map(r=>({runId:r.runId,date:r.date,mood:r.mood,difficulties:[...r.difficulties],help:r.help,note:r.note,questionIds:[...r.questionIds],checkins:[...(r.checkins||[])].sort((a,b)=>a.date.localeCompare(b.date))}));
    const skippedReflections=(Array.isArray(raw.skippedReflections)?raw.skippedReflections:[]).filter(id=>typeof id==='string'&&runIds.has(id)&&!seen.has(id));
    return {reflections,skippedReflections:[...new Set(skippedReflections)]};
  }
  function create(state,runId,input,today,bank){
    if((state.reflections||[]).some(r=>r.runId===runId))throw Error('Survei sesi ini sudah tersimpan.');
    const ref={runId,date:today,mood:input.mood,difficulties:input.difficulties,help:input.help,note:input.note||'',questionIds:input.questionIds||[],checkins:[]};
    return normalise({reflections:[ref]},state.attempts,state.runs,bank,true).reflections[0];
  }
  function dueDate(ref){const last=ref.checkins?.at(-1);if(last?.feeling==='better'||!academic(ref)&&ref.help!=='break'&&ref.mood!=='confused'&&ref.mood!=='tired')return null;return EQ.addDays(last?.date||ref.date,3);}
  function checkIn(ref,feeling,today){if(!followups.some(f=>f[0]===feeling))throw Error('Pilih satu jawaban tindak lanjut.');const due=dueDate(ref);if(!due||due>today)throw Error('Pengecekan berikutnya belum jatuh tempo.');return {...ref,checkins:[...(ref.checkins||[]),{date:today,feeling}]};}
  function evidence(state,runId){const a=state.attempts.filter(a=>a.runId===runId);return {answered:a.length,correct:a.filter(x=>x.correct).length,guessedCorrect:a.filter(x=>x.correct&&x.confidence==='guess').length,sureWrong:a.filter(x=>!x.correct&&x.confidence==='sure').length,flagged:a.filter(x=>x.confused).length,confidenceResponses:a.filter(x=>['sure','guess'].includes(x.confidence)).length};}
  function matches(q,d){
    return d==='vocabulary'?q.topic==='words'&&q.tag!=='General knowledge':d==='grammar'?q.topic==='grammar':d==='reading'?['reading','stories'].includes(q.topic):d==='inference'?q.topic==='logic'||q.tag==='Finding main idea':d==='listening'?q.listening===true:false;
  }
  function support(state,ref,bank){
    if(ref.help==='break')return {rest:true,title:'Jeda dulu, lanjut saat siap',text:'Kamu memilih istirahat. Ambil jeda yang nyaman; tidak ada XP yang hilang. Kalau sudah siap, kamu bisa kembali ke misi adaptif.',questions:[]};
    if(ref.help==='none')return {rest:false,title:'Terima kasih sudah bercerita',text:'Kamu belum meminta bantuan tambahan. Ceritamu tetap tercatat. Misi biasa dapat dilanjutkan kapan kamu siap.',questions:[]};
    const selectedIds=ref.questionIds.length?ref.questionIds:state.attempts.filter(a=>a.runId===ref.runId&&(a.confused||a.confidence==='guess'||!a.correct)).map(a=>a.id);
    const marked=selectedIds.map(id=>bank.find(q=>q.id===id)).filter(Boolean),tags=new Set(marked.map(q=>q.tag)),sessionIds=new Set(questionsFor(state,ref.runId)),explicit=ref.difficulties.filter(d=>!['choices','focus','none'].includes(d));
    let pool=bank.filter(q=>explicit.length?explicit.some(d=>matches(q,d)):tags.size?tags.has(q.tag):sessionIds.has(q.id));
    if(!pool.length)pool=bank.filter(q=>!q.listening);
    const seen=new Set(state.attempts.map(a=>a.id)),gentle=['example','steps'].includes(ref.help),limit=gentle?3:5;
    const ranked=pool.map(q=>({q,score:(tags.has(q.tag)?30:0)+(seen.has(q.id)?0:15)+(gentle?(2-EQ.levels.indexOf(q.level))*35:0),tie:Math.random()})).sort((a,b)=>b.score-a.score||a.tie-b.tie);
    const questions=ranked.slice(0,limit).map(x=>x.q),concepts=[...new Set(questions.map(q=>q.tag))].slice(0,3);
    const title=ref.help==='example'?'Mulai dari contoh sederhana':ref.help==='steps'?'Pahami satu langkah dahulu':'Latihan kecil untuk menguatkan';
    return {rest:false,title,text:gentle?'Pelajari contoh singkat, lalu coba beberapa soal dengan petunjuk.':'Paket pendek dipilih dari bagian yang kamu sebut sulit.',questions,concepts};
  }
  function blend(base,state,bank,today,count){
    const candidates=(state.reflections||[]).filter(r=>academic(r)&&!['break','none'].includes(r.help)&&r.checkins?.at(-1)?.feeling!=='better'&&(r.checkins?.at(-1)?.date||r.date)>=EQ.addDays(today,-6)&&(r.checkins?.at(-1)?.date||r.date)<=today);
    const ref=[...candidates].sort((a,b)=>(b.checkins?.at(-1)?.date||b.date).localeCompare(a.checkins?.at(-1)?.date||a.date))[0];
    if(!ref)return base;
    const targeted=support(state,ref,bank).questions.filter(q=>!q.listening).slice(0,2),result=[],used=new Set();
    const add=row=>{if(row&&!used.has(row.q.id)&&result.length<count){used.add(row.q.id);result.push(row);}};
    base.filter(x=>x.reason.startsWith('Sudah waktunya')).forEach(add);
    targeted.forEach(q=>add({q,reason:'Dari ceritamu: kita kuatkan '+q.tag+' dengan latihan yang lebih terarah.'}));
    base.forEach(add);return result;
  }
  const examples={
    words:['Makna dari konteks','“The kitten was tiny; it fitted in my hand.”','Petunjuk “muat di tanganku” membantu memahami tiny. Cari petunjuk di sekitar kata, bukan menerka dari bentuknya.'],
    grammar:['Tandai waktu, lalu bentuk kata kerja','“Yesterday, I played outside.” → “Tomorrow, I will play outside.”','Yesterday menunjukkan lampau. Tomorrow menunjukkan mendatang. Setelah will, gunakan kata kerja dasar: play.'],
    reading:['Temukan bukti sebelum memilih','“The library opens at nine. It closes at four.”','Untuk pertanyaan waktu buka, cari opens. Jangan tertukar dengan informasi closes. Garisbawahi bukti yang menjawab pertanyaan.'],
    social:['Cocokkan ucapan dengan kebutuhan','“Could you repeat that, please?”','Kalimat ini meminta penjelasan diulang dengan sopan. Dengarkan kebutuhan pembicara, lalu cari respons yang sesuai.'],
    logic:['Bedakan petunjuk dan kepastian','“The road is wet. It may have rained.”','Jalan basah mendukung kemungkinan hujan, tetapi belum membuktikannya secara pasti. Ada kemungkinan lain, misalnya jalan baru disiram.'],
    stories:['Urutkan tokoh, masalah, dan tindakan','“Rani lost her map. She asked a guide for directions.”','Tokoh: Rani. Masalah: peta hilang. Tindakan: meminta petunjuk. Urutan ini membantu memahami isi cerita.']
  };
  return {moods,difficulties,helps,followups,label,academic,questionsFor,normalise,create,dueDate,checkIn,evidence,support,blend,examples};
})();
