-- ============================================================
-- Isyaraku — Halaman Level
-- Isi: view status & bintang level + seed data dummy
-- Urutan jalan di SQL Editor: (1) v_progres_level, (2) v_status_level, (3) seed
-- View aman dijalankan ulang (create or replace). Seed HANYA SEKALI
-- (kalau diulang akan error karena kolom "urutan" unik).
-- ============================================================

-- ------------------------------------------------------------
-- (1) v_progres_level: hitungan progres per level, per user login
-- security_invoker = true supaya RLS progres_user tetap berlaku
-- ------------------------------------------------------------
create or replace view v_progres_level
with (security_invoker = true) as
select
  lm.id as level_id,
  lm.section_id,
  lm.urutan as urutan_level,
  s.urutan as urutan_section,
  count(sl.id) as total_soal,
  count(pu.id) as dikerjakan,
  count(pu.id) filter (where pu.status_3tingkat = 'belum' and pu.flag_review = false) as belum,
  count(pu.id) filter (where pu.flag_review = true) as perlu_review,
  count(pu.id) filter (where pu.status_3tingkat = 'tepat' and pu.flag_review = false) as tepat
from level_master lm
join section s on s.id = lm.section_id
join soal_level sl on sl.level_id = lm.id
left join progres_user pu on pu.soal_level_id = sl.id
group by lm.id, lm.section_id, lm.urutan, s.urutan;

-- ------------------------------------------------------------
-- (2) v_status_level: status (terkunci/berjalan/selesai) + bintang
-- selesai = semua soal dikerjakan (apa pun hasilnya)
-- bintang: 0 belum selesai | 1 ada belum | 2 ada hampir/skip | 3 semua tepat
-- Gembok level dan section memakai satu urutan lintas section (lag)
-- ------------------------------------------------------------
create or replace view v_status_level
with (security_invoker = true) as
with dasar as (
  select *, (dikerjakan = total_soal) as selesai
  from v_progres_level
),
urut as (
  select *,
    lag(selesai) over (order by urutan_section, urutan_level) as sebelumnya_selesai
  from dasar
)
select
  u.level_id, u.section_id, u.urutan_section, u.urutan_level,
  u.total_soal, u.dikerjakan, u.belum, u.perlu_review, u.selesai,
  case
    when u.selesai then 'selesai'
    when u.sebelumnya_selesai is null or u.sebelumnya_selesai then 'berjalan'
    else 'terkunci'
  end as status,
  lm.nama as nama_level,
  s.nama as nama_section,
  s.tema,
  case
    when not u.selesai then 0
    when u.belum > 0 then 1
    when u.tepat = u.total_soal then 3
    else 2
  end as bintang,
  u.tepat
from urut u
join level_master lm on lm.id = u.level_id
join section s on s.id = u.section_id;

-- ------------------------------------------------------------
-- (3) SEED DUMMY — jalankan SEKALI. Ganti dengan konten asli nanti.
-- Section 1 "Dasar": 2 level x 3 soal + video dummy
-- ------------------------------------------------------------
do $$
declare
  v_section uuid;
  v_kat uuid;
  v_l1 uuid;
  v_l2 uuid;
begin
  insert into section (nama, tema, urutan)
  values ('Dasar', 'Perkenalan', 1)
  returning id into v_section;

  select id into v_kat from kategori where nama = 'Perkenalan' limit 1;
  if v_kat is null then
    insert into kategori (nama) values ('Perkenalan') returning id into v_kat;
  end if;

  insert into level_master (section_id, nama, urutan)
  values (v_section, 'Level 1', 1) returning id into v_l1;
  insert into level_master (section_id, nama, urutan)
  values (v_section, 'Level 2', 2) returning id into v_l2;

  insert into kamus (kategori_id, jenis, kata)
  select v_kat, 'kata', k
  from unnest(array['Halo','Terima kasih','Maaf','Tolong','Nama','Kamu']) as k
  where not exists (select 1 from kamus where kata = k and jenis = 'kata');

  insert into soal_level (level_id, kamus_id, urutan)
  select case when x.lv = 1 then v_l1 else v_l2 end, ka.id, x.urutan
  from (values
    (1,'Halo',1), (1,'Terima kasih',2), (1,'Maaf',3),
    (2,'Tolong',1), (2,'Nama',2), (2,'Kamu',3)
  ) as x(lv, kata, urutan)
  join kamus ka on ka.kata = x.kata and ka.jenis = 'kata';

  insert into video (kamus_id, url_path)
  select id, 'dummy/' || lower(replace(kata, ' ', '-')) || '.mp4'
  from kamus
  where jenis = 'kata'
    and not exists (select 1 from video v where v.kamus_id = kamus.id);
end $$;

-- Section 2 "Lanjutan" (tema Kantin): 1 level x 2 soal, untuk uji gembok section
do $$
declare
  v_s2 uuid;
  v_l uuid;
begin
  insert into section (nama, tema, urutan)
  values ('Lanjutan', 'Kantin', 2) returning id into v_s2;

  insert into level_master (section_id, nama, urutan)
  values (v_s2, 'Level 1', 1) returning id into v_l;

  insert into soal_level (level_id, kamus_id, urutan)
  select v_l, id, row_number() over (order by kata)
  from kamus
  where jenis = 'kata' and kata in ('Nama', 'Kamu');
end $$;