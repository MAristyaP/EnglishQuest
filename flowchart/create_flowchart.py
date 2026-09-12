from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math

OUT = Path(__file__).resolve().parent
W, H = 2400, 3260
im = Image.new('RGB', (W, H), '#f3f0ff')
d = ImageDraw.Draw(im)
INK = '#262344'
PURPLE = '#7050c7'
FONT = 'C:/Windows/Fonts/arial.ttf'
BOLD = 'C:/Windows/Fonts/arialbd.ttf'

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)

def wrapped(text, width, size, bold=False):
    f = font(size, bold)
    lines = []
    for para in text.split('\n'):
        line = ''
        for word in para.split():
            trial = (line + ' ' + word).strip()
            if d.textlength(trial, font=f) > width and line:
                lines.append(line)
                line = word
            else:
                line = trial
        lines.append(line)
    return lines

def text(x, y, value, width, size=30, color=INK, bold=False, center=False):
    lines = wrapped(value, width, size, bold)
    for line in lines:
        xx = x + (width-d.textlength(line, font=font(size,bold)))/2 if center else x
        d.text((xx,y), line, font=font(size,bold), fill=color)
        y += int(size*1.3)
    return y

def box(rect, title, body='', fill='#ffffff', accent=PURPLE, title_size=34, body_size=29):
    x,y,x2,y2=rect
    d.rounded_rectangle((x+3,y+6,x2+3,y2+6), radius=25, fill='#e2dcf0')
    d.rounded_rectangle(rect, radius=25, fill=fill, outline=accent, width=3)
    yy=text(x+26,y+20,title,x2-x-52,title_size,accent,True,True)
    if body:
        yy=text(x+28,yy+12,body,x2-x-56,body_size,center=True)
    assert yy <= y2-8, (title, yy, y2)

def arrow(points, color='#807497', width=5):
    d.line(points, fill=color, width=width, joint='curve')
    x,y=points[-1]; px,py=points[-2]
    a=math.atan2(y-py,x-px)
    head=[(x,y),(x-17*math.cos(a-.5),y-17*math.sin(a-.5)),(x-17*math.cos(a+.5),y-17*math.sin(a+.5))]
    d.polygon(head,fill=color)

def label(x,y,s,width=260):
    text(x,y,s,width,26,PURPLE,True,True)

def decision(cx,cy,hw,hh,title):
    d.polygon([(cx,cy-hh),(cx+hw,cy),(cx,cy+hh),(cx-hw,cy)],fill='#fff1c9',outline='#d69829',width=3)
    lines=wrapped(title,hw*1.35,29,True)
    text(cx-hw*.675,cy-len(lines)*19,title,hw*1.35,29,INK,True,True)

d.rounded_rectangle((55,45,2345,235),radius=34,fill='#52328d')
text(100,72,'EnglishQuest',2200,66,'#ffffff',True)
text(103,159,'FLOWCHART WEBSITE • Profil → belajar → evaluasi → perkembangan',2200,32,'#e6dcff')

box((750,285,1650,415),'Buka website → muat profil siswa','Profil aktif dan riwayat dibaca dari penyimpanan lokal.', '#e8ddff')
arrow([(1200,415),(1200,455)])
box((750,455,1650,580),'Beranda / navigasi utama','Pilih kegiatan, lihat target, atau lanjutkan sesi tersimpan.')
box((70,300,630,555),'Profil & cadangan','Buat / ganti profil siswa.\nEkspor cadangan JSON atau impor kembali.\nData tiap profil terpisah.','#e2f5f0','#267767',32,28)
arrow([(750,490),(630,490)])
box((1770,300,2330,555),'Ada sesi belum selesai?','Lanjutkan soal tersimpan, atau akhiri sesi sebelum memulai kuis baru.\nJawaban yang sudah dikerjakan tetap tercatat.','#fff0d9','#9a611e',32,28)
arrow([(1650,490),(1770,490)])

text(75,625,'01  PILIH JALUR BELAJAR',2250,37,PURPLE,True)
arrow([(1200,580),(1200,608)])
cards=[
 ((70,695,610,1045),'Daily & jelajahi misi','Daily adaptif, misi topik / level, Picture Quest, Peta Cerita, dan ulasan di Buku Belajarku.\nSilabus belajar: KOMPERASIA, OMNAS, RUANGGURU, STEMCO.','#e9e2ff',PURPLE),
 ((640,695,1180,1045),'Latihan & ujian','Latihan: ≥ 3 hari belajar, 25 soal per level.\nUjian: ≥ 7 hari belajar, 30 soal gabungan.\nEvent: latihan 25 campuran; ujian 30 campuran.','#fff0d9','#9a611e'),
 ((1210,695,1750,1045),'Studio interaktif','Susun Kalimat • Cari Bukti\nBengkel Kalimat\nPercakapan Bercabang\nPilih jenis & level atau Daily Interaktif berisi 5 aktivitas.','#dff3ed','#267767'),
 ((1780,695,2330,1045),'Listening & kamus','Listening: dengarkan audio dan jawab soal.\nKamus Petualang: simpan kata, pelajari arti / contoh, lalu mulai kuis kosakata.','#e2efff','#3468a0')
]
for args in cards: box(*args,title_size=32,body_size=29)
for cx in (340,910,1480,2055):
    arrow([(cx,665),(cx,695)])
d.line([(340,665),(2055,665)],fill='#807497',width=5)

decision(910,1175,265,90,'Syarat hari sudah cukup?')
arrow([(910,1045),(910,1085)])
box((70,1105,560,1250),'Belum terbuka','Kerjakan daily / misi, lalu kembali.', '#fff0d9','#9a611e',30,27)
arrow([(645,1175),(560,1175)])
label(557,1122,'Belum',90)
arrow([(910,1265),(910,1320),(1200,1320),(1200,1390)])
label(920,1270,'Sudah',150)
arrow([(340,1045),(340,1070),(605,1070),(605,1350),(1080,1350),(1080,1390)])
arrow([(1480,1045),(1480,1070),(1190,1070),(1190,1350),(1320,1350),(1320,1390)])
arrow([(2055,1045),(2055,1070),(2340,1070),(2340,1320),(1420,1320),(1420,1390)])
text(1210,1100,'Hari belajar = tanggal berbeda saat siswa menjawab soal, tidak harus berturut-turut.',1070,29,'#695b7b')
text(1210,1190,'Pilihan level: Explorer • Challenger • Champion',1070,29,PURPLE,True)

text(75,1390,'02  SESI SOAL',590,37,PURPLE,True)
box((750,1390,1650,1565),'Mulai / lanjutkan sesi soal','Baca teks, amati gambar, dengarkan audio, atau kerjakan aktivitas interaktif.','#e9e2ff')
arrow([(1200,1565),(1200,1605)])
box((750,1605,1650,1775),'Jawab → simpan hasil tiap soal','Catat jawaban, benar / salah, dan XP.\nDraf aktivitas & posisi sesi disimpan agar bisa dilanjutkan.')
arrow([(1200,1775),(1200,1815)])
decision(1200,1900,230,85,'Mode ujian?')
box((70,1815,700,1985),'Daily / latihan / kuis','Tampilkan benar / salah dan pembahasan segera. Bantuan tersedia sesuai mode.','#dff3ed','#267767',32,29)
box((1700,1815,2330,1985),'Ujian','Tampilkan “Jawaban tersimpan”. Kunci dan pembahasan muncul setelah ujian selesai.','#fff0d9','#9a611e',32,29)
arrow([(970,1900),(700,1900)]); label(738,1850,'Bukan',170)
arrow([(1430,1900),(1700,1900)]); label(1465,1850,'Ya',170)
arrow([(385,1985),(385,2045),(1020,2045),(1020,2130)])
arrow([(2015,1985),(2015,2045),(1380,2045),(1380,2130)])
decision(1200,2130,250,85,'Masih ada soal?')
arrow([(950,2130),(725,2130),(725,1470),(750,1470)])
label(730,2075,'Ya → soal berikutnya',270)
arrow([(1200,2215),(1200,2275)]); label(1215,2220,'Tidak',140)

box((1770,1400,2330,1725),'Belajar tanpa kuis','Flashcard: lihat arti & nilai ingatan sendiri.\nSpeaking: dengarkan, rekam, lalu catat latihan.\nCatatan tersimpan tanpa skor kuis; audio perlu diunduh.','#e2efff','#3468a0',31,28)
text(1795,1740,'Akses langsung dari kamus / listening & speaking.',510,26,'#695b7b',False,True)
box((70,1470,580,1740),'Bisa berhenti sementara','Keluar halaman / tutup website → sesi tersimpan.\nBuka kembali dengan profil yang sama → lanjutkan sesi.','#e2efff','#3468a0',31,29)

text(75,2280,'03  EVALUASI',590,37,PURPLE,True)
box((750,2275,1650,2445),'Hasil sesi & pembahasan','Lihat skor, XP, jawaban, penjelasan, dan rincian kemampuan. Riwayat sesi dicatat.','#e9e2ff')
arrow([(1200,2445),(1200,2485)])
decision(1200,2570,250,85,'Isi Sesi Siswa?')
box((70,2480,820,2685),'Survei kesulitan (opsional)','Pilih perasaan, bagian yang sulit, dan bantuan; boleh tambah curhatan. Tekan Simpan untuk mencatat.','#ffe4ec','#aa4263',32,29)
arrow([(950,2570),(820,2570)]); label(824,2520,'Ya',120)
box((70,2740,820,2915),'Tindak lanjut sesuai kebutuhan','Contoh / langkah, latihan terarah, atau istirahat. Cek kembali kesulitan setelah 3 hari.','#ffe4ec','#aa4263',32,29)
arrow([(445,2685),(445,2740)])
arrow([(1200,2655),(1200,2740)]); label(1210,2680,'Lewati',150)
box((930,2740,1710,2935),'Perkembanganku & Ruang orang tua','Grafik harian, akurasi, XP, topik yang sulit, riwayat sesi, serta laporan kesulitan siswa.','#dff3ed','#267767',31,29)
arrow([(820,2830),(930,2830)])
box((1790,2480,2330,2935),'Penyimpanan lokal','Riwayat dan progres tersimpan per profil di browser / perangkat yang digunakan.\nTutup website tidak menghapus riwayat.\nCadangkan lewat JSON; belum ada sinkronisasi cloud.\nFlashcard & speaking juga masuk catatan terkait.','#e2efff','#3468a0',32,29)
arrow([(1710,2830),(1790,2830)])
arrow([(1320,2935),(1320,2975)])
box((930,2975,1710,3100),'Kembali ke Beranda','Lanjutkan rencana belajar berikutnya.','#e9e2ff',PURPLE,32,28)

d.line([(70,3140),(2330,3140)],fill='#d1c5e6',width=2)
text(75,3170,'Petunjuk: kotak = aktivitas   •   belah ketupat = keputusan   •   panah = arah alur',2250,27,'#695b7b',False,True)
im.save(OUT/'EnglishQuest-Alur-Website.png',dpi=(200,200),optimize=True)
print(f'Saved {OUT / "EnglishQuest-Alur-Website.png"} | {W} x {H} px')



