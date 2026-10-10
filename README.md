# ISYARAKU

Isyaraku adalah aplikasi web pembelajaran bahasa isyarat Sistem Isyarat Bahasa Indonesia (SIBI) yang dirancang secara *gamified* untuk pemula, dikembangkan sebagai karya peserta Hackathon JOINTS UGM 2026. Aplikasi ini memandu pengguna mempelajari kosakata isyarat melalui alur bertahap yang dilengkapi validasi praktik posisi tangan menggunakan *computer vision* langsung di browser. Seluruh pemrosesan kamera berjalan lokal pada perangkat pengguna sehingga interaktif dan mudah diakses tanpa memerlukan instalasi aplikasi tambahan.

Link demo publik: (belum tersedia)

---

## Masalah yang Diselesaikan

Materi belajar bahasa isyarat yang tersedia saat ini umumnya bersifat pasif (seperti video rekaman atau gambar kamus) tanpa jalur belajar bertahap sehingga pemula bingung harus mulai dari mana. Selain itu, pembelajar mandiri tidak memperoleh umpan balik langsung apakah pose tangan yang mereka tirukan sudah tepat atau masih keliru. Ketiadaan struktur pembelajaran dan ketiadaan koreksi interaktif ini kerap membuat pemula merasa frustrasi lalu berhenti belajar.

---

## Fitur dan Status

Setiap soal pada modul pelajaran dirancang dengan alur: **video peragaan materi** $\rightarrow$ **praktik mandiri di depan kamera** $\rightarrow$ **kuis tebak arti**.

| Fitur | Status | Catatan / Kondisi Kode |
|---|---|---|
| Pendaftaran & Login Akun (Email & Kata Sandi) | ada di repo | Menggunakan Supabase Auth (`signUp`, `signInWithPassword`) di `SignIn.js` dan `SignUp.js`. |
| Login Akun dengan Google OAuth | ada di repo | Menggunakan Supabase OAuth di `SignIn.js` dengan pengalihan URL. |
| Profil Pengguna & Logout | ada di repo | Membaca data nama akun dari tabel `akun` dan fungsi `signOut`. |
| Peta Level di Beranda (`Home.html`) | ada di repo | UI peta level dan kalkulasi total bintang dari view `v_status_level` sudah ada di `Home.js`, **namun** klik node level belum membaca gembok status per level dari database dan belum terhubung untuk mengarahkan pengguna ke `Lesson.html?level=<id>` (masih berupa modal UI / TODO). |
| Alur Belajar: Video Peragaan Materi | ada di repo | Mengambil data `url_path` dari relasi tabel `soal_level` $\rightarrow$ `kamus` $\rightarrow$ `video` di `Lesson.js`, dengan fallback video lokal. |
| Alur Belajar: Praktik Kamera & Computer Vision | ada di repo | Menggunakan MediaPipe Hands lokal di browser, normalisasi landmark posisi/skala/rotasi, kalkulasi jarak Euclidean ke `template_pose`, batas waktu muat model 15 detik, dan feedback 3 tingkat: *Tepat*, *Hampir*, dan *Belum ketemu*. |
| Alur Belajar: Mode Fallback (Tanpa Kamera) | ada di repo | Tombol "Skip praktek" tersedia di `Lesson.html` dan penanganan penolakan izin kamera otomatis mencatat status perlu review. |
| Alur Belajar: Kuis Tebak Arti | belum | Komponen antarmuka kuis ada di `Lesson.html`, **tetapi** opsi pilihan jawaban masih berupa data statis hardcode dan belum terhubung ke database untuk mengambil opsi pengecoh maupun validasi jawaban. |
| Penyimpanan Progres Praktik | ada di repo | Fungsi `simpanProgresUser()` menyimpan hasil praktik per soal ke tabel `progres_user` saat sesi praktik ditinggalkan. |
| Popup Selesai Level | ada di repo | `Home.js` membaca parameter URL `?complete=1` untuk memunculkan modal penyelesaian beserta perolehan bintang. |
| Kamus Isyarat (`Kamus.html`) | ada di repo | Antarmuka pencarian dan tab pemisah Alfabet serta Kata tersedia dengan penyaringan lokal (*client-side*), belum terhubung dinamis ke database Supabase maupun media video. |

---

## Tech Stack

- **Frontend:** HTML5, CSS3, dan JavaScript Native (Vanilla JS) tanpa *build tool* atau *bundler* (layout antarmuka Desktop dan Mobile dipisah).
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth untuk email/kata sandi dan Google OAuth, Row Level Security untuk proteksi data pengguna, serta Supabase Storage bucket `video`).
- **Computer Vision:** MediaPipe Hands via CDN di sisi browser klien (pemrosesan frame kamera berlangsung lokal tanpa pengiriman data video ke server, kalkulasi jarak Euclidean terhadap data koordinat di tabel `template_pose`, tanpa training model ML dan tanpa dataset eksternal).

---

## Struktur Repositori

```text
ISYARAKU/
├── frontend/        # Kode antarmuka web (halaman HTML, skrip JS per halaman, stylesheet CSS, aset gambar & video)
├── cv-prototype/    # Logika modul computer vision (normalisasi landmark, kalkulasi jarak Euclidean, config ambang, & berkas uji/spike)
├── supabase/        # Berkas skrip SQL skema database PostgreSQL, trigger profil akun, view status/progres level, & seed data
├── docs/            # Dokumentasi proyek (PRD, kontrak API level & auth, panduan sistem desain, & panduan penyimpanan video)
├── .vscode/         # Konfigurasi workspace editor
├── README.md        # Dokumentasi utama proyek
└── .gitignore       # Daftar pengabaian berkas Git
```

- **`frontend/`**: Berisi seluruh antarmuka aplikasi web berbasis file statis, aset grafis/video, pustaka klien Supabase, serta file konfigurasi client.
- **`cv-prototype/`**: Berisi implementasi murni algoritma *computer vision* untuk ekstraksi 21 landmark tangan, rotasi, scaling, dan penilaian pose statis.
- **`supabase/`**: Berisi seluruh definisi DDL tabel PostgreSQL, aturan RLS (*Row Level Security*), trigger event pengguna baru, dan kalkulasi view gembok level.
- **`docs/`**: Berisi seluruh dokumen acuan pengembangan tim, mulai dari spesifikasi produk (PRD), kontrak data API, hingga catatan teknis arsitektur.

---

## Cara Menjalankan Lokal

Karena halaman `frontend/pages/Lesson.html` memuat berkas pustaka *computer vision* dengan path relatif ke folder prototipe (`../../cv-prototype/cv-config.js` dan `../../cv-prototype/cv-core.js`), **server lokal statis wajib dijalankan dari ROOT repositori**, bukan dari dalam folder `frontend/`. Selain itu, fitur kamera peramban mewajibkan koneksi aman (`localhost` atau `HTTPS`).

### 1. Jalankan Server Statis
Jalankan server statis dari direktori utama proyek, contohnya menggunakan Python:
```bash
python -m http.server 8000
```
*(Atau menggunakan ekstensi lokal seperti VS Code Live Server yang di-root pada direktori proyek).*

### 2. Buka Aplikasi di Browser
Buka browser dan navigasikan ke:
- Halaman Utama: `http://localhost:8000/frontend/index.html` atau `http://localhost:8000/frontend/pages/Home.html`
- Halaman Pelajaran (Contoh dengan parameter ID level):
  ```text
  http://localhost:8000/frontend/pages/Lesson.html?level=<level_id>
  ```
  *(Ganti `<level_id>` dengan UUID level yang terdapat pada tabel `level_master` di database Supabase).*

### 3. Konfigurasi Kredensial Supabase
Berkas `frontend/config.js` memuat konstanta konfigurasi koneksi klien:
- `SUPABASE_URL`: URL endpoint proyek Supabase.
- `SUPABASE_PUBLISHABLE_KEY`: Kunci publik (*publishable/anon key*) untuk akses client dengan pembatasan RLS.

> *Catatan keamanan: Berkas `frontend/config.js` hanya boleh berisi URL proyek dan publishable key. Jangan pernah menaruh service role key atau secret key pada berkas frontend.*

---

## Database

Daftar berkas SQL pada folder `supabase/`:
1. `isyaraku_schema.sql`: Mendefinisikan 9 tabel utama (`akun`, `section`, `level_master`, `kategori`, `kamus`, `video`, `template_pose`, `soal_level`, `progres_user`) beserta relasi foreign key dan aturan Row Level Security (RLS).
2. `isyaraku_trigger_auth.sql`: Mendefinisikan function dan trigger `handle_new_user()` yang otomatis menyalin data profil ke tabel `akun` saat pengguna baru terdaftar di Supabase Auth.
3. `isyaraku_level.sql`: Mendefinisikan view `v_progres_level`, view `v_status_level` (kalkulasi status selesai/berjalan/terkunci dan bintang 0–3), serta data seed section dan level untuk Huruf A–C dan Angka 1–3.

> **PERINGATAN KERAS:**  
> **Menjalankan ulang skrip `isyaraku_level.sql` akan MENGHAPUS SEMUA DATA section dan SELURUH PROGRES USER. Hal ini terjadi karena terdapat perintah `delete from section;` yang menjalankan penghapusan berantai (*cascade delete*) ke tabel `level_master`, `soal_level`, hingga `progres_user`.**

---

## Batasan Sistem (Limitation)

1. **Pose Statis Satu Tangan:** Validasi *computer vision* saat ini hanya mendukung pose statis satu tangan untuk alfabet dan angka (A–C dan 1–3). Sistem tidak menilai dimensi waktu atau trajektori gerakan tangan.
2. **Kata Dinamis dan Dua Tangan Ditunda:** Kata yang memerlukan gerakan dinamis atau interaksi dua tangan (seperti "Apa", "Kabar", "Selamat pagi") belum stabil pada pipeline Euclidean dan saat ini ditunda dari cakupan evaluasi otomatis.
3. **Belum Ada Validasi Komunitas Tuli:** Pemilihan materi, panduan isyarat, dan video peragaan belum divalidasi langsung oleh komunitas penutur Tuli atau ahli bahasa isyarat.
4. **Asumsi Sistem SIBI:** Pilihan menggunakan sistem isyarat SIBI didasarkan pada asumsi internal tim untuk kebutuhan kompetisi dan belum diuji kesesuaiannya terhadap preferensi pembelajar nyata.
5. **Uji Akurasi Terbatas:** Pengujian akurasi deteksi pose *computer vision* baru diuji secara internal pada 1 orang dan 1 perangkat dengan variasi kondisi lingkungan yang terbatas.

---

## Tim Pengembang

- **Rifky**: (perlu diisi manual)
- **Chery**: (perlu diisi manual)
- **Raffy**: (perlu diisi manual)
- **Hanif**: (perlu diisi manual)

---

## Status Proyek

Proyek ini merupakan **versi hackathon, belum production**. Dikembangkan sebagai prototipe fungsional untuk kompetisi Hackathon JOINTS UGM 2026.