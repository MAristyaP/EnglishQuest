/* Each scene has three different, picture-dependent questions. Stable IDs. */
(()=>{
 const levels=['Explorer','Challenger','Champion'];
 function scene(picture,topic,tag,event,concept,rows){
  rows.forEach((r,i)=>{const opts=r[1].split('|'),offset=(picture.length+i)%4;QUESTIONS.push({id:'picture-'+picture+'-'+(i+1),picture,topic,tag,event:event||undefined,concept:concept||undefined,level:levels[i],prompt:r[0],options:[...opts.slice(offset),...opts.slice(0,offset)],answer:(r[2]-offset+4)%4,explanation:r[3],passage:'',hint:r[4]||'Amati semua bagian gambar, termasuk posisi, simbol, waktu, dan label. Cocokkan bukti dengan pertanyaan.'});});
 }
 scene('festival','reading','Announcement','komperasia','komperasia-announcement',[
 ['Where will Art Day take place?','In the school garden|In the library|At the swimming pool|At the station',0,'Poster mencantumkan School garden sebagai lokasi acara.'],
 ['Which visitor meets the badge workshop’s age requirement?','A nine-year-old|An eleven-year-old|A fourteen-year-old|An adult',1,'Rentang pada poster adalah usia 10–12 tahun; anak berusia sebelas tahun memenuhi syarat.'],
 ['Which statement correctly interprets the poster?','Every activity is free|The workshop starts when Art Day ends|Entry is free, but the badge workshop costs Rp10,000|The workshop is only for adults',2,'Free entry berarti masuk acara gratis. Workshop memiliki harga sendiri, yaitu Rp10,000, dan dimulai pukul sebelas.']
 ]);
 scene('market','reading','Advertisement','komperasia','komperasia-advertisement',[
 ['Which fruit costs Rp5,000 each?','An apple|A pear|A banana|An orange',1,'Label pada buah pir menyebut PEAR · Rp5,000.'],
 ['Which purchase qualifies for the special offer?','Three pears|One apple and two pears|Three apples|One pear',2,'Penawaran bertuliskan 3 apples = Rp10,000, sehingga hanya berlaku untuk tiga apel.'],
 ['Compared with buying three apples at the single-apple price, how much does the offer save?','Rp1,000|Rp2,000|Rp4,000|Rp5,000',1,'Tiga apel harga biasa: 3 × Rp4,000 = Rp12,000. Harga penawaran Rp10,000, jadi hemat Rp2,000.']
 ]);
 scene('people','stories','Describing people','komperasia','komperasia-people',[
 ['Who is wearing an orange shirt?','Ada|Ben|Cora|All three pupils',1,'Pada gambar, Ben di tengah memakai baju oranye.'],
 ['Which description identifies Ada without using her name?','Short hair and an orange shirt|Long hair and round glasses|Long hair and a green shirt|Short hair and glasses',1,'Ada memiliki rambut panjang, kacamata bulat, dan baju ungu. Cora berambut panjang tetapi tidak berkacamata.'],
 ['Which statement is supported by the picture alone?','Ada is the best reader|Ben dislikes gardening|Cora is wearing green and has no glasses|Cora is older than Ben',2,'Baju hijau dan tidak berkacamata terlihat langsung. Minat, kemampuan, dan usia tidak dapat ditentukan hanya dari penampilan.']
 ]);
 scene('house','stories','Describing places','omnas','omnas-places',[
 ['Which room is in the north-east corner?','The kitchen|The bedroom|The study|The living room',2,'Utara di atas dan timur di kanan. Ruangan kanan atas adalah study.'],
 ['Which sentence correctly describes the plan?','The kitchen is south of the bedroom|The study is north of the living room|The bedroom is east of the living room|The living room is west of the kitchen',1,'Study berada tepat di atas living room, jadi berada di utaranya.'],
 ['A note says only “I left the letter on a desk.” Why is the location still unclear?','There are no desks|Both the study and the bedroom contain a desk|Every room contains a sofa|Only the kitchen contains furniture',1,'Gambar menunjukkan meja di study dan bedroom; menyebut desk saja belum menentukan ruangan.']
 ]);
 scene('recipe','reading','Procedural text','omnas','omnas-procedure',[
 ['What is added to the pot first?','Milk|Soil|Paint|Sandwiches',1,'Panel 1 berlabel SOIL memperlihatkan tanah dimasukkan ke pot.'],
 ['Which instruction matches panel 3?','Put the pot in a cupboard|Water the bean gently|Remove the soil|Cut all the leaves',1,'Panel 3 menampilkan alat penyiram dan tetesan air dengan label WATER.'],
 ['Which summary follows the pictured order?','Water → window → soil → bean|Bean → soil → window → water|Soil → bean → water → window|Window → water → bean → soil',2,'Urutan nomor pada gambar adalah tanah, kacang, air, lalu meletakkan pot di dekat jendela.']
 ]);
 scene('hobbies','words','Hobbies','omnas','omnas-hobbies',[
 ['Which club uses a paintbrush as its symbol?','Garden club|Book club|Art club|Chess club',2,'Kuas berada pada kartu ART, yaitu klub seni.'],
 ['You enjoy growing plants. Which meeting should you choose?','Tuesday at 3 p.m.|Thursday at 3 p.m.|Friday at 4 p.m.|Friday at 3 p.m.',1,'Kartu GARDEN menampilkan tanaman dan jadwal Kamis pukul tiga sore.'],
 ['You must leave school by 4 p.m. Which club session finishes too late?','Art club only|Garden club only|Book club only|All three clubs',2,'Setiap sesi berlangsung satu jam. Book club mulai pukul empat, jadi berakhir pukul lima. Dua klub lain selesai pukul empat.']
 ]);
 scene('comic','social','Pragmatic meaning and tone','ruangguru','ruangguru-pragmatics',[
 ['What is the first pupil carrying?','Three books|Two apples|A football|An umbrella',0,'Panel pertama memperlihatkan tiga buku bertumpuk di tangan murid.'],
 ['Why does “Let me help” suit the situation?','The first pupil wants a new shirt|The books make it difficult to open the door|The door is missing|The pupils are asking for the time',1,'Murid pertama membawa buku dengan tangan penuh. Membukakan pintu adalah bantuan yang sesuai.'],
 ['What is “My hands are full!” most likely doing in this context?','Announcing a competition|Indirectly asking for help|Giving directions to the library|Congratulating a winner',1,'Di depan pintu tertutup sambil membawa buku, ucapan itu menyiratkan kebutuhan bantuan tanpa permintaan langsung.']
 ]);
 scene('footprints','logic','Inference & critical thinking','ruangguru','ruangguru-cause',[
 ['Where do the muddy footprints lead?','To the window|To the backpack|To the cat’s mat|To the ceiling',1,'Jejak dari arah pintu berlanjut menuju tas punggung merah.'],
 ['Which explanation is best supported by the scene?','Someone wearing muddy footwear walked from the doorway towards the bag|The window painted itself|The sleeping cat certainly wore the boots|The bag flew through the window',0,'Sepatu berlumpur dekat pintu dan jejak menuju tas mendukung adanya orang yang berjalan dari pintu ke tas.'],
 ['What cannot be established from the picture alone?','A window is closed|A red backpack is present|The exact identity of the person who made the footprints|Boots are near the door',2,'Gambar menyediakan petunjuk benda dan jejak, tetapi tidak memperlihatkan identitas orang yang membuatnya.']
 ]);
 scene('timeline','grammar','Tenses & advanced sentence structure','ruangguru','ruangguru-tenses',[
 ['What did Lina begin doing at 2 p.m. yesterday?','Reading|Swimming|Cooking|Cycling',0,'Buku, label START, dan garis durasi menunjukkan Lina mulai membaca pada pukul dua.'],
 ['Complete the sentence using the timeline: “When the phone rang, Lina ___.”','was reading|will read|has read tomorrow|read every Monday',0,'Telepon berbunyi di tengah rentang membaca pukul dua sampai empat. Past continuous was reading menyatakan kegiatan yang sedang berlangsung.'],
 ['Which sentence accurately describes the order of events?','Lina had finished reading before the phone rang|The phone rang before Lina started reading|Lina had started reading before the phone rang, and she finished later|Lina started reading after 4 p.m.',2,'Lina mulai pukul dua, telepon berbunyi pukul tiga, lalu membaca selesai pukul empat.']
 ]);
 scene('weather','reading','Reading pictures','stemco','stemco-pictures',[
 ['Which day has the rain symbol?','Monday|Tuesday|Wednesday|Every day',1,'Simbol awan dengan tetesan air muncul pada kartu TUE.'],
 ['Which statement compares the temperatures correctly?','Tuesday is warmer than Monday|Wednesday is cooler than Tuesday|Monday is warmer than Wednesday|All three days have the same temperature',2,'Senin 28°C dan Rabu 24°C, sehingga Senin diperkirakan lebih hangat.'],
 ['Which conclusion is the most careful interpretation?','Rain on Tuesday is absolutely certain|An outdoor picnic is guaranteed safe on Monday|Tuesday is forecast to be rainy, so checking an updated forecast would help|It can never rain on Wednesday',2,'Gambar adalah prakiraan yang dapat berubah, bukan kepastian. Memeriksa pembaruan merupakan tindakan yang sesuai.']
 ]);
 scene('animals','words','Complex vocabulary in context','stemco','stemco-complex-words',[
 ['Which animal has feathers according to its card?','The rabbit|The butterfly|The owl|All three animals',2,'Label Feathers · eggs terletak di bawah burung hantu.'],
 ['A mammal feeds milk to its young. Which pictured animal fits that description?','The owl|The butterfly|The rabbit|None of them',2,'Kartu rabbit mencantumkan fur dan milk. Memberi susu kepada anak adalah ciri mamalia.'],
 ['Which claim is disproved by the information cards?','A rabbit has fur|An owl lays eggs|Every animal with wings has feathers|A butterfly has six legs',2,'Kupu-kupu memiliki sayap tetapi bukan bulu burung. Sayap tidak selalu berarti hewan memiliki feathers.']
 ]);
 scene('family','social','Family tree',null,null,[
 ['Who is Maya’s father?','Omar|Danu|Beni|Rina',1,'Garis turun menghubungkan Danu sebagai orang tua Maya; deskripsi pohon menyatakan Danu ayahnya.'],
 ['How is Rina related to Maya?','Her sister|Her grandmother|Her aunt|Her daughter',2,'Rina adalah saudara Danu, ayah Maya. Jadi Rina adalah bibi Maya.'],
 ['Which statement about Maya and Beni is correct?','They are siblings|They are cousins who share grandparents|Beni is Maya’s uncle|Maya is Beni’s grandmother',1,'Orang tua mereka, Danu dan Rina, bersaudara. Maya dan Beni sepupu dan memiliki kakek-nenek yang sama.']
 ]);
})();
