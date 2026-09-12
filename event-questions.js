/* Original practice questions aligned to the five images in D:\Silabus.
   Explicit IDs keep existing progress stable. Rows: prompt, options (|), answer,
   Indonesian explanation, optional passage, optional visual key. */
const EVENT_SYLLABI = [
 {id:'komperasia',name:'KOMPERASIA',source:'KOMPERASIA.PNG',scope:'Kelas 6 SD/MI',icon:'🏆',color:'#fff0ca'},
 {id:'omnas',name:'OMNAS',source:'OMNAS.PNG',scope:'Bahasa Inggris Level 4',icon:'🌏',color:'#d9f4e7'},
 {id:'ruangguru',name:'RUANGGURU',source:'RUANGGURU.PNG',scope:'English Olympiad · 4 bagian',icon:'💡',color:'#e6ddff'},
 {id:'stemco',name:'STEMCO',source:'STEMCO.PNG + STEMCO1.PNG',scope:'English · termasuk contoh silabus 2026 v1.0',icon:'🔬',color:'#dceffd'}
];
const EVENT_CONCEPTS=[];
(()=>{
 const levels=['Explorer','Challenger','Champion'];
 function unit(event,id,topic,tag,lesson,rows){
  const concept=event+'-'+id;EVENT_CONCEPTS.push({id:concept,event,topic,tag,lesson});
  const world=TOPICS.find(t=>t.id===topic);if(!world.tags.includes(tag))world.tags.push(tag);
  rows.forEach((r,i)=>{
   const options=r[1].split('|'),offset=(i+[...concept].reduce((n,c)=>n+c.charCodeAt(0),0))%4;
   QUESTIONS.push({id:'event-'+concept+'-'+(i+1),event,concept,topic,tag,level:levels[i%3],prompt:r[0],options:[...options.slice(offset),...options.slice(0,offset)],answer:(r[2]-offset+4)%4,explanation:r[3],passage:r[4]||'',visual:r[5]||null,hint:lesson});
  });
 }
 unit('komperasia','announcement','reading','Announcement','Cari siapa yang dituju, kegiatan, waktu, tempat, dan perubahan dalam pengumuman.',[
 ['Where will the chess club meet on Friday?','Room 2|The library|The playground|The canteen',1,'Pengumuman memindahkan pertemuan Jumat ke perpustakaan.','CHESS CLUB NOTICE\nFriday’s meeting will be in the library instead of Room 2. Bring your chess set. The meeting starts at 2 p.m.'],
 ['Who needs to act on this notice?','All visitors|Only teachers|Pupils who borrowed costumes|Pupils buying books',2,'Yang diminta mengembalikan barang adalah murid peminjam kostum.','Please return borrowed drama costumes to Ms Rosa by Tuesday. Pupils who have already returned theirs do not need to come.'],
 ['Which plan follows both instructions in the announcement?','Arrive at 8:20 with a bottle|Arrive at 8:10 without a bottle|Arrive at 8:10 with a bottle|Arrive at 9:00 with lunch',2,'Harus sudah hadir sebelum 8:15 serta membawa botol isi ulang.','SCIENCE TRIP\nBe at the gate before 8:15 a.m.; the bus leaves at 8:20. Bring a refillable water bottle. Disposable bottles are not allowed.'],
 ['What must runners bring to registration?','A library book|A signed form|A paintbrush|A chessboard',1,'Informasi wajibnya adalah formulir yang sudah ditandatangani.','FUN RUN\nRegistration is on Monday at the sports office. Every runner must bring a signed permission form.'],
 ['Why was this notice written?','To announce a changed rehearsal time|To describe a musical instrument|To sell concert tickets|To report a finished show',0,'Penulis memberi tahu jadwal latihan baru dan menegaskan tempat tetap sama.','CHOIR UPDATE\nWednesday’s rehearsal will begin at 3:30, not 3:00. We will still use the music room.'],
 ['Which information is still missing for a pupil wishing to join?','The activity|The day|The required equipment|The starting time',3,'Teks menyebut kegiatan, hari, dan alat, tetapi tidak menyebut jam mulai.','Join our kite-making workshop this Saturday in the art room. Bring scissors and coloured paper. Everyone in Year 6 is welcome.']
 ]);
 unit('komperasia','people','stories','Describing people','Bedakan ciri penampilan dan sifat. Simpulkan sifat dari tindakan yang benar-benar disebut.',[
 ['Which description matches Ella?','She has short straight hair|She has long curly hair|She wears a red cap|She has a blue coat',1,'Ella digambarkan berambut panjang dan keriting.','Ella has long curly hair and round glasses. She usually wears a green jacket.'],
 ['Which word best describes Rafi’s character?','Generous|Forgetful|Impatient|Careless',0,'Membagi bekal kepada teman yang lupa membawa makan menunjukkan sifat murah hati.','Rafi noticed that a classmate had no lunch. He quietly shared his sandwiches with her.'],
 ['Which conclusion about Mina is best supported?','She dislikes teamwork|She is always correct|She is willing to reconsider her ideas|She never makes plans',2,'Mina mengubah rancangan setelah mendengar bukti, sehingga terbuka untuk mempertimbangkan ulang.','Mina suggested a tall tower. When Leo showed that a wider base was steadier, she changed her design and thanked him.'],
 ['Which sentence describes appearance?','Ben is thoughtful|Ben is honest|Ben has freckles|Ben enjoys helping',2,'Freckles adalah bintik pada kulit, sehingga termasuk penampilan fisik.'],
 ['What does “reliable” suggest about Noor?','She can be depended on|She speaks the loudest|She has the newest bag|She avoids all work',0,'Selalu menyelesaikan tugas yang dijanjikan menunjukkan dapat diandalkan.','Noor is reliable: when she promises to feed the class fish, she always remembers.'],
 ['Which description avoids making an unsupported judgement?','He is unfriendly because he is quiet|He is nervous because he wears glasses|He is quiet during discussions and writes detailed notes|He is lazy because he sits at the back',2,'Pilihan ini melaporkan perilaku yang terlihat tanpa menebak sifat dari penampilan atau posisi duduk.']
 ]);
 unit('komperasia','synonyms','words','Synonym and antonym','Makna sinonim atau antonim harus sesuai konteks kalimat, bukan hanya pasangan yang pernah dihafal.',[
 ['Which word is closest in meaning to “tiny”?','Huge|Small|Heavy|Noisy',1,'Tiny berarti sangat kecil; small memiliki makna paling dekat.'],
 ['The path was narrow, so we walked in single file. What is the opposite of “narrow”?','Steep|Wide|Rough|Dark',1,'Narrow berarti sempit. Lawan katanya wide, yaitu lebar.'],
 ['The judge gave an impartial decision. Which word could replace “impartial”?','Biased|Unclear|Fair|Hasty',2,'Impartial berarti tidak memihak; fair adalah adil. Biased justru berlawanan makna.'],
 ['Which word means the opposite of “arrive”?','Reach|Enter|Visit|Depart',3,'Arrive berarti tiba, sedangkan depart berarti berangkat atau meninggalkan tempat.'],
 ['The soup was bland, so Ana added herbs. “Bland” here means …','not strongly flavoured|boiling hot|too expensive|brightly coloured',0,'Penambahan bumbu memberi petunjuk bahwa rasa sup kurang kuat.'],
 ['Which replacement keeps the meaning of “The evidence was compelling”?','convincing|unrelated|optional|invisible',0,'Compelling evidence adalah bukti yang sangat meyakinkan, bukan sekadar bukti yang terlihat.']
 ]);
 unit('komperasia','advertisement','reading','Advertisement','Iklan mengajak pembaca melakukan sesuatu. Periksa syarat, batas waktu, dan klaimnya sebelum memilih.',[
 ['What is being advertised?','A bicycle repair class|A swimming lesson|A book fair|A music concert',2,'Judul dan rincian harga membahas pameran buku.','WEEKEND BOOK FAIR!\nFind storybooks from Rp15,000. Visit the town hall on Sunday, 9 a.m.–2 p.m.'],
 ['When can a customer use this offer?','Monday at 5 p.m.|Tuesday at 3 p.m.|Saturday at 3 p.m.|Tuesday at 6 p.m.',1,'Promo berlaku Senin–Jumat pukul 2–4 sore; Selasa pukul 3 memenuhi kedua syarat.','JUICE CORNER\nBuy one, get one free! Weekdays only, 2–4 p.m. Offer ends this Friday.'],
 ['Which claim is an opinion rather than a checkable detail?','The shop opens at 10 a.m.|A notebook costs Rp8,000|The shop is on Pine Street|These are the most beautiful notebooks ever',3,'Penilaian paling indah bersifat subjektif, berbeda dari alamat, jam, atau harga.'],
 ['What should readers do to join the workshop?','Call the printed number|Wait at the bus stop|Bring a pet|Send a parcel',0,'Ajakan mendaftar meminta pembaca menelepon nomor yang dicetak.','MAKE YOUR OWN COMIC!\nSaturday workshop for ages 10–12. Call 021-555-0100 to book your place. Materials included.'],
 ['Which customer qualifies for the discount?','A nine-year-old buying one ticket|A twelve-year-old with a student card|An adult without identification|A teacher buying a gift',1,'Syaratnya berusia 10–13 tahun dan menunjukkan kartu pelajar.','MUSEUM EXPLORERS\nStudents aged 10–13 get 20% off entry. Show your student card at the desk.'],
 ['What should you check before assuming the camp is free?','Whether all listed activities and meals are included|Whether its name is colourful|Whether your friend likes its logo|Whether the poster has a border',0,'Free entry hanya menyatakan biaya masuk; aktivitas dan makanan mungkin memiliki biaya terpisah.','ADVENTURE CAMP OPEN DAY\nFree entry! Try exciting workshops and taste our camp meals. Ask at the desk for workshop and meal prices.']
 ]);
 unit('komperasia','past','grammar','Simple past tense','Simple past menyatakan kejadian lampau. Setelah did atau didn’t, gunakan kata kerja dasar.',[
 ['Last Sunday, we ___ a model boat.','build|built|builds|building',1,'Last Sunday menandai lampau. Bentuk past dari build adalah built.'],
 ['Which sentence correctly asks about yesterday?','Did Sari wrote the letter?|Does Sari wrote the letter?|Did Sari write the letter?|Was Sari write the letter?',2,'Pertanyaan simple past memakai did + subjek + kata kerja dasar write.'],
 ['Choose the only sentence with a consistent completed past-time meaning.','Last night, Tono finds his key and opens the door|Last night, Tono found his key and opened the door|Last night, Tono found his key and opens the door|Last night, Tono find his key and opened the door',1,'Kedua tindakan selesai tadi malam, sehingga gunakan found dan opened.'],
 ['The children ___ at the museum yesterday morning.','was|is|were|be',2,'The children jamak, jadi bentuk lampau be adalah were.'],
 ['Nadia did not ___ the final bus yesterday.','caught|catches|catching|catch',3,'Did not sudah membawa penanda lampau; kata kerja utamanya kembali ke catch.'],
 ['Which question asks about the person who broke the vase?','Who broke the vase?|Who did broke the vase?|Who was break the vase?|Who breaking the vase?',0,'Jika who menjadi subjek yang melakukan tindakan, gunakan Who broke … tanpa did tambahan.']
 ]);
 unit('komperasia','passive','grammar','Passive past tense','Past passive memakai was/were + past participle. Subjek menerima tindakan; sesuaikan was/were dengan subjek baru.',[
 ['The classroom ___ cleaned yesterday.','is|was|were|be',1,'The classroom tunggal dan waktunya lampau, sehingga was cleaned.'],
 ['Change to passive: “The pupils painted the benches.”','The benches painted the pupils|The benches were paint by the pupils|The benches were painted by the pupils|The benches are painting the pupils',2,'Objek benches menjadi subjek jamak, diikuti were + painted.'],
 ['Which passive sentence preserves the meaning of “A storm damaged three roofs last night”?','Three roofs are damaged every night|Three roofs were damaged by a storm last night|A storm was damaged by three roofs|Three roofs had damaged a storm last night',1,'Pelaku tetap badai, penerima tindakan tiga atap, dan waktunya tadi malam.'],
 ['The invitations ___ sent on Monday.','was|are being|were|is',2,'Invitations jamak sehingga menggunakan were sent dalam past passive.'],
 ['Which past passive sentence is correct?','The window was broke|The window were broken|The window was broken|The window did broken',2,'Past participle dari break adalah broken; subjek tunggal memakai was.'],
 ['Why might a report say “The missing bag was found at noon” without naming the finder?','To focus on the bag and the result|To show the bag found a person|To say it will happen tomorrow|To prove nobody found it',0,'Passive dapat menonjolkan benda dan hasil tindakan ketika pelaku tidak diketahui atau tidak penting.']
 ]);
 unit('omnas','places','stories','Describing places','Untuk mendeskripsikan sekolah atau rumah, hubungkan posisi ruangan, ciri, dan fungsi tempat.',[
 ['Which room is used for reading at Green School?','The kitchen|The library|The playground|The changing room',1,'Teks menyebut perpustakaan sebagai tempat murid membaca saat istirahat.','Green School has a small library beside the office. Pupils read there during break. The playground is behind the classrooms.'],
 ['Where is the study in this house?','Between the kitchen and the bedroom|Behind the garage|Above the garden|Outside the gate',0,'Posisi study dinyatakan langsung di antara dapur dan kamar tidur.','Our study is between the kitchen and the bedroom. It has a wide window facing the garden, so it is bright in the morning.'],
 ['Which detail best supports the idea that the classroom encourages group work?','It has a clock above the door|Its tables are arranged in small clusters|Its walls are pale yellow|It is on the first floor',1,'Meja berkelompok membantu diskusi dan kerja bersama; detail lain tidak langsung mendukung fungsi itu.'],
 ['Which sentence describes a school building?','Our school has two floors and a red roof|I usually walk to school|We studied fractions yesterday|School begins at seven',0,'Jumlah lantai dan warna atap adalah ciri fisik bangunan.'],
 ['Which title best fits the description?','A noisy football match|My quiet reading corner|How to cook rice|The history of bicycles',1,'Seluruh rincian menjelaskan sudut membaca yang tenang di rumah.','Under the stairs, a soft chair stands beside a narrow bookshelf. A small lamp lights the pages. This is where I read while the rest of the house is busy.'],
 ['Why is “spacious” a better description than “crowded” here?','The room has a locked door|There is plenty of room to move between desks|The desks are made of wood|A bell rings outside',1,'Spacious berarti luas dan lapang; ruang gerak yang cukup mendukung kata tersebut.']
 ]);
 unit('omnas','hobbies','words','Hobbies','Kenali nama kegiatan, perlengkapan, dan pola seperti enjoy + -ing atau be interested in + -ing.',[
 ['Luca collects stamps from many countries. What is his hobby?','Stamp collecting|Swimming|Baking|Hiking',0,'Mengumpulkan perangko disebut stamp collecting.'],
 ['Nisa enjoys ___ landscapes in her sketchbook.','draw|draws|drawing|drew',2,'Setelah enjoys, bentuk kegiatan yang digunakan adalah gerund drawing.'],
 ['Which club best matches Iman’s interests?','Choir: singing together|Gardening: growing vegetables|Robotics: designing and testing machines|Drama: acting on stage',2,'Minat merakit benda bergerak dan menguji mekanisme paling sesuai dengan robotika.','Iman likes assembling moving models and finding out why a mechanism stops working. He wants to learn to program small machines.'],
 ['Which tool is most useful for someone who enjoys birdwatching?','A whisk|Binoculars|A sewing needle|A rolling pin',1,'Binoculars membantu melihat burung dari jarak jauh.'],
 ['Choose the correct sentence about a hobby.','She is interested in weaving|She is interested at weave|She interested in weaving|She is interesting in weave',0,'Pola yang tepat ialah be interested in + kata benda atau gerund.'],
 ['Which reply explains a hobby preference rather than only naming a hobby?','I paint|My hobby is painting|I prefer painting because mixing colours relaxes me|Painting is an activity',2,'Pilihan ini menyebut kesukaan sekaligus alasan, ditandai because.']
 ]);
 unit('omnas','congratulations','social','Congratulating and complimenting','Congratulations merayakan pencapaian; compliment memuji kualitas atau usaha. Balas dengan sopan sesuai situasi.',[
 ['Your friend wins a spelling contest. What do you say?','Get well soon!|Congratulations on your win!|Please accept my apology|What time is lunch?',1,'Congratulations on your win tepat untuk merayakan prestasi teman.'],
 ['“Your poster is beautifully organised!” What is the best reply?','Thank you! I worked hard on the layout|You must stop looking at it|I am sorry you lost your bag|The bus is late',0,'Ucapan itu adalah pujian. Balasan berterima kasih dan menyebut usaha sesuai konteks.'],
 ['Which response praises effort without dismissing disappointment?','Only winners deserve praise|You should not feel anything|Your clear explanation showed real preparation; we can practise the tricky part together|You will certainly win every contest now',2,'Respons ini mengakui usaha dan menawarkan dukungan tanpa janji kemenangan yang tidak dapat dipastikan.','A friend prepared carefully but did not reach the debate final.'],
 ['Which sentence is a compliment?','Please open the box|Well done on finishing your model so neatly|Where is the box?|I left the box outside',1,'Well done dan so neatly menyatakan pujian terhadap hasil pekerjaan.'],
 ['Choose the correct expression.','Congratulations for pass your test|Congratulations on passing your test|Congratulation at passed your test|Congratulate in passing your test',1,'Ungkapan yang lazim adalah Congratulations on + kata benda atau gerund.'],
 ['Which compliment is most specific and useful after a presentation?','Everything in the world is perfect|Your diagram made the water cycle easy to follow|You are better than everyone forever|Nothing ever needs improving',1,'Pujian menyebut bagian konkret dan manfaatnya: diagram membantu pemahaman.']
 ]);
 unit('omnas','procedure','reading','Procedural text','Teks prosedur berisi tujuan, alat/bahan, dan langkah berurutan. Perhatikan before, after, until, serta kalimat perintah.',[
 ['What should you do first to make the bookmark?','Punch a hole|Tie the ribbon|Cut the card|Write your name last',2,'Langkah pertama yang tertulis adalah memotong kartu.','MAKE A BOOKMARK\n1. Cut a strip of card.\n2. Decorate it.\n3. Punch a hole at the top.\n4. Tie a ribbon through the hole.'],
 ['When should you plant the bean?','Before adding soil|After filling the pot with soil|After throwing the pot away|Before finding a pot',1,'Urutannya isi pot dengan tanah, lalu tanam kacang.','Fill a small pot with soil. Push a bean two centimetres into the soil. Cover it gently, then water it. Put the pot near a window.'],
 ['Why must the glue dry before the model is lifted?','To make the cardboard disappear|To prevent the joined parts from separating|To remove the need for any glue|To change the colour of the table',1,'Menunggu lem kering membantu sambungan kuat sehingga bagian model tidak lepas.','Join the cardboard pieces with glue. Leave the model flat until the glue is dry. Only then lift it onto the display stand.'],
 ['Which word introduces the last step?','First|Before|Finally|Meanwhile',2,'Finally memperkenalkan langkah terakhir dalam urutan.'],
 ['Which instruction is written as an imperative?','You mixed the batter|Mix the batter gently|The batter is smooth|The batter was mixed',1,'Imperative memakai kata kerja dasar di awal untuk memberi perintah: Mix.'],
 ['Which step is missing between steps 2 and 4?','Eat the unwashed fruit|Throw away the bowl|Put the fruit pieces into the bowl|Turn off the bedroom lamp',2,'Agar dapat mengaduk potongan buah pada langkah 4, masukkan potongan itu ke mangkuk dahulu.','FRUIT SALAD\n1. Wash the fruit.\n2. Cut the fruit into small pieces.\n3. ___.\n4. Stir the pieces gently with yoghurt.']
 ]);
 unit('omnas','perfect','grammar','Present perfect tense','Present perfect memakai have/has + past participle untuk pengalaman atau hubungan masa lalu dengan sekarang. Since = titik awal; for = durasi.',[
 ['I ___ finished my homework, so I can play now.','has|have|am|was',1,'Subjek I menggunakan have + finished; hasil selesai relevan sekarang.'],
 ['She has lived here ___ 2021.','for|during|since|at',2,'2021 adalah titik awal, sehingga gunakan since.'],
 ['Which sentence correctly contrasts an experience with a finished past event?','I have visited Bali; I went there last July|I have visited Bali last July|I has visited Bali; I go there last July|I visited Bali since three years',0,'Pengalaman tanpa waktu spesifik memakai have visited; last July adalah waktu lampau selesai sehingga went.'],
 ['Which past participle completes “Leo has ___ his lunch”?','ate|eat|eaten|eating',2,'Bentuk past participle eat adalah eaten, jadi has eaten.'],
 ['Have you finished your project ___?','yet|since|ever ago|last night',0,'Yet lazim dipakai dalam pertanyaan present perfect tentang sesuatu yang diharapkan selesai.'],
 ['“Aya has gone to the library” usually suggests that …','Aya is back home already|Aya has never visited a library|Aya is still there or on her way there|Aya went there only ten years ago',2,'Has gone to biasanya berarti pergi dan belum kembali; has been to menyatakan pernah berkunjung.']
 ]);
 unit('omnas','letters','social','Informal letters and messages','Surat informal memiliki sapaan, isi, dan penutup yang akrab. Pesan singkat tetap perlu tujuan dan rincian yang jelas.',[
 ['Who wrote this message?','Lila|Reno|The librarian|The coach',1,'Nama setelah penutup menandai pengirim, yaitu Reno.','Hi Lila,\nCan you bring my drawing book tomorrow? I left it at your house. Thanks!\nReno'],
 ['What should Hana do after reading the message?','Meet at the park at four|Meet at the library at four|Meet at the park at three|Cancel all plans',1,'Pesan mempertahankan jam empat tetapi mengubah lokasi menjadi perpustakaan.','Hi Hana! It may rain, so let’s meet at the library instead of the park. Four o’clock still works. See you! — Jo'],
 ['Which reply best resolves the missing information?','Thanks, what time should I arrive on Saturday?|I dislike all birthdays|You are welcome for the pencil|Saturday is a day of the week',0,'Undangan belum mencantumkan jam; balasan ini meminta rincian yang diperlukan dengan sopan.','Dear Mika,\nI’m having a birthday picnic at Lake Park this Saturday. Please come! Bring a hat.\nLove, Sela'],
 ['Which closing suits a letter to a close friend?','See you soon,|To whom it may concern,|WARNING: DANGER|Invoice number:',0,'See you soon adalah penutup akrab yang sesuai surat kepada teman.'],
 ['Why does the writer send this message?','To apologise and suggest another time|To advertise a bicycle|To congratulate a winner|To ask for homework answers',0,'Penulis meminta maaf karena tidak bisa hadir lalu menawarkan pengganti waktunya.','Sorry, I can’t cycle with you this afternoon because my bike needs repairing. Could we go on Sunday morning instead?'],
 ['Which message is clearest for a friend collecting a parcel?','Get it there later|Please collect my blue parcel from the school office before 3 p.m. today|The thing is somewhere|Remember what I said before',1,'Pesan menyebut benda, tempat, dan batas waktu sehingga dapat ditindaklanjuti tanpa menebak.']
 ]);
 unit('ruangguru','vocabulary','words','Vocabulary in context','Bagian A: tentukan kelas kata dan makna yang dibutuhkan oleh keseluruhan kalimat.',[
 ['The baby was asleep, so we spoke in a ___.','whisper|thunder|shout|roar',0,'Whisper berarti bisikan, cocok agar bayi yang tidur tidak terbangun.'],
 ['The bridge is temporary; workers will replace it next month. “Temporary” means …','lasting forever|not permanent|made of gold|impossible to cross',1,'Rencana mengganti jembatan memberi petunjuk bahwa temporary berarti sementara.'],
 ['A plausible explanation is one that …','must be true without evidence|cannot be understood|seems reasonable but still needs checking|has no connection to the facts',2,'Plausible berarti masuk akal atau mungkin benar, bukan pasti terbukti.']
 ]);
 unit('ruangguru','tenses','grammar','Tenses & advanced sentence structure','Bagian A: bandingkan waktu, durasi, dan urutan kejadian sebelum memilih bentuk kata kerja.',[
 ['Listen! Someone ___ at the door right now.','knocked|is knocking|knock|will knocked',1,'Listen dan right now menunjukkan tindakan sedang berlangsung: is knocking.'],
 ['While I ___ the map, the guide explained the route.','was studying|study|have studied tomorrow|am study',0,'Past continuous menggambarkan tindakan yang sedang berlangsung ketika tindakan lampau lain terjadi.'],
 ['By the time the guests arrived, we ___ all the chairs.','have arranged|arrange|had arranged|will arrange',2,'Penataan kursi selesai sebelum kedatangan tamu, sehingga past perfect had arranged.']
 ]);
 unit('ruangguru','conjunction','grammar','Conjunctions','Bagian A: because memberi alasan, although pertentangan, dan unless berarti if not.',[
 ['We stayed inside ___ it was raining heavily.','because|unless|or|although',0,'Hujan deras merupakan alasan tinggal di dalam, sehingga because.'],
 ['___ the bag was heavy, Mei carried it upstairs.','Because of|Although|Unless|During',1,'Klausa menunjukkan pertentangan: meski berat, tas tetap dibawa ke atas.'],
 ['“You cannot enter unless you have a ticket” means …','A ticket is not needed|Only people without tickets may enter|You need a ticket to enter|Everyone with a ticket must enter',2,'Unless berarti if not. Kalimat menetapkan tiket sebagai syarat masuk, bukan kewajiban masuk.']
 ]);
 unit('ruangguru','relative','grammar','Relative clauses','Bagian A: who merujuk orang, which benda, whose kepemilikan. Klausa relatif menjelaskan kata benda.',[
 ['The girl ___ won the race is my neighbour.','which|who|where|when',1,'Yang dijelaskan adalah orang, sehingga who sesuai sebagai subjek klausa relatif.'],
 ['I met the boy ___ bicycle was stolen.','who|which|whose|where',2,'Whose menunjukkan kepemilikan: sepeda milik anak tersebut.'],
 ['Which sentence clearly says that only the damaged books were replaced?','The books that were damaged were replaced|The books were replaced, and none was damaged|All books were replaced whether damaged or not|The books were damaged after being replaced',0,'Klausa pembatas that were damaged membatasi kelompok buku yang diganti.']
 ]);
 unit('ruangguru','word-relations','words','Synonym and antonym','Bagian A: pastikan sinonim atau antonim tetap cocok dengan konteks, termasuk makna kata yang berubah.',[
 ['Choose a synonym for “glad”.','Happy|Angry|Sleepy|Hungry',0,'Glad berarti senang; happy adalah sinonimnya.'],
 ['The teacher gave a brief explanation. Which word is opposite to “brief” here?','Short|Clear|Lengthy|Useful',2,'Brief berarti singkat; lengthy berarti panjang atau memakan banyak waktu.'],
 ['“The company rejected the proposal.” Which replacement reverses the meaning of “rejected”?','considered|accepted|postponed|examined',1,'Accepted berarti menerima, berlawanan dengan rejected yang berarti menolak.']
 ]);
 unit('ruangguru','main-idea','reading','Finding main idea','Bagian B: ide utama mencakup keseluruhan bacaan; rincian contoh mendukung ide tersebut.',[
 ['What is this paragraph mainly about?','Ways to care for a pet rabbit|How to buy a bicycle|Reasons to close a library|The colour of school uniforms',0,'Makanan, air, dan kandang merupakan bagian perawatan kelinci.','Pet rabbits need fresh water, suitable food, and a clean place to live. Their cages should be checked every day, and they need room to move safely.'],
 ['Which sentence best summarises the paragraph?','Only old objects can be repaired|Repair cafés help people fix items and share skills|Every broken item must be thrown away|Volunteers sell only new machines',1,'Bacaan membahas perbaikan benda serta pembelajaran keterampilan bersama.','At a repair café, volunteers help visitors mend broken objects. A retired electrician may fix a lamp while teaching its owner how to replace a wire safely. Other volunteers repair torn bags. Visitors save useful items and learn new skills.'],
 ['Which title captures both the benefit and the limitation in the text?','Technology Solves Every Problem|Why Nobody Should Use Maps|Digital Maps: Useful Guides That Still Need Judgement|The History of Paper',2,'Teks menyeimbangkan manfaat peta digital dengan perlunya menilai kondisi nyata.','Digital maps can quickly suggest routes and estimate journey times. They are especially helpful in unfamiliar places. However, a suggested shortcut may be closed or unsuitable for walking. Travellers still need to read local signs and consider what they see around them.']
 ]);
 unit('ruangguru','idioms','words','Idiomatic phrases','Bagian B: idiom adalah ungkapan bermakna khusus. Tafsirkan dari situasi, bukan arti harfiah setiap kata.',[
 ['“Good luck! Break a leg in the school play!” What does the speaker mean?','Get injured|Perform well|Leave the theatre|Stop rehearsing',1,'Break a leg adalah ungkapan untuk mendoakan keberhasilan pertunjukan.'],
 ['“This puzzle is a piece of cake for Mira.” The puzzle is …','very easy for Mira|made from flour|too heavy to lift|impossible for everyone',0,'A piece of cake berarti sesuatu yang mudah dilakukan.'],
 ['“Let’s not jump to conclusions before reading the whole report.” What is being advised?','Choose the first guess immediately|Ignore all reports|Wait for enough evidence before deciding|Read only the title',2,'Jump to conclusions berarti menyimpulkan terlalu cepat tanpa bukti memadai.']
 ]);
 unit('ruangguru','cause','reading','Cause and effect','Bagian B: cari hubungan sebab-akibat yang didukung teks. Kejadian berurutan saja belum membuktikan sebab.',[
 ['Why did the match stop?','The ball was new|Lightning was seen nearby|The team wore blue|The crowd bought snacks',1,'Teks menyatakan kilat di dekat lapangan sebagai alasan pertandingan dihentikan.','The referee stopped the match because lightning was seen near the field. Everyone moved into the building.'],
 ['What was one effect of adding more bicycle racks?','Fewer pupils could park bicycles|The school removed its gates|More pupils could leave their bicycles securely|All buses stopped running',2,'Penambahan rak menyediakan tempat mengunci sepeda sehingga lebih banyak sepeda tersimpan aman.','Previously, pupils struggled to find places to lock their bicycles. The school installed additional racks. The following week, more bicycles were parked securely inside the grounds.'],
 ['Which conclusion is justified by this information?','The new poster alone definitely caused the increase|Attendance increased, but the separate effects of the changes are unknown|Free transport cannot affect attendance|Every pupil prefers posters to buses',1,'Dua perubahan terjadi bersamaan; data belum memisahkan pengaruh poster dan transportasi.','The science club put up colourful posters and began offering a free bus home. Attendance increased the next month.']
 ]);
 unit('ruangguru','figurative','reading','Figurative language','Bagian B: simile membandingkan dengan like/as; metafora menyamakan secara kiasan. Cari kesan yang dibangun.',[
 ['“Her smile was as bright as sunshine” is an example of …','a simile|a timetable|an instruction|a question',0,'Perbandingan memakai as … as disebut simile.'],
 ['“The classroom was a beehive of activity” suggests that it was …','filled with actual bees|busy with many people doing things|completely empty|too cold to enter',1,'Metafora sarang lebah menggambarkan aktivitas yang ramai dan sibuk.'],
 ['What does “a thread of hope remained” suggest?','Someone was sewing a flag|Hope had disappeared completely|A small but continuing possibility remained|Success was completely certain',2,'Thread yang tipis menggambarkan harapan kecil yang belum putus, bukan kepastian berhasil.']
 ]);
 unit('ruangguru','pragmatics','social','Pragmatic meaning and tone','Bagian C: dalam dialog, cocokkan respons dengan maksud, hubungan pembicara, kesopanan, dan nada.',[
 ['“Could you pass the glue, please?” Choose the best reply.','Here you are|I am twelve|It rained yesterday|My shoes are brown',0,'Permintaan menyerahkan lem dijawab dengan Here you are saat memberikannya.'],
 ['A visitor asks, “Is there a quieter place to read?” Which reply is most helpful?','Reading is a verb|Try the upstairs room; it is usually quiet|You must dislike books|Everyone should shout',1,'Balasan ini menanggapi kebutuhan tempat tenang dan memberi saran konkret.'],
 ['“I see your point, but could we check the figures once more?” What is the tone?','Threatening and insulting|Completely uninterested|Respectful but cautious|Certain that all figures are wrong',2,'Pembicara mengakui pandangan orang lain sambil mengusulkan pemeriksaan, tanpa menuduh.']
 ]);
 unit('ruangguru','scrambling','logic','Sentence unscrambling','Bagian D: susun subjek, kata keterangan, kata kerja, dan pelengkap. Periksa makna serta urutan yang wajar.',[
 ['Arrange: (1) reads (2) every evening (3) Tara (4) a story.','3–1–4–2|1–3–2–4|4–2–1–3|2–4–3–1',0,'Urutan: Tara reads a story every evening. Subjek mendahului kata kerja.'],
 ['Arrange: (1) arrives (2) the school bus (3) usually (4) before seven.','3–1–2–4|2–3–1–4|3–4–2–1|1–4–3–2',1,'Usually lazim diletakkan sebelum kata kerja utama: The school bus usually arrives before seven.'],
 ['Arrange: (1) despite the noise (2) the young pianist (3) rarely (4) loses concentration.','2–4–3–1|3–2–1–4|2–3–4–1|1–4–2–3',2,'Kalimatnya: The young pianist rarely loses concentration despite the noise. Rarely mendahului loses.']
 ]);
 unit('ruangguru','prepositions','grammar','Idiomatic prepositions','Bagian D: beberapa kata berpasangan dengan preposisi tertentu, misalnya proud of, depend on, dan capable of.',[
 ['We are proud ___ our class project.','of|at|from|by',0,'Pasangan yang tepat adalah proud of, artinya bangga terhadap.'],
 ['Whether we can sail depends ___ the weather.','at|on|for|into',1,'Depend berpasangan dengan on untuk menyatakan bergantung pada.'],
 ['Choose the correct sentence.','She is capable for solving it|She is capable to solving it|She is capable of solving it|She is capable with solve it',2,'Pola baku ialah capable of + gerund, sehingga capable of solving.']
 ]);
 unit('ruangguru','errors','logic','Multiple-error analysis','Bagian D: periksa setiap bagian kalimat secara terpisah: subjek-kata kerja, penanda waktu, bentuk kata, dan penentu.',[
 ['Correct: “My brother have two kite.”','My brother has two kites|My brother have two kites|My brother has two kite|My brothers has two kite',0,'Brother tunggal memakai has, dan two membutuhkan kata benda jamak kites.'],
 ['Correct both errors: “Yesterday, they goed to a museum and buyed postcards.”','Yesterday, they go to a museum and buy postcards|Yesterday, they went to a museum and bought postcards|Yesterday, they went to a museum and buyed postcards|Yesterday, they goed to a museum and bought postcards',1,'Go dan buy tidak beraturan: bentuk lampau yang benar adalah went dan bought.'],
 ['Which revision fixes all errors in “Each of the players have a uniform, and they was ready yesterday”?','Each of the players have a uniform, and they were ready yesterday|Each of the players has a uniform, and they was ready yesterday|Each of the players has a uniform, and they were ready yesterday|Each of the player has a uniform, and they were ready yesterday',2,'Each memakai has; setelah each of the tetap players jamak. They mengacu para pemain sehingga were.']
 ]);
 const stemReading='TEXT A — SCHOOL NEWS\nFor years, pupils at Willow School avoided the courtyard at lunchtime because it had little shade. In March, the gardening club planted young trees along its edges. The trees will need several years to provide much shade, so the school also installed a temporary fabric canopy. Classes now take turns watering the trees, using rainwater collected from the roof. The headteacher hopes the project will make the courtyard cooler and help pupils learn how to care for living things.\n\nTEXT B — GARDENING CLUB DIARY\nMonday: We checked the soil before watering. It was still wet after Sunday’s rain, so we did not add more water. Thursday: Strong winds loosened one corner of the canopy. We told a teacher and kept away until a worker secured it. Friday: More pupils ate in the courtyard. We counted twenty-four at lunchtime, compared with only eight on the Friday before the canopy was installed. These are only two observations, so we plan to count again over the next few weeks. We also want to ask pupils whether shade, the weather, or something else influenced their choice of lunch spot.';
 unit('stemco','multi-text','reading','Multiple texts and sustained reading','STEMCO Reading: baca beberapa teks sampai selesai, cocokkan informasi lintas teks, dan bedakan bukti dengan dugaan.',[
 ['According to Text A, what will eventually provide natural shade?','Young trees|Painted walls|Rain barrels|Lunch boxes',0,'Text A menyebut pohon muda membutuhkan beberapa tahun sebelum memberi banyak keteduhan.',stemReading],
 ['Why did the club not water the trees on Monday?','Nobody remembered the trees|The soil was still wet|The trees had been removed|The canopy blocked the gate',1,'Text B menyebut tanah masih basah setelah hujan Minggu sehingga tidak perlu tambahan air.',stemReading],
 ['Which conclusion best combines the information in both texts?','The trees already provide all the shade|The canopy definitely tripled attendance by itself|The courtyard is being improved, but more observations are needed to explain lunch choices|Watering wet soil every day is required',2,'Text A menjelaskan perbaikan bertahap. Text B mencatat kenaikan pengunjung tetapi belum membuktikan penyebabnya dari hanya dua pengamatan.',stemReading]
 ]);
 unit('stemco','pictures','reading','Reading pictures','STEMCO Reading: baca judul, simbol, label, dan posisi pada gambar. Cocokkan bukti visual dengan kalimat.',[
 ['Which place is north-west of the pond on the map?','The library|The café|The garden|The gate',0,'Utara mengarah ke atas dan barat ke kiri; perpustakaan berada di kiri atas kolam.','Use the map. North is at the top.','map'],
 ['Starting at the gate, which route reaches the library using the marked paths?','West, then south|North, then west|East, then south|South, then east',1,'Dari gerbang di kanan bawah, naik ke kafe lalu ke kiri ke perpustakaan mengikuti garis jalan.','Follow the paths shown on the map.','map'],
 ['A pupil wants to walk from the gate to the garden without passing the café. Which route works?','Gate → café → library → garden|Gate → pond → garden|Gate → library directly|Gate → café → garden directly',1,'Garis menghubungkan gerbang ke kolam dan kolam ke kebun, tanpa melewati kafe.','Use only the paths drawn on the map.','map']
 ]);
 unit('stemco','long-sentences','reading','Longer sentence comprehension','STEMCO Reading: cari klausa utama dahulu, lalu hubungkan keterangan, syarat, dan anak kalimat tanpa kehilangan subjek.',[
 ['Who carried the basket in this sentence?','The neighbour|The puppy|Maya|The teacher',2,'Subjek klausa utama adalah Maya. Frasa bersama adik tidak mengganti subjek tindakan.','Maya, who had just returned from the market with her little brother, carried the basket into the kitchen.'],
 ['What must happen before the pupils can use the equipment?','They must read the instructions and have a teacher present|They must only open the box|They must wait until everyone leaves|They must remove all labels',0,'Kalimat mensyaratkan instruksi sudah dibaca dan guru hadir; kedua syarat diperlukan.','Although the equipment has arrived, pupils may use it only after they have read the instructions and while a teacher is present.'],
 ['Which summary preserves the meaning?','All pupils missed the bus|The pupils who missed the first bus still arrived before the show because another bus came|The show began before any bus arrived|A later bus caused every pupil to miss the show',1,'Anak kalimat membatasi kelompok murid, sedangkan because menjelaskan alasan mereka tetap tepat waktu.','The pupils who missed the first bus, which left earlier than expected, still reached the theatre before the show began because a second bus arrived ten minutes later.']
 ]);
 unit('stemco','spelling','words','Spelling','STEMCO Writing: amati urutan huruf, huruf ganda, serta perubahan ejaan saat akhiran ditambahkan.',[
 ['Which word is spelled correctly?','becaus|because|becuase|beacuse',1,'Ejaan baku adalah because, dengan urutan a-u setelah bec.'],
 ['Choose the correctly spelled word meaning “needed”.','neccessary|necesary|necessary|nessesary',2,'Necessary memakai satu c dan dua s.'],
 ['Which pair correctly adds -ing to “run” and “make”?','runing / makeing|running / making|running / makeing|runing / making',1,'Run menggandakan n sebelum -ing; make menghilangkan e terakhir sebelum -ing.']
 ]);
 unit('stemco','cursive','words','Recognition of cursive writing','STEMCO Writing: ikuti bentuk huruf yang tersambung dari kiri ke kanan; bedakan lengkungan, batang tinggi, dan urutan huruf.',[
 ['Which printed word matches the joined-up handwriting shown?','cat|car|cot|cut',0,'Tulisan sambung itu membentuk huruf c-a-t, sehingga kata yang sesuai adalah cat.','','cursive-cat'],
 ['Read the joined-up word. Which meaning matches it?','A place to swim|A publication with pages|A type of shoe|A tool for cutting',1,'Tulisan berbunyi book, yaitu publikasi dengan halaman-halaman untuk dibaca.','','cursive-book'],
 ['Which sentence contains the exact handwritten word?','We saw a bright star|The night was cool and quiet|She bought a new bag|He made a slight turn',1,'Tulisan sambung membentuk n-i-g-h-t. Kata night muncul dengan ejaan yang sama pada kalimat tentang malam yang sejuk.','','cursive-night']
 ]);
 unit('stemco','tenses','grammar','Tenses & advanced sentence structure','STEMCO Grammar: gunakan petunjuk waktu dan makna kebiasaan, proses, atau kejadian selesai.',[
 ['Every Saturday, Deni ___ his grandmother.','visit|visits|visited yesterday|visiting',1,'Every Saturday menyatakan kebiasaan dan Deni tunggal sehingga visits.'],
 ['At nine last night, we ___ a documentary when the lights went out.','watch|will watch|were watching|have watch',2,'Tindakan yang sedang berlangsung pada waktu lampau memakai were watching.'],
 ['Which sentence describes a future action that will be in progress at a stated time?','At this time tomorrow, I will be travelling to Bandung|I travelled to Bandung yesterday|I travel to Bandung every month|I had travelled to Bandung before the race',0,'Will be + -ing menyatakan tindakan yang akan sedang berlangsung pada waktu masa depan.']
 ]);
 unit('stemco','prepositions','grammar','Prepositions of place and time','STEMCO Grammar: at untuk jam tertentu, on untuk hari/tanggal, in untuk ruang atau periode; baca relasi posisinya.',[
 ['The lesson starts ___ 8:30 a.m.','in|on|at|under',2,'Jam tertentu memakai preposisi at.'],
 ['The keys are ___ the two books, not inside either book.','between|during|since|onto',0,'Between menyatakan posisi di antara dua benda.'],
 ['Choose the correct pair: “The exhibition opens ___ Monday and continues ___ three weeks.”','in / since|on / for|at / during of|on / since',1,'Hari memakai on; durasi tiga minggu memakai for, bukan since yang menunjukkan titik awal.']
 ]);
 unit('stemco','nouns','grammar','Nouns and proper nouns','STEMCO Grammar: proper noun menamai orang, tempat, atau hari tertentu dan memakai huruf kapital. Periksa bentuk jamak.',[
 ['Which word is a proper noun?','city|river|Jakarta|teacher',2,'Jakarta adalah nama kota tertentu; pilihan lain kata benda umum.'],
 ['Choose the correct plural of “child”.','childs|children|childes|childrens',1,'Bentuk jamak child tidak beraturan, yaitu children.'],
 ['Which sentence uses capitals correctly?','On monday, we visited lake Toba|On Monday, we visited Lake Toba|On Monday, We visited lake toba|on Monday, we visited Lake toba',1,'Awal kalimat, hari Monday, dan nama tempat Lake Toba memakai huruf kapital.']
 ]);
 unit('stemco','pronouns','grammar','Pronoun','STEMCO Grammar: cocokkan pronoun dengan orang/benda yang dirujuk dan perannya dalam kalimat.',[
 ['The parcel is for Rina. Please give it to ___.','she|her|hers|herself alone',1,'Setelah to dibutuhkan object pronoun her.'],
 ['These shoes belong to the twins. They are ___.','their|them|theirs|they',2,'Theirs adalah possessive pronoun yang dapat berdiri tanpa kata benda setelahnya.'],
 ['Which revision clearly says that Bima was tired?','Bima told Arman that he was tired|Feeling tired, Bima told Arman that he needed to rest|Bima told Arman that they was tired|He told him that he was tired',1,'Frasa Feeling tired langsung menjelaskan Bima sehingga rujukan keadaan lelah menjadi jelas.']
 ]);
 unit('stemco','punctuation','grammar','Commas and sentence punctuation','STEMCO Punctuation: koma memisahkan unsur daftar atau sapaan; titik menutup pernyataan, ? pertanyaan, dan ! seruan.',[
 ['Which punctuation ends a direct question?','A comma|A full stop|A question mark|An apostrophe',2,'Pertanyaan langsung diakhiri tanda tanya.'],
 ['Which sentence correctly punctuates a list?','We packed apples bread and cheese|We packed apples, bread, and cheese.|We, packed apples bread and cheese|We packed, apples bread and cheese',1,'Koma memisahkan anggota daftar dan titik menutup kalimat. Koma sebelum and juga dapat digunakan.'],
 ['Which sentence correctly separates a direct address?','Let’s eat Grandma!|Let’s eat, Grandma!|Let’s, eat Grandma!|Let’s eat Grandma,',1,'Koma sebelum Grandma menunjukkan sapaan kepada nenek, sehingga maknanya ajakan makan bersama.']
 ]);
 unit('stemco','speech','grammar','Direct speech punctuation','STEMCO Punctuation: tanda petik membatasi kata-kata yang diucapkan. Tanda tanya/seru berada di dalam petikan jika menjadi bagian ucapan.',[
 ['Which sentence marks the spoken words correctly?','Mia said, “Hello.”|Mia “said, Hello.”|“Mia said,” Hello.|Mia said Hello.”',0,'Tanda petik mengapit Hello, yaitu kata yang benar-benar diucapkan.'],
 ['Choose the correctly punctuated spoken question.','“Where is my hat”? asked Ali.|“Where is my hat?” asked Ali.|“Where is my hat,”? asked Ali.|Where is “my hat? asked Ali.”',1,'Tanda tanya milik ucapan diletakkan sebelum tanda petik penutup; asked tetap huruf kecil.'],
 ['Which sentence correctly punctuates speech after a dependent clause?','When the door opened, Sara shouted, “Watch out!”|When the door opened Sara shouted “Watch out”!|When the door opened, “Sara shouted,” Watch out!|When the door opened Sara, shouted “Watch out.”!',0,'Koma memisahkan klausa pembuka dan pengantar ucapan. Tanda seru diletakkan di dalam petikan.']
 ]);
 unit('stemco','complex-words','words','Complex vocabulary in context','STEMCO Vocabulary: gunakan penjelas, pertentangan, dan akibat dalam kalimat untuk memahami kata kompleks.',[
 ['The fragile cup broke when it fell. “Fragile” means …','easily broken|extremely heavy|always wet|made of paper only',0,'Fragile berarti rapuh atau mudah pecah; kejadian cangkir pecah mendukung makna itu.'],
 ['The water was transparent, so we could see the stones below. “Transparent” means …','too deep to measure|allowing light to pass through clearly|full of mud|completely frozen',1,'Batu terlihat melalui air, menunjukkan air bening yang meneruskan cahaya.'],
 ['The two accounts were contradictory: one said the gate was open, the other said it was locked. “Contradictory” means …','giving exactly the same information|written by the same person|containing opposing claims|equally detailed',2,'Pernyataan terbuka dan terkunci saling bertentangan, sehingga contradictory berarti berisi klaim yang berlawanan.']
 ]);
 unit('stemco','agreement','grammar','Subject–verb agreement','Contoh STEMCO1: frasa together with tidak mengubah jumlah subjek utama. Tentukan subjek dan waktu terlebih dahulu.',[
 ['The captain ___ happy after yesterday’s match.','were|was|are|be',1,'Captain tunggal dan waktunya lampau, sehingga was.'],
 ['Rosa, together with her cousins, ___ at the zoo yesterday.','were|are|was|be',2,'Subjek utama Rosa tunggal. Together with her cousins merupakan tambahan, jadi was.'],
 ['Which sentence correctly matches the verb to the main subject and past time?','The box of old photographs were missing yesterday|The box of old photographs was missing yesterday|The boxes of old photographs was missing yesterday|The box of old photographs are missing yesterday',1,'Subjek inti box tunggal, bukan photographs; penanda yesterday membutuhkan was.']
 ]);
 unit('stemco','phrasal','words','Phrasal verbs','Contoh STEMCO1: gabungan verb dan particle dapat bermakna khusus. Pada separable phrasal verb, pronoun biasanya berada di tengah.',[
 ['Please ___ the light before leaving the empty room.','turn off|grow up|look after|run into',0,'Turn off berarti mematikan, sesuai tindakan pada lampu sebelum keluar.'],
 ['The loud noise put Amira off studying in that room. What happened?','She became more eager to study there|She was discouraged from studying there|She turned on the noise|She finished all her work there',1,'Put someone off doing something berarti membuat seseorang enggan melakukan kegiatan itu.'],
 ['Which sentence correctly uses a pronoun with “turn off”?','Please turn off it|Please off turn it|Please turn it off|Please it turn off',2,'Turn off dapat dipisah; object pronoun it harus berada di antara turn dan off.']
 ]);
})();
