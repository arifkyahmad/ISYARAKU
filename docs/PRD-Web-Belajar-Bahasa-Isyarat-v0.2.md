# PRD — Isyaraku: Web Belajar Bahasa Isyarat Gamified

**Status:** v0.2 — revisi penuh dari v0.1 (di-acc tim 29 Sep 2026 dengan limitation). v0.2 menyatukan keputusan setelah acc; belum dibaca ulang tim.
**Tanggal revisi:** 4 Oktober 2026
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
- **FR-2.1:** ada 2 section berbasis lokasi/situasi sekolah (mis. ruang kelas, kantin); tiap section berisi urutan level; tiap level berisi urutan soal (satu soal = satu entri kamus). Tema keluarga tidak dipakai.
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

- **FR-2.6 (aturan ulang):** soal praktik yang salah diulang satu kali. Jika percobaan kedua tetap salah, level tetap selesai (maksimal 1 bintang untuk level itu). Tidak ada sistem hati. Antrean ulang dikelola FE dalam sesi; database hanya menyimpan hasil terakhir per soal.
- **FR-2.7:** halaman peta menampilkan status dan bintang tiap level. Bintang dan status dihitung di database (satu sumber untuk Desktop dan Mobile); FE hanya menampilkan.
- **FR-2.8:** poin di header peta = jumlah bintang semua level. Progres level ditampilkan dengan bintang.
- **FR-2.9:** tes gabungan di akhir level tersimpan sebagai entri kamus berjenis `gabungan`; bentuk dan posisinya mengikuti wireframe final.

### F3 — Kamus
- **FR-3.1:** dua bagian: Alfabet (huruf lengkap + angka) dan Kata/Percakapan (dikelompokkan per kategori konteks sekolah).
- **FR-3.2:** data sign di Kamus sama persis dengan data di Level (satu sumber `kamus`; video dan template tidak direkam ganda).
- **FR-3.3 (halaman utama Kamus):** saat Kamus dibuka, langsung tampil grid alfabet + angka. Di bagian atas ada tombol menuju halaman Kata/Percakapan.
- **FR-3.4 (halaman Kata/Percakapan):** menampilkan daftar kategori (mis. Perkenalan). Klik satu kategori menampilkan daftar kata/percakapan di kategori itu.
- **FR-3.5 (halaman detail sign):** klik satu item (huruf, angka, atau kata) membuka halaman detail: video contoh peragaan, dan di bawahnya tombol "Peragakan". Alur sama untuk alfabet, angka, dan kata/percakapan.
- **FR-3.6 (praktik di Kamus):** tombol "Peragakan" membuka praktik CV (F4) dengan umpan balik 3 tingkat (F5). Praktik di Kamus adalah latihan bebas: hasilnya tidak disimpan dan tidak memengaruhi progres, bintang, atau poin.
- **FR-3.7:** daftar kategori, jumlah sign, dan rentang angka → OQ-6.

### F4 — Modul Validasi Praktik (CV)
- **FR-4.1:** mengambil kamera di browser dan mendeteksi landmark tangan dengan MediaPipe Hands.
- **FR-4.2:** landmark dibandingkan dengan template pose sign target memakai jarak Euclidean. Tidak ada training model dan tidak ada dataset eksternal.
- **FR-4.3:** template direkam manual oleh tim dan disimpan di tabel `template_pose` (landmark_data, 1 sign = 1 template). Dibutuhkan alat rekam template internal (bukan fitur pengguna).
- **FR-4.4:** perbandingan harus dinormalisasi terhadap posisi dan skala tangan. Alasan: uji spike v0.1 (1 orang, 1 kondisi) menunjukkan tes tangan digeser ke kiri dan didekatkan ke kamera gagal pada perhitungan mentah maupun normalisasi. Modul tidak dianggap selesai sebelum uji geser/dekat/jauh lolos. Target akurasi → OQ-9.
- **FR-4.5:** template menyimpan jumlah tangan yang dibutuhkan sign. Sign dengan gerakan atau posisi di wajah/badan → OQ-7. Perlakuan kidal dan >1 tangan → OQ-1.
- **FR-4.6:** integrasi template dari database ke modul CV belum dikerjakan (status 3 Okt 2026).

### F5 — Feedback 3 Tingkat
- **FR-5.1:** hasil tiap percobaan berupa Tepat / Hampir / Belum ketemu, ditentukan dari jarak terhadap dua ambang.
- **FR-5.2:** kedua ambang adalah parameter konfigurasi tunggal yang bisa diubah tanpa mengubah logika kode. Nilai awal ditentukan dari uji (→ OQ-9).
- **FR-5.3:** tiap tingkat memiliki tampilan visual dan pesan teks pendek berbeda, dengan bahasa yang terbaca untuk kelas 3–4 SD.

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
- **FR-7.4:** video dipakai tanpa validasi komunitas tuli (→ limitation, Bagian 10). File video disimpan di Supabase Storage.

### F8 — Deployment & Akses
- **FR-8.1:** produk dapat dibuka lewat link publik berbasis HTTPS tanpa setup lokal.
- **FR-8.2:** tampilan responsif di HP, tablet, dan laptop (frontend memakai file halaman Desktop dan Mobile terpisah; perubahan fitur wajib disinkronkan di kedua versi).
- **FR-8.3:** instal sebagai PWA bukan syarat MVP (v2).
- **FR-8.4:** hosting frontend: kandidat Vercel atau hosting gratis lain (belum final); risiko backend berhenti (project gratis di-pause) → OQ-14.

### F9 — Kuis Tebak Arti
- **FR-9.1:** setelah praktik sebuah soal, pengguna mengerjakan kuis pilihan ganda: video peragaan ditampilkan, pengguna memilih arti yang benar.
- **FR-9.2:** pilihan jawaban salah (pengecoh) diambil acak dari seluruh tabel kamus, bukan hanya dari level itu.
- **FR-9.3:** kuis yang salah diulang di akhir sesi sampai benar. Kuis tidak bisa di-skip.
- **FR-9.4:** kuis tidak memengaruhi bintang dan hasilnya tidak disimpan di database.
- **FR-9.5:** query pengecoh belum dibuat dan diuji.

---

## 7. Sketsa Data Model

Sumber: ERD final, sudah live di Supabase (Postgres, PK/FK uuid, 9 tabel, RLS aktif).

| Tabel | Isi / aturan kunci |
|---|---|
| `akun` | id (= `auth.users.id`), nama. Diisi otomatis oleh trigger |
| `section` | nama, tema, urutan (unik) |
| `level_master` | section_id, nama, urutan (unik per section) |
| `kategori` | nama (pengelompok percakapan) |
| `kamus` | jenis (`alfabet`/`kata`/`percakapan`/`gabungan`), kata, kategori_id (wajib kecuali jenis `alfabet`) |
| `video` | kamus_id (unik, 1 sign = 1 video), url_path |
| `template_pose` | kamus_id (unik, 1 sign = 1 template), landmark_data (jsonb) |
| `soal_level` | level_id, kamus_id, urutan (unik per level) — penghubung level↔kamus |
| `progres_user` | akun_id, soal_level_id, status_3tingkat (`tepat`/`hampir`/`belum`), flag_review. Unik per (akun, soal): hanya hasil terakhir |

**View (dihitung di database, `security_invoker`):**
- `v_progres_level`: per level menghitung total_soal, dikerjakan, belum (tanpa skip), perlu_review, tepat.
- `v_status_level`: menambah selesai, status (terkunci/berjalan/selesai), bintang, nama level/section/tema.

**Keputusan desain:** `jenis` (bentuk) dan `kategori` (topik) berbeda fungsi; tes gabungan = baris `kamus` berjenis `gabungan`; kelulusan, gembok, dan bintang dihitung on-the-fly; tidak ada tabel histori percobaan dan tidak ada tabel kuis.

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
5. **Akurasi CV terbatas:** hanya pose statis; uji spike baru 1 orang, 1 kondisi, 1 tangan.
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
| OQ-1 | Perlakuan tangan kidal (mirror template atau tidak) dan >1 tangan terdeteksi. Spike CV baru menguji satu tangan; jumlah tangan per sign SIBI perlu dicek per entri. | Tinggi |
| OQ-2 | Target user mencakup anak tuli dan anak dengar. Kebutuhan anak tuli belum diyakini karena belum diriset. Pitch dan copy tidak boleh mengklaim produk memenuhi kebutuhan anak tuli. | Tinggi |
| OQ-3 | Izin dan validasi komunitas tuli untuk video peragaan oleh tim: tidak pernah dijawab. Ditangani via Bagian 10; tetap terbuka sebagai risiko etika yang bisa ditanyakan juri. | Tinggi |
| OQ-6 | Jumlah sign MVP: rentang angka, daftar kategori Percakapan, jumlah kata per kategori. Tiap sign butuh 1 video + 1 template rekam manual, jadi ini menentukan beban tim. | Tinggi |
| OQ-7 | Sign dengan gerakan atau lokasi di wajah/badan tidak tervalidasi MediaPipe + Euclidean pose statis. Satu pose kunci, beberapa frame, atau tanpa validasi CV? | BLOCKER |
| OQ-9 | Target akurasi CV dan nilai ambang awal Tepat/Hampir. Ditentukan setelah modul CV diuji (Bagian 9). | Tinggi |
| OQ-10 | Data akun anak (nama, email, Google), batas usia, persetujuan orang tua (cek implikasi UU PDP untuk data anak). Frame kamera diproses lokal: sudah diputuskan (NFR-4). | Tinggi |
| OQ-11 | Lupa password dikerjakan di akhir jika waktu tersisa (butuh halaman reset dan pengiriman email). | Sedang |
| OQ-12 | Browser/perangkat minimum (mis. iOS Safari, HP kelas bawah) dan performa MediaPipe di perangkat anak; belum diuji. Pengujian lewat link deploy HTTPS di HP sungguhan. | Sedang |
| OQ-13 | Angka pendukung (8% dan 77%) belum ada sumber; klaim kompetitor belum diverifikasi ulang. Jangan dipakai di pitch sebelum bersumber. | Sedang |
| OQ-14 | Hosting frontend: kandidat Vercel atau hosting gratis lain, belum final. Risiko project backend gratis di-pause saat penilaian. Mitigasi: akses rutin dan cek sebelum demo. | Sedang |
| OQ-15 | Google OAuth masih Testing (hanya test users yang bisa login). Rencana: publish ke production setelah deploy (butuh homepage URL, halaman privacy policy, domain terdaftar). Sebelum itu selesai, juri/penguji memakai email+password. | Sedang |
| OQ-18 | Prioritas pemotongan fitur jika waktu mepet menjelang submit 15–16 Okt: fitur mana yang dikorbankan lebih dulu (integrasi CV adalah bagian paling berisiko). | BLOCKER |

**Terjawab sejak v0.1:** OQ-1 sebagian (sistem = SIBI), OQ-2 sebagian (target anak tuli dan dengar), OQ-4 (isi section/level dan tombol praktik di Kamus), OQ-5 (section 2 terkunci sampai section 1 selesai), OQ-8 (aturan selesai, percobaan, granularitas simpan per soal, konflik dua perangkat = yang terakhir menang), OQ-9 sebagian (skip tetap selesai dan membuka level berikutnya, penanda review hilang saat diulang dengan kamera; sisa: target akurasi dan ambang), OQ-10 sebagian (kamera diproses lokal), OQ-11 sebagian (email+password dan Google; Kamus wajib login; lupa password di akhir), OQ-16 (poin dan tampilan bintang, skip setara `hampir`), OQ-17 (video di Supabase Storage), OQ-19 (praktik Kamus = latihan bebas).

---

## Lampiran — Perubahan dari v0.1

| Bagian | Perubahan |
|---|---|
| Header | Status di-acc 29 Sep; versi 0.2 |
| 1, 10 | Validasi komunitas dinyatakan tidak terjadi; ditambah Bagian 10 limitation dan rencana validasi pasca-hackathon |
| 3, 5 | G1 diganti alur per soal; ditambah F9 Kuis; non-goals: foto profil, histori percobaan, simpan hasil kuis |
| 4, 6 F3 | Kategori "keluarga" dibuang; konteks sekolah. Alur Kamus didefinisikan (grid alfabet+angka → detail video → tombol Peragakan; tombol ke Kata/Percakapan → kategori → kata → detail). Kamus punya praktik CV |
| 6 F1 | Akun sungguhan: email+password dan Google, verifikasi email mati, trigger sinkronisasi akun |
| 6 F2 | Alur "tes gabungan lulus" diganti aturan selesai (semua soal dikerjakan), bintang 0–3, gembok lintas section, aturan ulang |
| 6 F6 | Skip = `belum` + `flag_review`, setara `hampir` untuk bintang |
| 6 NFR-2, 7 | Konten pindah dari "file tetap" ke Supabase (9 tabel + 2 view); tabel `Attempt` dan `LevelProgress` diganti `progres_user` per soal |
| 9 | Kriteria "sign dicek komunitas" dihapus; ditambah metrik bintang/gembok |
| 11 | OQ-1/5/8/9/11 sebagian terjawab; OQ-4, OQ-8, OQ-16, OQ-17, OQ-19 terjawab dan dihapus dari tabel; OQ-15 dan OQ-18 ditambahkan |