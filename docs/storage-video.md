# Dokumentasi Penyimpanan Video (Supabase Storage)

Dokumen ini ditujukan untuk developer frontend (Raffy).

## 1. Ringkasan
Video pembelajaran disimpan di Supabase Storage, bucket `video`, status public (siapa pun bisa membaca tanpa login).

## 2. Bentuk URL publik
Pola:
`https://ogozgbkfgdlzlfxbmrff.supabase.co/storage/v1/object/public/video/<path-file>`

## 3. BASE di kode FE
Definisikan konstanta `BASE` (dengan garis miring di akhir), ditulis SEKALI di satu tempat:
```js
const BASE = 'https://ogozgbkfgdlzlfxbmrff.supabase.co/storage/v1/object/public/video/';
```

Contoh JS:
```js
const videoUrl = BASE + url_path;
```

## 4. Aturan kolom video.url_path
- Simpan PATH saja (contoh: `halo.mp4`), BUKAN URL penuh.
- Alasan: bagian depan URL cukup diubah di satu tempat (`BASE`) jika berubah.
- Contoh rakitan: `halo.mp4` -> `BASE + 'halo.mp4'` -> URL utuh.

## 5. Catatan status
- Isi `url_path` di seed saat ini masih `dummy/...mp4`, belum menunjuk file asli di bucket. Akan disesuaikan nanti.
- Bucket saat ini kosong.
