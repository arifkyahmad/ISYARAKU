# API Contract — Level (Peta Level & Progres)

**Tanggal:** 3 Oktober 2026
**Status:** Peta level (termasuk bintang), simpan progres, dan baca progres sudah dites di Supabase. Data popup level, layar belajar, layar tes, dan data kuis belum ada.
**Penulis:** Rifky (BE)

---

## Ringkasan

Dokumen ini mencakup data yang dibutuhkan halaman **peta level**: daftar section dan level beserta status (terkunci / berjalan / selesai) dan bintang (0-3), serta cara menyimpan dan membaca progres per soal. Semua diakses lewat `supabaseClient` (Supabase JS), tidak ada server terpisah.

Desktop dan Mobile memakai **query yang sama persis**.

## Syarat umum

- Pakai `supabaseClient` dari `supabaseClient.js` (bukan `supabase`, yang bentrok dengan objek global CDN).
- URL dan Publishable key ada di `frontend/config.js`.
- **Data konten** (section, level, kata) terbuka tanpa login.
- **Data progres** privat per akun. Harus login, dan RLS otomatis membatasi ke baris milik user yang login (`auth.uid()`). FE tidak perlu memfilter sendiri.
- Semua nilai enum ditulis **huruf kecil**.

---

## Endpoint 1 — Peta level

Satu query untuk seluruh isi peta: semua level dari semua section, terurut, lengkap dengan status dan bintang milik user yang login.

```js
const { data, error } = await supabaseClient
  .from('v_status_level')
  .select('level_id, section_id, urutan_section, urutan_level, nama_section, tema, nama_level, total_soal, dikerjakan, belum, tepat, perlu_review, selesai, bintang, status')
  .order('urutan_section')
  .order('urutan_level');
```

### Contoh response

```json
[
  {
    "level_id": "8c2e0822-ebd1-46a6-98ad-905b349777ca",
    "section_id": "6ff9142e-3840-4cbb-9159-4566fe5a46eb",
    "urutan_section": 1,
    "urutan_level": 1,
    "nama_section": "Dasar",
    "tema": "Perkenalan",
    "nama_level": "Level 1",
    "total_soal": 3,
    "dikerjakan": 3,
    "belum": 0,
    "tepat": 3,
    "perlu_review": 0,
    "selesai": true,
    "bintang": 3,
    "status": "selesai"
  },
  {
    "level_id": "a518a95e-8d8a-4712-9a38-ded4b77bef44",
    "section_id": "3438a5cd-15b6-42cd-afbf-b47859423762",
    "urutan_section": 2,
    "urutan_level": 1,
    "nama_section": "Lanjutan",
    "tema": "Kantin",
    "nama_level": "Level 1",
    "total_soal": 2,
    "dikerjakan": 0,
    "belum": 0,
    "tepat": 0,
    "perlu_review": 0,
    "selesai": false,
    "bintang": 0,
    "status": "berjalan"
  }
]
```

Datanya berupa **satu baris per level** (rata, bukan bersarang). Untuk mengelompokkan per section, FE cukup mengelompokkan berdasarkan `section_id` atau `urutan_section`.

### Arti kolom

| Kolom | Arti |
|---|---|
| `level_id`, `section_id` | id (uuid) level dan section |
| `urutan_section`, `urutan_level` | urutan tampil. `urutan_level` dihitung per section |
| `nama_section`, `tema`, `nama_level` | teks untuk banner dan node |
| `total_soal` | jumlah soal (kata) di level itu |
| `dikerjakan` | soal yang sudah punya progres milik user (apa pun hasilnya) |
| `belum` | soal yang hasil terakhirnya `belum` **dan tidak di-skip** |
| `tepat` | soal yang hasil terakhirnya `tepat` dan tidak di-skip |
| `perlu_review` | soal yang di-skip lewat fallback tanpa kamera (`flag_review = true`) |
| `selesai` | `true` jika semua soal sudah dikerjakan (apa pun hasilnya) |
| `bintang` | 0 sampai 3, aturan di bawah |
| `status` | `selesai`, `berjalan`, atau `terkunci` (aturan di bawah) |

### Catatan penting untuk FE

- **Tanpa login, peta tetap muncul** dan semua `dikerjakan` bernilai 0. Ini bukan error. Level pertama berstatus `berjalan`, sisanya `terkunci`.
- **`bintang` sudah dihitung di database.** FE cukup membaca angkanya, tidak perlu menghitung ulang.
- Ikon level murni urusan FE (CSS), tidak ada di data.
- `status` sudah memuat aturan gembok level **dan** gembok section.
- Angka poin di header peta: asumsi sementara = jumlah `bintang` dari semua level (lihat bagian "Belum diputuskan").

---

## Endpoint 2 — Daftar soal per level (versi sementara)

Dibutuhkan untuk mendapatkan `soal_level_id` sebelum menyimpan progres. Format final untuk layar belajar dan tes menunggu wireframe.

```js
const { data, error } = await supabaseClient
  .from('soal_level')
  .select('id, urutan, kamus(kata)')
  .eq('level_id', LEVEL_ID)
  .order('urutan');
```

### Contoh response

```json
[
  { "id": "0682da88-65c1-4aa4-aafe-16c8a9486673", "urutan": 1, "kamus": { "kata": "Halo" } }
]
```

`id` di sini adalah `soal_level_id` yang dipakai di Endpoint 3. Urutan soal (`urutan`) hanya berlaku di dalam satu level, jadi selalu urutkan bersama filter `level_id`.

---

## Endpoint 3 — Simpan progres per soal

Menyimpan **hasil terakhir** satu soal (hasil **praktik**). Menyimpan soal yang sama berkali-kali menimpa baris lama (tidak ada duplikat, tidak ada histori percobaan).

```js
const { data: { user } } = await supabaseClient.auth.getUser();

const { data, error } = await supabaseClient
  .from('progres_user')
  .upsert(
    {
      akun_id: user.id,
      soal_level_id: SOAL_LEVEL_ID,
      status_3tingkat: 'tepat',   // 'tepat' | 'hampir' | 'belum'
      flag_review: false
    },
    { onConflict: 'akun_id,soal_level_id' }
  )
  .select();
```

| Field | Wajib | Nilai |
|---|---|---|
| `akun_id` | ya | `user.id` dari sesi login |
| `soal_level_id` | ya | `id` dari Endpoint 2 |
| `status_3tingkat` | ya | `tepat`, `hampir`, atau `belum` (huruf kecil) |
| `flag_review` | tidak (default `false`) | `true` jika soal di-skip (fallback tanpa kamera) |

**Soal di-skip (tanpa kamera):** simpan `status_3tingkat: 'belum'` dengan `flag_review: true`. Soal tetap terhitung dikerjakan, dan untuk bintang dihitung setara `hampir` (maksimal 2 bintang untuk level itu).

Untuk menyimpan banyak soal sekaligus, `upsert` menerima array baris.

**Hasil kuis tidak disimpan di database** (lihat bagian alur di bawah).

---

## Endpoint 4 — Baca progres per level

Status tiap soal milik user di satu level.

```js
const { data, error } = await supabaseClient
  .from('progres_user')
  .select('status_3tingkat, flag_review, soal_level!inner(id, urutan, level_id)')
  .eq('soal_level.level_id', LEVEL_ID);
```

### Contoh response

```json
[
  {
    "status_3tingkat": "tepat",
    "flag_review": false,
    "soal_level": { "id": "0682da88-65c1-4aa4-aafe-16c8a9486673", "urutan": 1, "level_id": "8c2e0822-ebd1-46a6-98ad-905b349777ca" }
  }
]
```

Hasil hanya berisi soal yang **sudah punya progres**. Level yang belum dikerjakan mengembalikan `[]`. Tanpa login juga `[]`.

---

## Aturan status level

Dihitung di database (view `v_status_level`), bukan di FE.

1. **selesai:** semua soal di level itu sudah punya progres. **Apa pun hasilnya** (`tepat`, `hampir`, `belum`, atau di-skip) tetap dihitung selesai.
2. **berjalan:** level terbuka tapi belum selesai. Level pertama di seluruh peta selalu terbuka.
3. **terkunci:** level sebelumnya (urutan section lalu urutan level) belum selesai.
4. **Gembok section:** karena level diurutkan lintas section, level pertama section 2 baru terbuka setelah level terakhir section 1 selesai.

## Aturan bintang

| Kondisi level | Bintang |
|---|---|
| Belum semua soal dikerjakan | 0 |
| Semua dikerjakan, ada soal yang hasil akhirnya `belum` | 1 |
| Semua dikerjakan, tidak ada `belum`, tapi ada `hampir` atau soal di-skip | 2 |
| Semua dikerjakan dan semua `tepat` | 3 |

Dihitung dari hasil **praktik** saja. Kuis tidak memengaruhi bintang.

---

## Alur belajar per soal (aturan untuk FE)

Urutan per soal (kata): **video contoh → praktik dengan CV → kuis tebak arti.**

- **Praktik:** soal yang hasilnya salah (`belum`) diulang **satu kali** di akhir sesi level. Kalau percobaan kedua tetap salah, level tetap berjalan dan soal itu berakhir sebagai `belum` (level selesai dengan 1 bintang). Hanya **hasil akhir** yang disimpan lewat Endpoint 3.
- **Kuis:** pilihan ganda, video peragaan, user memilih arti. Jawaban salah membuat soal diulang di akhir sesi **sampai benar**. Tidak bisa di-skip, tidak memengaruhi bintang, dan hasilnya tidak disimpan di database.
- **Saran agar tidak macet:** setelah 2 kali salah di soal kuis yang sama, tampilkan jawaban yang benar (user tetap harus memilihnya).
- **Pengecoh kuis:** diambil acak dari tabel `kamus` secara keseluruhan (bukan hanya dari level itu, karena soal per level sedikit). Query pengecoh belum dibuat atau diuji oleh BE.
- **Antrean ulang** (praktik dan kuis) diurus FE di dalam sesi. Kalau user menutup halaman di tengah level, antrean ulang hilang.

---

## Error umum

| Gejala / kode | Penyebab | Penanganan di FE |
|---|---|---|
| Progres semua 0 padahal sudah pernah main | Belum login atau sesi habis | Cek `auth.getUser()`, arahkan ke halaman login |
| `42501` (RLS) saat upsert | Belum login, atau `akun_id` bukan id user yang login | Pastikan `akun_id = user.id` |
| `23514` | `status_3tingkat` bukan `tepat` / `hampir` / `belum` | Cek ejaan dan huruf kecil |
| `42P10` | `onConflict` tidak cocok dengan constraint | Pakai persis `'akun_id,soal_level_id'` |
| `23503` | `soal_level_id` atau `akun_id` tidak ada | Cek id dari Endpoint 2 dan sesi login |
| `permission denied for view` | Hak akses view belum diberikan | Kabari BE |
| Peta kosong `[]` | Tabel konten kosong | Kabari BE |

---

## Belum diputuskan / belum tersedia

Bagian ini supaya FE tahu apa yang **belum boleh diandalkan**.

| Hal | Status | Dampak ke FE |
|---|---|---|
| **Poin di header peta** | Asumsi BE: jumlah `bintang` dari semua level. Belum dikonfirmasi tim | Boleh dibuat sementara dengan menjumlahkan `bintang` |
| **Tampilan bintang** (bintang atau diganti progress ring/medali) | Menunggu Chery | FE membaca `bintang` (0-3), bentuk visual bebas |
| **Data popup level** (jumlah kata, daftar kata, dll) | Menunggu wireframe | Belum ada endpoint |
| **Layar belajar dan tes** (video contoh, praktik CV) | Menunggu wireframe | Belum ada endpoint. Endpoint 2 hanya sementara |
| **Query pengecoh kuis** | Belum dibuat | Lihat bagian alur di atas |
| **Tes gabungan di akhir level** | Belum dirancang di data | Belum ada endpoint |
| **Penanda "perlu review" di UI** | Data sudah ada (`perlu_review`), tampilannya belum dirancang | Boleh diabaikan dulu |

Sudah diputuskan: 2 section, foto profil ditunda (pakai avatar default atau inisial dari `akun.nama`), "Unit" dibuang dari desain.

---

## Data dummy saat ini

Section 1 "Dasar" (2 level, 3 soal per level) dan section 2 "Lanjutan" (1 level, 2 soal). Kata dan video masih dummy. Jangan menganggap data ini final.