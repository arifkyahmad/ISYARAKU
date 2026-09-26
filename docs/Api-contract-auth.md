# API Contract — Auth (Signup, Login, Google Sign-In)

Auth pakai Supabase Auth langsung dari client (gak ada backend server sendiri). Tabel `akun` otomatis tersinkron lewat trigger database `handle_new_user`.

---

## 1. Signup (email/password)

**Dipanggil dari:** `SignUp.html`

**Request:**
```js
const { data, error } = await supabaseClient.auth.signUp({
  email: string,
  password: string,
  options: {
    data: { nama: string }   // WAJIB dikirim, ini yang dibaca trigger buat isi tabel akun
  }
});
```

**Field wajib dari form:**
| Field | Validasi FE |
|---|---|
| nama | tidak boleh kosong |
| email | tidak boleh kosong, format email |
| password | tidak boleh kosong |
| confirmPassword | harus sama dengan password (dicek FE, gak dikirim ke Supabase) |

**Response sukses:** `data.user` berisi user baru, `error` = null
**Response gagal:** `error.message` berisi pesan (contoh: email sudah terdaftar, password minimal 6 karakter). Tampilkan langsung ke user.

**Efek samping otomatis:** Trigger `handle_new_user` bikin baris baru di tabel `akun` (id = user id, nama = dari `options.data.nama`, fallback ke Google metadata atau "Pengguna" kalau kosong). FE tidak perlu insert manual ke `akun`.

---

## 2. Login (email/password)

**Dipanggil dari:** `SignIn.html`

**Request:**
```js
const { data, error } = await supabaseClient.auth.signInWithPassword({
  email: string,
  password: string
});
```

**Response sukses:** `data.session` berisi token, otomatis tersimpan di localStorage browser (`sb-ogozgbkfgdlzlfxbmrff-auth-token`). Tidak perlu disimpan manual oleh FE.
**Response gagal:** `error.message` (contoh: email/password salah, email belum dikonfirmasi).

---

## 3. Login via Google

**Dipanggil dari:** `SignUp.html` dan `SignIn.html`, tombol dengan `id="googleBtn"`

**Request:**
```js
const { error } = await supabaseClient.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: string   // URL tujuan setelah login sukses
  }
});
```

**Alur:** Klik tombol → redirect ke halaman consent Google → user pilih akun → redirect balik ke `redirectTo`. Session otomatis tersimpan setelah redirect, tidak ada response langsung di baris pemanggilan (karena ada redirect di tengah).

**Catatan:** Saat ini Google OAuth masih status **Testing** di Google Cloud — cuma email yang didaftarkan sebagai test user yang bisa login lewat Google. Publish ke production ditunda sampai web di-deploy (butuh homepage URL + privacy policy URL).

---

## 4. Cara pakai session di request lain

Setelah login (lewat cara manapun di atas), semua request Supabase berikutnya (misal ke tabel `progres_user`) otomatis membawa token dari session yang tersimpan. FE tidak perlu kirim `user_id` manual — RLS policy di database membaca `auth.uid()` dari token itu.

Untuk cek status login di halaman manapun:
```js
const { data: { session } } = await supabaseClient.auth.getSession();
// session === null artinya belum login
```

---

## 5. Variabel penting

Instance Supabase client bernama **`supabaseClient`** (bukan `supabase`) — nama ini sengaja diganti karena bentrok dengan variabel global bawaan CDN `@supabase/supabase-js`. Semua pemanggilan auth di kode manapun harus pakai `supabaseClient.auth....`, bukan `supabase.auth....`.

---

## 6. Error umum yang perlu ditangani FE

| Pesan dari Supabase | Kapan muncul |
|---|---|
| "User already registered" | Email sudah pernah signup |
| "Email not confirmed" | Setting confirm email aktif dan user belum klik link (saat ini sudah dimatikan) |
| "Invalid login credentials" | Email/password salah saat login |
| Password terlalu pendek | Signup dengan password < 6 karakter |