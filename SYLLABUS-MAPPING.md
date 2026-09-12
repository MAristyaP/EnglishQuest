# Pemetaan dokumen silabus EnglishQuest

Studio Interaktif menambahkan 30 aktivitas (dengan bentuk pilihan ganda untuk paket biasa) dan 24 kuis kosakata. Total aplikasi setelah pembaruan ini **437 soal**. Pemetaan event di bawah tetap menjadi catatan impor sumber awal; seluruh materi tambahan memakai topik bahasa Inggris yang sama.

Pembaruan Picture Quest menambahkan 36 soal bergambar di atas impor awal yang dicatat di bawah. Total setelah pembaruan Picture Quest menjadi **383 soal**. Stok per event menjadi KOMPERASIA 45, OMNAS 45, RUANGGURU 48, STEMCO 48; tiga soal gambar pohon keluarga masuk silabus umum. Sebanyak 153 soal impor awal tetap dipertahankan.

Sumber lokal dibaca secara visual pada 11 September 2026. Semua lima gambar dalam `D:\Silabus` telah diperiksa. Dokumen tersebut menjadi acuan cakupan; soal di aplikasi ditulis sendiri, bukan salinan contoh resmi. Level Explorer–Champion adalah jenjang internal aplikasi.

| Event / sumber | Materi pada gambar → submateri di aplikasi | Soal baru |
| --- | --- | ---: |
| KOMPERASIA.PNG — Kelas 6 SD/MI | Announcement; describing people; synonym and antonym; advertisement; tenses past tense → Simple past tense; passive past tense | 36 (12 per tingkat) |
| OMNAS.PNG — Bahasa Inggris Level 4 | Describing places (My School and My House); hobbies; expressions of congratulating and complimenting; procedural texts; present perfect tense; informal letters and messages | 36 (12 per tingkat) |
| RUANGGURU.PNG — A: Words & Structure Knowledge | Vocabulary in context; tenses & advanced sentence structure; conjunctions; synonym and antonym; relative clauses | 15 |
| RUANGGURU.PNG — B: Reading | Finding main idea; idiomatic phrases; cause and effect; figurative language | 12 |
| RUANGGURU.PNG — C: Spoken & Written Expression | Pragmatic meaning and tone dalam respons percakapan kontekstual | 3 |
| RUANGGURU.PNG — D: Higher-Order Thinking Skills | Sentence unscrambling; idiomatic prepositions; multiple-error analysis | 9 |
| STEMCO.PNG — Reading | Multiple texts and sustained reading; reading pictures; longer sentence comprehension | 9 |
| STEMCO.PNG — Writing | Spelling; recognition of cursive writing | 6 |
| STEMCO.PNG — Grammar | Tenses; prepositions of place and time; nouns and proper nouns; pronoun | 12 |
| STEMCO.PNG — Punctuation | Commas, full stops, question and exclamation marks → Commas and sentence punctuation; speeches in more complex sentences → Direct speech punctuation | 6 |
| STEMCO.PNG — Vocabulary | Complex vocabulary in context | 3 |
| STEMCO1.PNG — dua contoh, English 2026 Syllabus v1.0 | Subjek dengan together with → Subject–verb agreement; put … off → Phrasal verbs | 6 |

**Total:** 153 soal baru, 39 kelompok submateri, 51 soal baru per tingkat. Total aplikasi menjadi 347 soal termasuk 12 listening. Soal lama (194) tetap tersedia, dan ID maupun kuncinya tidak diubah.

## Akses belajar

- Semua soal baru berada di `QUESTIONS` sebelum aplikasi dan profil dimuat, sehingga ikut daily adaptif utama, latihan per tingkat, ujian gabungan, buku pengulangan, dan dukungan Sesi Siswa.
- Kartu event memakai bank yang dipetakan langsung ke event tersebut. Daily 5, latihan campuran 25 (terbuka hari ke-3), ujian gabungan 30 (hari ke-7).
- Bekal per submateri berisi ringkasan konsep/petunjuk dan paket 3–5 soal tanpa syarat hari.
- Setiap submateri memiliki Explorer, Challenger, dan Champion. KOMPERASIA/OMNAS memiliki dua soal per tingkat per submateri; RUANGGURU/STEMCO satu. Stok dapat diperluas dengan ID baru.
- Dashboard menghitung cakupan sebagai jumlah soal berbeda yang pernah dicoba, serta akurasi semua percobaan. Hasil itu tidak dinyatakan sebagai sertifikasi penguasaan atau kesiapan resmi olimpiade.

## Catatan interpretasi sumber

- Tulisan `Mys School` pada gambar OMNAS dipahami sebagai `My School` berdasarkan konteks.
- Baris `Others …` pada STEMCO tidak menyebut cakupan spesifik; tidak ditambahkan materi rekaan atas nama baris tersebut.
- Contoh pada STEMCO1 menjadi acuan jenis keterampilan. Pertanyaan dan konteks baru dibuat berbeda dari contoh di gambar.
- Reading memakai bacaan asli, termasuk dua teks terkait sepanjang lebih dari 200 kata dan peta yang dapat diperbesar mengikuti layar.
- Cursive writing memakai tiga gambar lokal kata dalam tulisan sambung. Ini latihan pengenalan bentuk tulisan, bukan penilaian kemampuan menulis tangan. Berkas SVG berisi bentuk huruf sebagai path, sehingga tidak bergantung pada font yang terpasang di perangkat siswa.
- Diagram peta memiliki deskripsi aksesibel. Tulisan sambung adalah stimulus visual; pembahasan setelah menjawab menyebut ejaan kata tersebut.

## Pemeriksaan

`node verify-v5.cjs` memeriksa bank, cakupan tiga tingkat, ID lama, pembagian event, syarat hari, jumlah/keunikan soal, ujian setelah reload, hasil, dan cadangan. `python check_browser.py` menjalankan pengujian interaksi versi 2–5, termasuk tombol, ponsel, gambar, dan laporan perkembangan.
