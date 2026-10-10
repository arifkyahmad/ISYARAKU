# PRD — Isyaraku: Web Belajar Bahasa Isyarat Gamified

**Status:** v0.3 — belum dibaca ulang tim.
**Tanggal revisi:** 11 Oktober 2026
**Konteks:** Hackathon JOINTS UGM 2026 (tema Education/Healthcare)
**Timeline:** submit 15–16 Okt 2026 · pengumuman 23 Okt · Grand Final 1 Nov (FMIPA UGM)
**Aturan dokumen:** requirement yang belum jelas tidak diisi asumsi; ditandai `(→ OQ-n)` dan dikumpulkan di Bagian 11. Keputusan yang masih asumsi tim ditandai **[asumsi]**.

---

## 1. Problem Statement

**Siapa yang dirugikan:** pemula (anak SD dan dewasa) yang ingin belajar bahasa isyarat.

**Masalah:** materi yang tersedia bersifat pasif (video, kamus) tanpa jalur belajar bertahap dan tanpa umpan balik apakah gerakan yang ditiru sudah benar. Pemula tidak tahu salahnya di mana, lalu berhenti.

**Status bukti (jujur):**

| Klaim | Status |
|---|---|
| Pemula bingung mulai dari mana, dan belajar dari video pasif kurang efektif | Pengalaman pribadi (orang dengar) + temuan riset media sosial: beberapa orang ingin belajar tetapi bingung mulai dari mana. Sampel kecil, jumlah dan sumber belum dicatat. |
| Produk yang ada kurang: Hear Me (mirip kamus, tanpa level, tanpa praktik kamera), 1 situs kamera berbasis ASL, "Bisindo AI" (kamera lag saat dicoba) | Riset kompetitor kecil, dicoba di 1 perangkat, belum diverifikasi ulang |
| Anak tuli / komunitas tuli membutuhkan produk ini | **Belum divalidasi.** Kontak komunitas tidak pernah dijawab. Ditangani lewat limitation dan rencana validasi pasca-hackathon (Bagian 10) |

Angka pendukung (disabilitas tunarungu 8%, penutur BISINDO 77%) belum ada sumber → tidak dipakai di PRD/pitch sampai bersumber (→ OQ-13).

---

## 2. Target User + Persona

**Primary:** anak SD kelas 3–4 ke atas. **Secondary:** pengguna dewasa. Semua dianggap pemula. Persona adalah hipotesis, bukan hasil riset.

**Persona A — Anak pembelajar (primary)**
- Profil: 9–10 tahun, kelas 3–4 SD, akses lewat HP/tablet/laptop di rumah atau sekolah.
- Status pendengaran: target mencakup anak tuli maupun anak dengar. Kebutuhan anak tuli belum divalidasi (→ OQ-2).
- Tujuan: belajar isyarat dasar seperti bermain, tahu kapan gerakannya sudah benar.
- Masalah: video/gambar statis membosankan; tidak ada yang mengoreksi; teks panjang sulit dibaca.
- Implikasi produk: teks pendek, umpan balik visual jelas, sesi pendek, ganti perangkat tanpa kehilangan progres.

**Persona B — Pembelajar dewasa pemula (secondary)**
- Profil: remaja akhir/dewasa, orang dengar, termotivasi belajar sendiri.
- Tujuan: belajar mandiri tanpa guru, tahu apakah gerakannya benar.
- Masalah: materi tidak terstruktur, tidak ada umpan balik, sulit konsisten.
- Implikasi produk: jalur level yang jelas, praktik kamera, progres tersimpan.

---

## 3. Goals dan Non-goals

### Goals

| ID | Goal |
|---|---|
| G1 | Pemula belajar sign secara bertahap lewat sistem level; tiap sign dipelajari lewat video → praktik kamera → kuis |
| G2 | Pengguna mendapat umpan balik praktik via kamera dalam 3 tingkat (Tepat / Hampir / Belum ketemu) |
| G3 | Progres tersimpan di akun dan bisa dilanjutkan lintas perangkat |
| G4 | Konten sign benar. **Belum tercapai:** tidak ada validasi komunitas tuli; ditangani sebagai limitation (Bagian 10, → OQ-3) |
| G5 | MVP bisa dibuka juri lewat link publik sebelum 15–16 Okt |

### Non-goals (sengaja tidak dikerjakan)
- Parental dashboard
- Adaptive learning
- Multi-varian regional (sistem isyarat yang dipakai: SIBI)
- Leaderboard
- Achievement kompleks
- Fitur sosial
- Halaman admin / edit konten
- Fitur terjemah dan pengenalan kalimat/gerakan kontinu: produk ini bukan penerjemah
- Training model ML dan dataset eksternal
- Aplikasi native mobile
- Foto profil (ditunda; pakai avatar default)
- Histori tiap percobaan (hanya hasil terakhir per soal yang disimpan)
- Penyimpanan hasil kuis

---

## 4. User Stories

| ID | User story | Fitur |
|---|---|---|
| US-1 | Sebagai pengguna baru, saya ingin mendaftar dan login (email atau Google), supaya progres belajar saya tersimpan. | F1 |
| US-2 | Sebagai pengguna, saya ingin membuka akun yang sama di perangkat lain, supaya bisa lanjut belajar dari level terakhir. | F1 |
| US-3 | Sebagai pembelajar, saya ingin menonton peragaan sebuah sign, mempraktikkannya di depan kamera, lalu mengerjakan kuis tebak arti, supaya saya ingat sebelum lanjut. | F2, F7, F4, F9 |
| US-4 | Sebagai pembelajar, saya ingin melihat bintang di tiap level, supaya tahu seberapa baik penguasaan saya. | F2 |
| US-5 | Sebagai pembelajar, saya ingin menonton peragaan singkat yang berulang, supaya bisa menirunya. | F7 |
| US-6 | Sebagai pembelajar, saya ingin umpan balik Tepat / Hampir / Belum ketemu, supaya tahu seberapa dekat gerakan saya dan tidak sekadar "salah". | F4, F5 |
| US-7 | Sebagai pengguna tanpa kamera atau yang menolak izin kamera, saya ingin tetap bisa melanjutkan level. | F6 |
| US-8 | Sebagai pengguna, saya ingin melihat soal/level yang dilewati tanpa kamera dan perlu direview, supaya bisa mengulanginya. | F6 |
| US-9 | Sebagai pengguna, saya ingin membuka Kamus, memilih alfabet atau angka, melihat video contoh, lalu mempraktikkannya di depan kamera, kapan saja tanpa harus mengikuti level. | F3, F4 |
| US-10 | Sebagai pengguna, saya ingin memilih kategori lalu kata/percakapan dasar konteks sekolah di Kamus, lalu melihat contoh dan mempraktikkannya, supaya bisa belajar sesuai situasi. | F3, F4 |
| US-11 | Sebagai orang tua/guru, saya ingin anak memakai produk lewat browser di HP atau laptop tanpa instal. | F8 |
| US-12 | Sebagai juri, saya ingin membuka produk lewat link publik, supaya bisa mencoba tanpa setup lokal. | F8 |

---

## 5. Daftar Fitur

### MVP

| ID | Fitur |
|---|---|
| F1 | Akun (daftar/login email+password, Google Sign-In, logout) + profil minimal + progres tersimpan lintas perangkat |
| F2 | Level: 2 section berbasis konteks sekolah; alur per soal; aturan selesai, bintang, dan gembok |
| F3 | Kamus: Alfabet (huruf lengkap + angka) dan Percakapan (per kategori) |
| F4 | Modul validasi praktik CV (MediaPipe Hands + jarak Euclidean ke template) |
| F5 | Feedback 3 tingkat dengan threshold sebagai parameter |
| F6 | Fallback mode tanpa kamera + penanda "perlu direview" |
| F7 | Media belajar: video peragaan loop 2–3 detik oleh tim sendiri |
| F8 | Web responsif multi-perangkat, di-deploy ke link publik (HTTPS) |
| F9 | Kuis tebak arti (pilihan ganda, dikonfirmasi tim masuk MVP) |

### v2
- PWA (installable) — nice-to-have
- Foto profil
- Section tambahan di luar 2 section (diperluas ke 3 hanya jika sempat; belum disepakati)
- Penambahan kategori/kata baru setelah MVP

### Nanti
- Parental dashboard, adaptive learning, multi-varian regional, leaderboard, achievement kompleks, fitur sosial, admin/CMS konten, terjemah

---

## 6. Functional Requirements (MVP)

### Lintas fitur
- **NFR-1:** berjalan di browser modern di HP, tablet, dan laptop; layout responsif. Daftar browser/perangkat minimum → OQ-12.
- **NFR-2:** konten belajar (section, level, kamus, kategori, video, template, soal level) disimpan di database Supabase dan dibaca klien lewat API. Tidak ada halaman admin; konten diisi lewat SQL/seed.
- **NFR-3:** kamera hanya berfungsi lewat HTTPS (atau localhost), jadi deploy publik wajib HTTPS.
- **NFR-4:** frame kamera diproses lokal di browser dan tidak dikirim atau disimpan. Data akun anak, batas usia, dan persetujuan orang tua → OQ-10.
- **NFR-5:** data privat per akun (progres, akun) dibatasi Row Level Security berbasis `auth.uid()`. Tabel konten terbuka untuk dibaca.

### F1 — Akun & Progres
- **FR-1.1:** pengguna bisa daftar (nama lengkap, email, password, konfirmasi password), login email+password, login Google, dan logout. Akun tamu tidak ada.
- **FR-1.2:** verifikasi email dimatikan; pengguna bisa langsung login setelah daftar.
- **FR-1.3:** baris akun dibuat otomatis oleh trigger database untuk kedua jalur daftar. Nama diambil dari form, atau dari Google, atau fallback "Pengguna".
- **FR-1.4:** progres disimpan di server per akun dan terbaca di perangkat lain setelah login.
- **FR-1.5:** profil menampilkan nama akun, avatar default, dan ringkasan progres (level selesai, soal perlu direview, total poin).
- **FR-1.6:** Kamus hanya bisa dibuka setelah login (penjagaan di FE; data konten tetap terbuka secara teknis lewat API, lihat NFR-5). Lupa password tidak masuk MVP awal; dikerjakan di akhir jika waktu tersisa → OQ-11.
- **Catatan:** login Google berstatus Testing (test users manual); publish production menunggu domain publik dan halaman privacy policy (→ OQ-15).

### F2 — Level
- **FR-2.1:** ada 2 section: Section 1 "Huruf" (tema "Abjad jari") memuat level "Huruf A-C" (soal: A, B, C), dan Section 2 "Angka" (tema "Angka") memuat level "Angka 1-3" (soal: 1, 2, 3). Tema lokasi/situasi sekolah dan Perkenalan dibuang dari Level. Level tambahan (Huruf D-F, Angka 4-5) belum ada di SQL seed repo (`isyaraku_level.sql`).
- **FR-2.2 (alur per soal):** video contoh peragaan → praktik mandiri dengan CV → kuis tebak arti (F9).
- **FR-2.3 (aturan selesai):** level selesai jika semua soal di level itu sudah dikerjakan, apa pun hasilnya.
- **FR-2.4 (aturan gembok):** level terbuka jika level sebelumnya selesai. Section 2 terbuka jika semua level section 1 selesai. Status level yang ditampilkan: terkunci / berjalan / selesai. Status diturunkan dari data progres, tidak disimpan.
- **FR-2.5 (bintang 0–3):**

| Kondisi level | Bintang |
|---|---|
| Belum semua soal dikerjakan | 0 |
| Semua dikerjakan, ada soal yang tetap `belum` | 1 |
| Semua dikerjakan, tanpa `belum`, ada `hampir` atau skip | 2 |
| Semua dikerjakan dan semua `tepat` | 3 |

- **FR-2.6 (aturan ulang):** aturan ulang praktik 1 kali belum diimplementasi, dipotong dari MVP (pada kode `Lesson.js`, alur langsung melanjutkan ke soal berikutnya tanpa antrean pengulangan).
- **FR-2.7:** halaman peta menampilkan status dan bintang tiap level. Bintang dan status dihitung di database (satu sumber untuk Desktop dan Mobile); FE hanya menampilkan.
- **FR-2.8:** poin di header peta = jumlah bintang semua level. Progres level ditampilkan dengan bintang.
- **FR-2.9:** tes gabungan dihapus dari Level. (Catatan: entri kamus jenis `gabungan` tetap diperbolehkan ada di data model Kamus).

### F3 — Kamus
- **FR-3.1:** dua bagian: Alfabet (huruf lengkap + angka) dan Kata/Percakapan (dikelompokkan per kategori). Pada skema data model, kolom `kamus.jenis` memuat 'angka' selain alfabet/kata/percakapan/gabungan (catatan: pada file `isyaraku_schema.sql` di repo saat ini belum memuat constraint 'angka', lihat Bagian 7). Status implementasi di repo: halaman Kamus (`Kamus.html` dan `Kamus.js`) saat ini masih berupa filter DOM lokal murni pada elemen statis (hanya memuat alfabet A-O dan kategori statis; belum terhubung ke API Supabase dan belum memuat angka).
- **FR-3.2:** data sign di Kamus sama persis dengan data di Level (satu sumber `kamus`; video dan template tidak direkam ganda).
- **FR-3.3 (halaman utama Kamus):** saat Kamus dibuka, langsung tampil grid alfabet + angka. Di bagian atas ada tombol menuju halaman Kata/Percakapan.
- **FR-3.4 (halaman Kata/Percakapan):** menampilkan daftar kategori (mis. Perkenalan). Klik satu kategori menampilkan daftar kata/percakapan di kategori itu.
- **FR-3.5 (halaman detail sign):** klik satu item (huruf, angka, atau kata) membuka halaman detail: video contoh peragaan, dan di bawahnya tombol "Peragakan". Alur sama untuk alfabet, angka, dan kata/percakapan.
- **FR-3.6 (praktik di Kamus):** tombol "Peragakan" membuka praktik CV (F4) dengan umpan balik 3 tingkat (F5). Praktik di Kamus adalah latihan bebas: hasilnya tidak disimpan dan tidak memengaruhi progres, bintang, atau poin.
- **FR-3.7:** daftar kategori, jumlah sign, dan rentang angka → OQ-6.

### F4 — Modul Validasi Praktik (CV)
- **FR-4.1:** mengambil kamera di browser dan mendeteksi landmark tangan dengan MediaPipe Hands.
- **FR-4.2:** landmark dibandingkan dengan template pose sign target memakai jarak Euclidean setelah normalisasi. Tidak ada training model dan tidak ada dataset eksternal. Cakupan CV terbatas pada pose statis satu tangan untuk huruf dan angka (A, B, C, 1, 2, 3 yang dipakai di Level). Validasi CV untuk kata/kalimat (misal: Halo, Apa, Kabar, Selamat pagi) ditunda pasca-final karena kendala teknis: telapak rebah tidak stabil di 2D, butuh dua tangan, sudut lengan di luar kemampuan MediaPipe Hands, pose kunci statis tidak menilai lintasan gerakan, dan pada dua tangan tiap tangan dinormalisasi sendiri sehingga posisi relatif antartangan tidak dinilai.
- **FR-4.3:** template direkam manual oleh tim dan disimpan di tabel `template_pose` (landmark_data jsonb, 1 sign = 1 template). Dibutuhkan alat rekam template internal (bukan fitur pengguna).
- **FR-4.4:** perbandingan dinormalisasi terhadap posisi (translasi titik pergelangan ke asal), skala (jarak pergelangan titik 0 ke pangkal jari tengah titik 9), dan rotasi lurus ke atas (`rotateUpright`). Perbandingan dilakukan terhadap titik template dan bayangan cerminnya (`mirrorPts` via `distanceToTemplateInfo` / `distanceToTemplate`), sehingga mendukung tangan kanan maupun kidal tanpa bergantung pada label tangan MediaPipe.
- **FR-4.5:** ambang batas sementara mengacu pada nilai di `cv-prototype/cv-config.js` (`tepat: 0.15`, `hampir: 0.30`, `frameKonsisten: 5`). Hasil uji matriks internal: 11 sign x 6 kondisi, 57 dari 66 kondisi lolos, diuji pada 1 orang, 1 laptop, tangan kanan. Keputusan: tidak ada pengujian ke orang atau perangkat lain karena keterbatasan waktu.
- **FR-4.6:** integrasi template dari database ke `Lesson.js` sudah ada (diimplementasikan via fungsi `muatTemplateSoalAktif()` di `Lesson.js` yang melakukan query ke tabel `template_pose` kolom `landmark_data` berdasarkan `kamus_id` soal aktif).

### F5 — Feedback 3 Tingkat
- **FR-5.1:** hasil tiap percobaan berupa Tepat / Hampir / Belum ketemu, ditentukan dari jarak terhadap dua ambang.
- **FR-5.2:** kedua ambang adalah parameter konfigurasi tunggal yang bisa diubah tanpa mengubah logika kode. Nilai awal ditentukan dari uji (→ OQ-9).
- **FR-5.3:** tiap tingkat memiliki tampilan visual dan pesan teks pendek berbeda, dengan bahasa yang terbaca untuk kelas 3–4 SD.
- **FR-5.4 (aturan penyimpanan progres praktik):** hasil praktik yang disimpan ke database adalah hasil terbaik selama sesi praktik pada soal tersebut dengan hierarki: `tepat` > `hampir` > `belum` (disimpan via variabel `practiceBest`). Penyimpanan dilakukan saat meninggalkan tahap praktik (`stepHooks.practice.onLeave()` memanggil `simpanProgresUser()`) lewat `upsert` ke tabel `progres_user` (`onConflict: "akun_id,soal_level_id"`). Jika izin kamera ditolak atau kamera error, disimpan sebagai status `belum` dengan `flag_review = true`. Jika tangan tidak pernah terdeteksi kamera (`practiceBest` tetap null saat kamera aktif) atau pengguna belum login, sistem tidak menyimpan ke database.

### F6 — Fallback Tanpa Kamera
- **FR-6.1:** fallback aktif jika kamera tidak tersedia, izin ditolak, atau pengguna memilih lanjut tanpa kamera.
- **FR-6.2:** soal yang di-skip disimpan sebagai `belum` dengan penanda `flag_review = true`.
- **FR-6.3:** untuk bintang, soal skip dihitung setara `hampir` (level dengan skip maksimal 2 bintang). Skip tidak dihitung sebagai `belum`, sehingga tidak menahan level.
- **FR-6.4:** soal dan level dengan penanda perlu direview terlihat di halaman level dan profil.
- **FR-6.5:** penanda "perlu direview" hilang otomatis saat pengguna mengulang soal itu dengan kamera dan hasil barunya tersimpan (`flag_review` menjadi false). Tidak ada alur pengulangan khusus.
- **FR-6.6 (konflik dua perangkat):** jika progres soal yang sama disimpan dari dua perangkat, hasil yang terakhir disimpan yang berlaku (upsert).

### F7 — Media Pembelajaran
- **FR-7.1:** satu video loop 2–3 detik per sign, diperagakan anggota tim sendiri; bukan animasi dan bukan video dari internet.
- **FR-7.2:** pose pada video harus konsisten dengan pose template CV.
- **FR-7.3:** video tidak bergantung pada audio, berukuran ringan agar layak di HP.
- **FR-7.4:** video disimpan di Supabase Storage, bucket `video`, status public. Nilai pada kolom `video.url_path` hanya menyimpan path relatif (bukan URL utuh, digabungkan dengan konstanta `BASE` di frontend). Status saat ini: file video belum direkam (bucket `video` masih kosong; di seed database belum ada file video asli / url_path masih dummy atau belum di-seed). Video dipakai tanpa validasi komunitas tuli (→ limitation, Bagian 10).

### F8 — Deployment & Akses
- **FR-8.1:** produk dapat dibuka lewat link publik berbasis HTTPS tanpa setup lokal.
- **FR-8.2:** tampilan responsif di HP, tablet, dan laptop (frontend memakai file halaman Desktop dan Mobile terpisah; perubahan fitur wajib disinkronkan di kedua versi).
- **FR-8.3:** instal sebagai PWA bukan syarat MVP (v2).
- **FR-8.4:** hosting frontend: kandidat Vercel atau hosting gratis lain (belum final); risiko backend berhenti (project gratis di-pause) → OQ-14.

### F9 — Kuis Tebak Arti
- **FR-9.1:** setelah praktik sebuah soal, pengguna mengerjakan kuis pilihan ganda: video peragaan ditampilkan, pengguna memilih arti yang benar.
- **FR-9.2:** pilihan jawaban salah (pengecoh) diambil acak dari entri kamus dengan jenis yang sama (alfabet untuk huruf, angka untuk angka), bukan dari seluruh kamus. [asumsi]: cara kerja dan mekanisme kuis masih bisa berubah karena sedang dikerjakan rekan tim.
- **FR-9.3:** kuis yang salah diulang di akhir sesi sampai benar. Kuis tidak bisa di-skip.
- **FR-9.4:** kuis tidak memengaruhi bintang dan hasilnya tidak disimpan di database.
- **FR-9.5:** status implementasi di kode: opsi jawaban kuis di `Lesson.js` dan `Lesson.html` masih bersifat statis (hardcoded), belum diimplementasikan query dinamis.

---

## 7. Sketsa Data Model

Sumber: ERD final, sudah live di Supabase (Postgres, PK/FK uuid, 9 tabel, RLS aktif).

| Tabel | Isi / aturan kunci |
|---|---|
| `akun` | id (= `auth.users.id`), nama. Diisi otomatis oleh trigger |
| `section` | nama, tema, urutan (unik) |
| `level_master` | section_id, nama, urutan (unik per section) |
| `kategori` | nama (pengelompok percakapan) |
| `kamus` | jenis (`alfabet`/`angka`/`kata`/`percakapan`/`gabungan`), kata, kategori_id (wajib kecuali jenis `alfabet` dan `angka`). *Catatan: constraint check di `isyaraku_schema.sql` repo saat ini belum memuat 'angka'* |
| `video` | kamus_id (unik, 1 sign = 1 video), url_path |
| `template_pose` | kamus_id (unik, 1 sign = 1 template), landmark_data (jsonb) |
| `soal_level` | level_id, kamus_id, urutan (unik per level) — penghubung level↔kamus |
| `progres_user` | akun_id, soal_level_id, status_3tingkat (`tepat`/`hampir`/`belum`), flag_review. Unik per (akun, soal): hanya hasil terbaik yang disimpan |

**View (dihitung di database, `security_invoker`):**
- `v_progres_level`: per level menghitung total_soal, dikerjakan, belum (tanpa skip), perlu_review, tepat.
- `v_status_level`: menambah selesai, status (terkunci/berjalan/selesai), bintang, nama level/section/tema.

**Keputusan desain:** `jenis` (bentuk) dan `kategori` (topik) berbeda fungsi; tes gabungan dihapus dari Level, namun baris `kamus` berjenis `gabungan` tetap diperbolehkan untuk Kamus; kelulusan, gembok, dan bintang dihitung on-the-fly; tidak ada tabel histori percobaan dan tidak ada tabel kuis.

**Akses data:** frontend memakai publishable key; tidak ada secret key dan tidak ada backend server di MVP. Konten dibaca terbuka; `akun` dan `progres_user` dibatasi ke baris milik sendiri.

---

## 8. Edge Case & Failure State

| Kondisi | Perilaku yang dibutuhkan |
|---|---|
| Izin kamera ditolak / kamera tidak ada / dipakai aplikasi lain | Pesan jelas + tawaran fallback (F6) |
| Tangan tidak terdeteksi | Pesan "tangan belum terlihat" + petunjuk posisi; bukan dihitung "Belum ketemu" |
| Tangan keluar frame / digeser / terlalu dekat atau jauh | Ditangani normalisasi (FR-4.4); jika tetap gagal, minta atur posisi |
| Cahaya buruk / latar ramai | Pesan saran perbaiki cahaya; uji di kondisi berbeda (Bagian 9) |
| Terdeteksi lebih dari satu tangan / orang | Perilaku belum ditentukan → OQ-1 |
| Pengguna kidal | Perlakuan template (mirror atau tidak) belum ditentukan → OQ-1 |
| Model MediaPipe gagal dimuat / koneksi lambat | Loading state + pesan gagal + opsi coba lagi / fallback |
| Perangkat lambat (frame rate rendah) | Belum dipetakan → OQ-12 |
| Video peragaan gagal dimuat | Tampilkan label sign + tombol muat ulang; alur tidak macet |
| Koneksi putus saat menyimpan progres | Jangan hilangkan progres diam-diam; beri pesan dan coba simpan ulang. Aturan konflik dua perangkat: FR-6.6 |
| Email sudah terdaftar / password salah / password terlalu pendek / konfirmasi tidak cocok / field kosong | Pesan error spesifik di form (sudah teruji, tidak ada silent fail) |
| Sesi kedaluwarsa | Arahkan ke login ulang tanpa kehilangan progres tersimpan |
| Backend tidak bisa dijangkau (mis. project di-pause) | Halaman error yang jelas (→ OQ-14) |
| Pengguna menyelesaikan level dengan skip (tanpa kamera) | Level selesai, ditandai perlu direview, maksimal 2 bintang (FR-6) |
| Semua soal level dikerjakan tetapi ada yang tetap `belum` | Level tetap selesai dengan 1 bintang (FR-2.5) |

---

## 9. Success Metrics

### Definisi "selesai" MVP
- Fitur F1–F9 jalan di link publik (HTTPS)
- Section 1 lengkap dan teruji end-to-end; section 2 mengikuti aturan gembok (FR-2.4)
- Semua sign di MVP memiliki video dan template yang konsisten
- Deliverable lomba lengkap: source code (GitHub), video demo ≤ 2 menit, pitch deck (PDF), prototype UI/UX — sebelum 15–16 Okt
- Catatan: kriteria "sign dicek komunitas tuli" dari v0.1 dihapus; diganti limitation (Bagian 10)

### Metrik

| Metrik | Cara ukur | Target |
|---|---|---|
| Alur inti: daftar → belajar → praktik CV → kuis → selesai 1 level | Uji ke penguji baru tanpa bantuan tim | ≥ 4 dari 5 penguji (usulan) |
| Akurasi CV — pose benar → "Tepat" | Uji internal, ≥ 2 perangkat, ≥ 2 kondisi cahaya, ≥ 3 orang (usulan kondisi) | TBD (→ OQ-9) |
| Akurasi CV — pose salah tidak menghasilkan "Tepat" | Uji yang sama | TBD (→ OQ-9) |
| Ketahanan posisi (geser / dekat / jauh) | Ulang tes spike dengan tiap pose | Semua lolos |
| Fallback | Selesaikan level tanpa kamera | Bisa lanjut + penanda tampil |
| Lintas perangkat | Login di 2 perangkat berbeda | Progres identik |
| Bintang dan gembok | 4 skenario hasil (tepat/hampir/belum/skip) | Bintang dan status sesuai FR-2.4 dan FR-2.5 (sudah lulus uji di database) |

### Metrik kualitatif
Data non-angka dari pengamatan dan wawancara singkat ke pengguna nyata, untuk memahami kenapa, bukan berapa persen:
- Apakah pengguna paham arti Tepat / Hampir / Belum ketemu tanpa dijelaskan?
- Apakah video peragaan mudah ditiru?
- Di langkah mana pengguna bingung atau berhenti?
- Menurut penutur/komunitas tuli, apakah gerakan dan cara penyajiannya benar dan pantas? (dikerjakan pasca-hackathon)

Target: minimal 3 pengguna nyata (usulan); hasilnya masuk pitch sebagai bukti uji kegunaan.

---

## 10. Limitation & Rencana Validasi Pasca-Hackathon

**Limitation yang disadari tim:**
1. **Sistem isyarat SIBI dipilih berdasarkan asumsi tim.** Komunitas tuli tidak memberi jawaban; tidak ada validasi apakah SIBI tepat untuk target pengguna.
2. **Video peragaan oleh tim (orang dengar) tanpa izin dan validasi komunitas tuli.** Kebenaran gerakan tidak diverifikasi penutur.
3. **Pemilihan kata Kamus dan Level berdasarkan asumsi tim**, bukan kebutuhan yang divalidasi.
4. **Kebutuhan anak tuli terhadap produk ini tidak tervalidasi.** Bukti masalah hanya dari sisi orang dengar yang ingin belajar.
5. **Cakupan dan akurasi CV terbatas:**
   - CV hanya memvalidasi pose statis satu tangan untuk huruf dan angka (A, B, C, 1, 2, 3 di Level).
   - Kata/kalimat dinamis dan dua tangan (Halo, Apa, Kabar, Selamat pagi) ditunda pasca-final karena kendala teknis: telapak rebah tidak stabil di 2D, butuh dua tangan, sudut lengan di luar kemampuan MediaPipe Hands, pose kunci statis tidak menilai lintasan gerakan, dan pada dua tangan tiap tangan dinormalisasi sendiri sehingga posisi relatif antartangan tidak dinilai.
   - Pose kunci statis tidak menilai lintasan atau arah gerakan.
   - Pengujian matriks internal baru dilakukan pada 1 orang, 1 laptop, tangan kanan (57 dari 66 kondisi lolos); belum ada uji ke orang atau perangkat lain karena keterbatasan waktu.
   - Ambang batas Tepat dan Hampir masih berupa parameter sementara (`cv-config.js`: `tepat: 0.15`, `hampir: 0.30`).
6. **Kuis memungkinkan level selesai tanpa pernah menjawab tepat;** dorongan menguasai hanya lewat bintang.

**Rencana validasi pasca-hackathon (belum ada PIC):**
- Mencari penutur/komunitas tuli untuk memeriksa kebenaran sign dan video, serta memvalidasi pilihan SIBI.
- Menguji produk ke pengguna nyata (anak SD dan dewasa pemula) dan mencatat metrik kualitatif Bagian 9.
- Memeriksa ulang daftar kata dan kategori bersama penutur.

Dalam pitch, limitation ini disampaikan terbuka sebagai batasan versi hackathon, bukan disembunyikan.

---

## 11. Open Questions

Prioritas BLOCKER = menghalangi konten/desain/development tertentu.

| ID | Pertanyaan | Prioritas |
|---|---|---|
| OQ-1 | Penanganan kondisi >1 tangan terdeteksi di kamera masih terbuka. Perlakuan tangan kidal sudah teratasi lewat perbandingan cermin otomatis (`mirrorPts`). | Tinggi |
| OQ-2 | Target user mencakup anak tuli dan anak dengar. Kebutuhan anak tuli belum diyakini karena belum diriset. Pitch dan copy tidak boleh mengklaim produk memenuhi kebutuhan anak tuli. | Tinggi |
| OQ-3 | Izin dan validasi komunitas tuli untuk video peragaan oleh tim: tidak pernah dijawab. Ditangani via Bagian 10; tetap terbuka sebagai risiko etika yang bisa ditanyakan juri. | Tinggi |
| OQ-6 | Jumlah sign MVP: rentang angka, daftar kategori Percakapan, jumlah kata per kategori. Tiap sign butuh 1 video + 1 template rekam manual, jadi ini menentukan beban tim. | Tinggi |
| OQ-9 | Target akurasi CV dan ambang final (ambang saat ini masih sementara dari `cv-config.js`: tepat 0.15, hampir 0.30; belum diuji lintas perangkat/pengguna). | Tinggi |
| OQ-10 | Data akun anak (nama, email, Google), batas usia, persetujuan orang tua (cek implikasi UU PDP untuk data anak). Frame kamera diproses lokal: sudah diputuskan (NFR-4). | Tinggi |
| OQ-11 | Lupa password dikerjakan di akhir jika waktu tersisa (butuh halaman reset dan pengiriman email). | Sedang |
| OQ-12 | Browser/perangkat minimum (mis. iOS Safari, HP kelas bawah) dan performa MediaPipe di perangkat anak; belum diuji. Pengujian lewat link deploy HTTPS di HP sungguhan. | Sedang |
| OQ-13 | Angka pendukung (8% dan 77%) belum ada sumber; klaim kompetitor belum diverifikasi ulang. Jangan dipakai di pitch sebelum bersumber. | Sedang |
| OQ-14 | Hosting frontend: kandidat Vercel atau hosting gratis lain, belum final. Risiko project backend gratis di-pause saat penilaian. Mitigasi: akses rutin dan cek sebelum demo. | Sedang |
| OQ-15 | Google OAuth masih Testing (hanya test users yang bisa login). Rencana: publish ke production setelah deploy (butuh homepage URL, halaman privacy policy, domain terdaftar). Sebelum itu selesai, juri/penguji memakai email+password. | Sedang |
| OQ-18 | Prioritas pemotongan fitur jika waktu mepet menjelang submit 15–16 Okt: fitur mana yang dikorbankan lebih dulu (integrasi CV adalah bagian paling berisiko). | BLOCKER |

**Terjawab sejak v0.1:** OQ-1 sebagian (sistem = SIBI, kidal teratasi lewat cermin `mirrorPts`; sisa: >1 tangan), OQ-2 sebagian (target anak tuli dan dengar), OQ-4 (isi Level: Section Huruf A-C dan Angka 1-3; tombol praktik di Kamus), OQ-5 (section 2 terkunci sampai section 1 selesai), OQ-7 (diputuskan: CV hanya pose statis satu tangan huruf/angka; gerakan dinamis dan dua tangan ditunda), OQ-8 (aturan selesai, percobaan, granularitas simpan per soal hasil terbaik, konflik dua perangkat = yang terakhir menang), OQ-9 sebagian (skip tetap selesai dan membuka level berikutnya, penanda review hilang saat diulang dengan kamera; sisa: ambang sementara dari cv-config.js), OQ-10 sebagian (kamera diproses lokal), OQ-11 sebagian (email+password dan Google; Kamus wajib login; lupa password di akhir), OQ-16 (poin dan tampilan bintang, skip setara `hampir`), OQ-17 (video di Supabase Storage bucket 'video', url_path hanya path relatif; file video belum direkam), OQ-19 (praktik Kamus = latihan bebas).

---

## Lampiran — Perubahan dari v0.2

| Bagian | Perubahan |
|---|---|
| Header | Versi 0.3, tanggal revisi 11 Oktober 2026, status belum dibaca ulang tim |
| 6 FR-2.1 | Isi Level diubah menjadi Section "Huruf" (tema "Abjad jari", level A-C) dan Section "Angka" (level 1-3); tema sekolah/Perkenalan dibuang dari Level; level tambahan (D-F, 4-5) belum ada di SQL repo |
| 6 FR-2.9, 7 | Tes gabungan dihapus dari Level; entri kamus jenis 'gabungan' tetap boleh untuk Kamus |
| 6 FR-3.1, 7 | Data model kamus.jenis memuat 'angka' selain alfabet/kata/percakapan/gabungan (catatan: constraint di isyaraku_schema.sql belum memuat 'angka') |
| 6 FR-4.1–FR-4.6 | Cakupan CV dibatasi pada pose statis satu tangan huruf dan angka (A, B, C, 1, 2, 3 di Level); normalisasi posisi, skala, dan rotasi upright; perbandingan ke template dan cermin (kiri/kanan mandiri dari label MediaPipe); ambang sementara dari cv-config.js (tepat: 0.15, hampir: 0.30); uji matriks 11 sign x 6 kondisi lolos 57/66 (1 orang, 1 laptop, tangan kanan); FR-4.6 integrasi template database ke Lesson.js sudah ada |
| 6 FR-4.2, 10 | Kata/kalimat (Halo, Apa, Kabar, Selamat pagi) ditunda pasca-final karena telapak rebah tidak stabil di 2D, dua tangan, sudut lengan di luar MediaPipe Hands, pose kunci tidak menilai gerakan, dan normalisasi independen dua tangan tidak menilai posisi relatif |
| 6 FR-5.4 | Penyimpanan hasil terbaik via upsert ke progres_user saat meninggalkan tahap praktik; aturan kamera ditolak (belum + flag_review true), tangan tidak pernah terdeteksi dan belum login tidak menyimpan |
| 6 FR-2.6 | Aturan ulang praktik 1 kali ditandai belum diimplementasi, dipotong dari MVP |
| 6 FR-9.2, FR-9.5 | Pengecoh kuis diambil dari jenis yang sama (alfabet untuk huruf, angka untuk angka); opsi jawaban di Lesson.js masih statis; cara kerja kuis diberi tanda [asumsi] |
| 6 FR-7.4, 11 | Video disimpan di Supabase Storage bucket 'video', status public, url_path hanya path relatif; file video belum direkam (bucket kosong, url_path belum menunjuk file asli); OQ-17 dipindahkan ke Terjawab |
| 6 FR-3.1 | Status implementasi Kamus dicatat apa adanya: Kamus.html dan Kamus.js masih berupa filter DOM lokal murni tanpa koneksi Supabase |
| 10 | Ditambahkan butir limitation CV: hanya statis satu tangan huruf/angka, kata dinamis/dua tangan ditunda, pose kunci tidak menilai gerakan, uji 1 orang 1 perangkat, ambang sementara |
| 11 | OQ-4 (isi Level) terjawab, OQ-7 (cakupan CV) diputuskan/terjawab, OQ-1 kidal teratasi via cermin (>1 tangan masih terbuka), OQ-9 ambang sementara, OQ-17 (penyimpanan video) dipindahkan ke Terjawab |
