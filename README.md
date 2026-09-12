# English Quest — Studio Interaktif & Kamus Petualang

Website latihan bahasa Inggris untuk kelas 6 SD. Klik dua kali **MULAI_GAME.cmd**, lalu gunakan http://127.0.0.1:8765/index.html. Biarkan server lokal berjalan selama bermain. Setelah pembaruan, tekan **Ctrl + F5**.

## Belajar dan bermain
- **437 soal**: 425 soal utama dan 12 soal listening. Tingkat keseluruhan: 142 Explorer, 157 Challenger, 138 Champion.
- Filter tingkat dan pencarian subtopik langsung mengubah kartu, jumlah soal, dan isi misi.
- Tantangan harian berisi 5 soal adaptif. Tombol Misi adaptif menyediakan 8 soal, dengan pengulangan yang jatuh tempo, subtopik yang perlu dikuatkan, serta latihan pemeliharaan.
- Pemilihan adaptif menggunakan riwayat lokal, bukan layanan AI online. Pemula mulai dari Explorer. Riwayat tanpa petunjuk digunakan untuk menentukan kesulitan.
- Setelah 3 tanggal belajar berbeda: latihan 25 soal per tingkat. Setelah 7 tanggal: ujian 30 soal, 10 per tingkat. Tidak harus berturut-turut.
- Jawaban benar memperoleh 20 XP, jawaban salah 5 XP, termasuk pengulangan. Satu level per 200 XP.
- Sesi soal otomatis tersimpan. Pilih Lanjutkan untuk meneruskan, atau Akhiri sesi ini untuk memulai paket lain. Jawaban yang sudah diberikan tetap tercatat.

## Silabus event: KOMPERASIA, OMNAS, RUANGGURU, STEMCO
- Lima gambar dari `D:\Silabus` dipetakan menjadi **39 submateri** dengan **153 soal baru**: KOMPERASIA 36, OMNAS 36, RUANGGURU 39, STEMCO 42. Semua submateri memiliki tiga tingkat dan pembahasan bahasa Indonesia.
- Buka **Silabus belajar**, atau tombol **Pilih event olimpiade** di Jelajahi misi. Setiap event memiliki kartu dan bekal per submateri yang dapat dibuka. Pencarian misi juga menerima nama event.
- Materi baru otomatis tersedia dalam daily adaptif, misi biasa, latihan utama 25 soal per tingkat, dan ujian utama. Materi lama tetap tersedia dengan ID yang sama agar riwayat tidak berubah.
- Paket fokus event: **daily adaptif 5 soal** tanpa syarat; **latihan campuran 25 soal** setelah 3 tanggal belajar (9 Explorer, 8 Challenger, 8 Champion); **ujian 30 soal** setelah 7 tanggal (10 setiap tingkat). Hari tidak harus berurutan. Paket utama per tingkat tetap 25 soal.
- Bekal submateri dapat dicoba kapan saja dalam paket 3–5 soal. Pemilihan paket event menjaga variasi submateri dan mengutamakan soal yang lebih jarang dicoba.
- Ujian event menyembunyikan jawaban, pembahasan, dan petunjuk sampai selesai, termasuk setelah tutup/buka atau pemulihan cadangan. Hasil, XP, sesi aktif, dan Sesi Siswa memakai sistem penyimpanan profil yang sama.
- STEMCO mencakup bacaan gabungan panjang, peta SVG, dan gambar tulisan sambung. Aset tersedia lokal, tanpa unduhan font saat bermain. Pengenalan tulisan sambung belum berupa latihan menulis tangan.
- Perkembanganku dan Ruang orang tua menampilkan cakupan soal dan akurasi per event. Cakupan bukan klaim penguasaan. Soal event tetap terhitung ketika dikerjakan dalam paket utama.
- Soal merupakan latihan orisinal berdasarkan cakupan gambar, **bukan soal resmi atau jaminan format ujian penyelenggara**. `Others …` pada STEMCO tidak dirinci oleh sumber. Rincian pemetaan ada di [SYLLABUS-MAPPING.md](SYLLABUS-MAPPING.md).
- Bank tambahan: `event-questions.js`; pemilihan paket, visual, dan tampilan: `event-quest.js`; gaya: `event.css`. Untuk perluasan, gunakan ID event/konsep yang stabil dan jangan mengubah ID soal yang telah dimainkan.

## Picture Quest — soal bergambar
- 36 soal tambahan dengan 12 ilustrasi SVG lokal: poster acara, kios buah, tokoh, denah rumah, prosedur menanam, klub hobi, komik, jejak berlumpur, garis waktu, cuaca, kartu hewan, dan pohon keluarga. Setiap ilustrasi memiliki satu soal setiap tingkat.
- **Main bergambar** tersedia di Beranda dan Jelajahi misi: 5 soal campuran atau pilihan Explorer, Challenger, Champion.
- Gambar adalah petunjuk soal, disertai deskripsi aksesibel. Tombol **Perbesar gambar** membuka dialog; tutup melalui tombol atau Escape. Pada ponsel gambar besar bisa digeser di dalam dialog. Gambar juga muncul dalam pembahasan hasil.
- Daily adaptif menyisipkan hingga dua soal visual bila ada kandidat yang cocok dengan topik dan tingkat. Pengulangan jatuh tempo dan dukungan survei tidak diganti. Paket utama dan event juga mendapat variasi visual dari bank yang sesuai.
- 33 soal dipetakan ke event (KOMPERASIA +9, OMNAS +9, RUANGGURU +9, STEMCO +6), tiga soal pohon keluarga masuk silabus umum. Stok event sekarang 45 / 45 / 48 / 48; 153 soal event awal tetap dipertahankan.
- Aset berupa SVG di `picture-quest.js`, bank tambahan di `picture-questions.js`. Tidak perlu koneksi internet untuk memuat gambar. Progres memakai penyimpanan profil yang sama.

## Studio interaktif — lima fitur baru
- **Susun Kalimat:** 9 tantangan (3 per tingkat), ketuk potongan untuk menyusun; ketuk potongan terpilih untuk membatalkan atau gunakan Susun ulang. Draf urutan dan posisi potongan tersimpan.
- **Cari Bukti:** 9 tantangan; pilih jawaban lalu kalimat pendukung. Pembahasan dan dashboard membedakan ketepatan jawaban dan bukti. Tantangan mendapat 20 XP jika keduanya benar, 5 XP jika salah satu belum tepat.
- **Bengkel Kalimat:** 9 tantangan; pilih bagian yang salah dan penggantinya. Pratinjau kalimat tampil sebelum diperiksa. Kedua pilihan harus tepat untuk nilai benar.
- **Percakapan Bercabang:** 3 skenario, satu per tingkat: perpustakaan, teman setelah lomba, dan rencana pameran. Respons mengubah balasan dan jalur; beberapa respons memunculkan kesempatan memperbaiki ucapan. Hasil menyimpan urutan dialog. Nilai benar membutuhkan semua pilihan respons tepat; memperbaiki ucapan tidak menghapus pilihan pertama. Pilihan keyakinan dikunci sejak respons pertama, termasuk setelah reload.
- **Kamus Petualang:** 24 kata kurasi dengan arti, contoh, dan ilustrasi konteks pada kata yang sesuai. Simpan atau lepas kata, cari kata/arti, dan filter kata tersimpan. Kata yang cocok dengan soal dapat disimpan langsung; membuka arti sebelum menjawab dihitung sebagai bantuan. Bantuan kata tidak muncul saat ujian.
- Kamus menerima hingga 200 catatan pribadi: kata, arti, contoh opsional, dan pilihan ilustrasi konteks. Catatan ditampilkan sebagai catatan siswa, bukan arti yang diverifikasi otomatis. Semua teks di-escape saat ditampilkan.
- **Kuis kata tersimpan** memakai hingga 5 kata kurasi yang disimpan. **Kartu ingatan** mendukung semua kata, termasuk catatan pribadi; pilih Masih belajar / Sudah ingat setelah membuka arti. Kartu ingatan adalah penilaian diri, tidak menambah XP atau akurasi soal.
- Jeda ingatan: jawaban benar tanpa bantuan pada hari berbeda menjadwalkan 1, 3, 7, lalu 14 hari; salah kembali besok. Pengulangan pada hari yang sama tidak menaikkan tahap. Riwayat kuis dan penilaian diri dibedakan.
- **Daily interaktif** berisi 5 tantangan dengan keempat jenis aktivitas; slot kelima dapat memakai kata tersimpan yang jatuh tempo pada tingkat yang sama. Daily Campuran dimulai dari Explorer. Latihan khusus menyediakan 3 tantangan pada satu tingkat, hingga 5 campuran; dialog satu skenario per sesi.
- Sesi aktif, draf, jawaban, XP, grafik harian, hitungan hari belajar, survei Sesi Siswa, dan cadangan memakai sistem profil yang sama. Laporan interaktif tersedia di Studio, Perkembanganku, dan Ruang orang tua.
- Ada 54 soal tambahan: 30 aktivitas dan 24 kuis kata. Bentuk interaktif hanya aktif pada paket Studio/daily interaktif; paket standar dan ujian memakai bentuk pilihan ganda dari materi yang sama. Jawaban ujian tetap disembunyikan sampai selesai.
- Implementasi: `interactive-content.js`, `interactive-model.js`, `interactive-ui.js`, `interactive.css`. Pemeriksaan tambahan: `verify-v7.cjs` dan `verify-v7-browser.html`.

## Peta cerita
Enam dunia dengan 18 bab dan enam pusaka. Bab pertama setiap dunia langsung tersedia. Bab berikutnya terbuka setelah minimal 3 dari 5 soal benar pada bab sebelumnya. Bab dapat dicoba lagi tanpa kehilangan nyawa. Pusaka diperoleh setelah bab Champion suatu dunia diselesaikan dengan nilai minimal 60%.

## Sesi Siswa — Cerita Belajarku
- Survei opsional muncul setelah daily, latihan, cerita, listening, dan ujian selesai. Survei dapat dilewati, kemudian dibuka kembali lewat menu Sesi siswa.
- Tiga pertanyaan: perasaan, bagian yang sulit (bisa lebih dari satu), dan bantuan yang diinginkan. Cerita bebas opsional, maksimal 1.500 karakter. Jawaban tersimpan setelah menekan Simpan; draf yang belum disimpan tidak dipulihkan otomatis.
- Pilihan Tidak ada kesulitan tidak dapat digabungkan dengan kesulitan lain. Formulir menjelaskan bahwa survei dan cerita bisa dilihat orang tua pada profil yang sama.
- Setiap survei terhubung ke paket, tanggal, soal, topik, tingkat, serta hasil sesi. Cerita bebas ditampilkan apa adanya; sistem tidak mengklasifikasikan atau mendiagnosis isi cerita otomatis.
- Sebelum menjawab, siswa boleh memilih Yakin atau Masih menebak. Pilihan terkunci setelah jawaban diberikan. Penanda Aku bingung di sini dapat diubah sebelum atau sesudah menjawab, dan tersimpan bersama sesi.
- Keyakinan, tanda bingung, pengisian survei, dan melewati survei tidak mengubah nilai maupun XP. Saat ujian, tanda tidak membuka pembahasan.
- Contoh lebih sederhana atau Penjelasan bertahap menampilkan contoh singkat dan hingga 3 soal; Latihan tambahan menyediakan hingga 5 soal. Jika memilih istirahat atau belum perlu bantuan, tidak ada paket tambahan yang dimulai otomatis.
- Pilihan kesulitan akademik dari 7 hari terakhir dapat menyisipkan hingga 2 soal terarah ke misi adaptif. Pilihan istirahat/belum perlu bantuan tidak dipakai untuk penyesuaian ini. Pengulangan yang jatuh tempo tetap dipertahankan.
- Setelah 3 hari, cerita yang memerlukan tindak lanjut mendapat pengecekan Lebih mudah / Masih sama / Masih perlu bantuan. Lebih mudah menutup pengecekan; dua pilihan lainnya menjadwalkan pengecekan lagi 3 hari kemudian.
- Ruang orang tua membedakan Yang anak rasakan dan Hasil sesi yang tercatat, termasuk jawaban benar sambil menebak, jawaban salah meski yakin, serta tanda bingung.
- Survei, tanda soal, dan pengecekan ulang disimpan per profil dan masuk cadangan JSON. Cadangan lama tanpa data survei tetap dapat dipulihkan.

## Petunjuk dan buku belajar
- Petunjuk tersedia sebelum menjawab, kecuali dalam ujian. Bantuan tidak mengurangi XP; jawaban ditandai sebagai dibantu untuk ringkasan kemampuan.
- Transkrip listening yang dibuka sebelum menjawab juga dihitung sebagai bantuan.
- Perbandingan opsi menyertakan alasan khusus pada sejumlah soal dan penjelasan konsep soal pada soal lainnya.
- Setelah jawaban salah, soal masuk Buku belajarku dan dijadwalkan besok.
- Jawaban benar tanpa bantuan pada tanggal berikutnya memperpanjang jeda menjadi 3, 7, 14, lalu 30 hari.
- Jawaban berulang di hari yang sama atau jawaban dengan petunjuk tidak menaikkan tahap. Salah lagi mengembalikan jadwal ke besok.

## Listening dan speaking
Listening memakai suara English yang tersedia di browser/perangkat. Pilih suara dan kecepatan pada halaman Listening & speaking. Ada transkrip jika audio tidak tersedia.

Speaking menyediakan enam contoh percakapan. Tekan Rekam dan berikan izin mikrofon browser. Rekaman berhenti otomatis setelah 60 detik atau saat menekan Selesai. Putar ulang dan unduh jika ingin menyimpannya. Rekaman tidak diunggah, tidak disimpan di localStorage, dan tidak dimasukkan ke cadangan JSON. Menutup halaman studio membuang rekaman sementara. Tombol Catat latihan menyimpan tanggal, prompt, dan durasi; tidak ada penilaian pengucapan otomatis.

Implementasi menggunakan [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), dan [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder). Ketersediaan suara dan izin mikrofon bergantung pada browser/perangkat.

## Dashboard anak dan orang tua
Dashboard anak mencatat aktivitas harian, XP, akurasi, waktu latihan soal, serta hasil paket selesai. Waktu latihan soal dihitung saat halaman terlihat, maksimal 10 menit per soal.

Ruang orang tua memuat perbandingan dua minggu, ringkasan per dunia dan subtopik, penggunaan bantuan, serta tiga kegiatan pendampingan. Perbandingan membutuhkan minimal lima jawaban di tiap periode. Ringkasan kemampuan memakai hingga 12 jawaban tanpa petunjuk per dunia dan delapan per subtopik. Komposisi soal bisa berbeda; hasil ini bukan penilaian resmi kemampuan anak.

## Profil dan cadangan
Profil pertama memakai kunci progres lama `english-quest-v1`; hasil lama tidak dihapus. Profil tambahan memiliki penyimpanan terpisah. Maksimal 20 profil. Gunakan nama panggilan, tanpa email.

Pada **Profil & cadangan**:
1. Unduh cadangan semua profil sebagai JSON.
2. Simpan file tersebut di lokasi pilihan Anda.
3. Pada browser/perangkat tujuan, buka EnglishQuest lalu pilih Pulihkan cadangan JSON.
4. Pilih Gunakan profil pada salinan hasil pemulihan.

Pemulihan menambahkan profil baru, tanpa menimpa profil yang sudah ada. Cadangan mencakup jawaban, hasil paket, sesi aktif, progres cerita, log speaking, survei siswa, keyakinan, tanda bingung, dan pengecekan ulang. Jadwal ulang dihitung kembali dari jawaban. File maksimal 10 MB. CSV tetap tersedia sebagai laporan jawaban, tetapi pemulihan menggunakan JSON.

**Belum ada sinkronisasi cloud otomatis atau akun online.** Gunakan browser, profil browser, dan alamat game yang sama agar progres lokal tetap terbaca. Alamat file langsung dan alamat localhost memiliki penyimpanan terpisah. Menghapus data browser dapat menghapus progres; cadangkan berkala.

## Menambah materi
- `questions.js`: daftar TOPICS dan 62 soal asli.
- `questions-extra.js`: 120 soal tambahan. Tambahkan soal di akhir agar ID lama tidak bergeser.
- `audio-lessons.js`: 12 soal listening dengan ID khusus, serta prompt speaking.
- `option-notes.js`: penjelasan khusus setiap opsi.
- `learning.js`: aturan adaptif, jadwal ulang, dan cerita.
- `profiles.js`: profil serta cadangan.
- `features.js`: halaman cerita, notebook, audio, orang tua, dan profil.
- `student-model.js`: validasi survei, rekomendasi tindak lanjut, dan jadwal pengecekan.
- `student-ui.js` dan `student.css`: halaman Sesi Siswa, penanda soal, formulir survei, serta laporan orang tua.

## Pemeriksaan
Jalankan `node verify-v7.cjs` atau `node verify.cjs` untuk integritas bank soal, paket event, aturan belajar, Sesi Siswa, profil, dan cadangan. `python check_browser.py` memeriksa interaksi nyata di Edge dengan profil pengujian terpisah; server lokal harus aktif. Rekaman diuji menggunakan aliran audio sintetis, bukan mikrofon pengguna. Pemutaran suara diuji dengan pengganti mesin ucapan, bukan penilaian kualitas audio oleh pendengar. Pratinjau Sesi Siswa dan event memakai penyimpanan tiruan sehingga tidak menulis progres pengguna.

Website belum diterbitkan ke internet.
