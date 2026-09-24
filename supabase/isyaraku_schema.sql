-- =========================================================
-- Isyaraku — Schema Supabase (Postgres)
-- Urutan CREATE TABLE mengikuti dependency FK
-- =========================================================

-- Supabase sudah nyediain fungsi gen_random_uuid() by default (pgcrypto aktif)

-- 1. akun (extend auth.users)
create table akun (
  id uuid primary key references auth.users(id) on delete cascade,
  nama varchar(100) not null
);

-- 2. section
create table section (
  id uuid primary key default gen_random_uuid(),
  nama varchar(100),
  tema varchar(100),
  urutan smallint not null,
  unique (urutan)
);

-- 3. level_master (FK -> section)
create table level_master (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references section(id) on delete cascade,
  nama varchar(100),
  urutan smallint not null,
  unique (section_id, urutan)
);

-- 4. kategori
create table kategori (
  id uuid primary key default gen_random_uuid(),
  nama varchar(100)
);

-- 5. kamus (FK -> kategori)
create table kamus (
  id uuid primary key default gen_random_uuid(),
  kategori_id uuid references kategori(id) on delete set null,
  jenis varchar(20) not null check (jenis in ('alfabet','kata','percakapan','gabungan')),
  kata varchar(255) not null,
  constraint kategori_wajib_kecuali_alfabet
    check (jenis = 'alfabet' or kategori_id is not null)
);

-- 6. video (FK -> kamus)
create table video (
  id uuid primary key default gen_random_uuid(),
  kamus_id uuid not null unique references kamus(id) on delete cascade,
  url_path text
);

-- 7. template_pose (FK -> kamus)
create table template_pose (
  id uuid primary key default gen_random_uuid(),
  kamus_id uuid not null unique references kamus(id) on delete cascade,
  landmark_data jsonb
);

-- 8. soal_level (FK -> level_master, kamus)
create table soal_level (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references level_master(id) on delete cascade,
  kamus_id uuid not null references kamus(id) on delete cascade,
  urutan smallint not null,
  unique (level_id, urutan)
);

-- 9. progres_user (FK -> akun, soal_level)
create table progres_user (
  id uuid primary key default gen_random_uuid(),
  akun_id uuid not null references akun(id) on delete cascade,
  soal_level_id uuid not null references soal_level(id) on delete cascade,
  status_3tingkat varchar(20) not null check (status_3tingkat in ('tepat','hampir','belum')),
  flag_review boolean not null default false,
  unique (akun_id, soal_level_id)
);

-- =========================================================
-- Row Level Security
-- =========================================================

-- akun & progres_user: data privat per user
alter table akun enable row level security;
alter table progres_user enable row level security;

create policy "akun: user akses baris sendiri"
  on akun for all
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "progres_user: user akses baris sendiri"
  on progres_user for all
  using (akun_id = auth.uid())
  with check (akun_id = auth.uid());

-- Tabel konten (section, level_master, kategori, kamus, video, template_pose, soal_level):
-- read-only publik untuk semua user login, tidak ada insert/update/delete dari client
-- (isi konten dikelola manual / lewat service role key, bukan lewat API publik)

alter table section enable row level security;
alter table level_master enable row level security;
alter table kategori enable row level security;
alter table kamus enable row level security;
alter table video enable row level security;
alter table template_pose enable row level security;
alter table soal_level enable row level security;

create policy "section: read publik" on section for select using (true);
create policy "level_master: read publik" on level_master for select using (true);
create policy "kategori: read publik" on kategori for select using (true);
create policy "kamus: read publik" on kamus for select using (true);
create policy "video: read publik" on video for select using (true);
create policy "template_pose: read publik" on template_pose for select using (true);
create policy "soal_level: read publik" on soal_level for select using (true);