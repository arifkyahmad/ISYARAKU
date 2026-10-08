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
-- (3) SEED LEVEL (Plan B): Section Huruf A-C dan Angka 1-3
-- Prasyarat: kamus alfabet A,B,C dan angka 1,2,3 sudah ada.
-- Peringatan: delete from section ikut menghapus progres user.
-- ------------------------------------------------------------
begin;

delete from section;  -- cascade: level_master, soal_level, progres_user

with s as (
  insert into section (nama, tema, urutan) values
    ('Huruf', 'Abjad jari', 1),
    ('Angka', 'Angka', 2)
  returning id, urutan
), l as (
  insert into level_master (section_id, nama, urutan)
  select id, case urutan when 1 then 'Huruf A-C' else 'Angka 1-3' end, 1 from s
  returning id, section_id
)
insert into soal_level (level_id, kamus_id, urutan)
select l.id, k.id, x.urutan
from l
join s on s.id = l.section_id
join (values
  (1,'A',1),(1,'B',2),(1,'C',3),
  (2,'1',1),(2,'2',2),(2,'3',3)
) as x(sec, kata, urutan) on x.sec = s.urutan
join kamus k on k.kata = x.kata and k.jenis = case x.sec when 1 then 'alfabet' else 'angka' end;

commit;