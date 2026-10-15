/* ===================================================================
   Home.js  –  Logika interaktif halaman Beranda IsyaraKu
   ================================================================= */

(async () => {
  const client = supabaseClient;
  const { data } = await client.auth.getSession();
  if (!data?.session) {
    window.location.replace('SignIn.html');
    return;
  }
})();

/* -----------------------------------------------------------------
   1. Sidebar — buka / tutup
   ----------------------------------------------------------------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar      = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const overlay      = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // cegah scroll body saat sidebar terbuka
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Tutup sidebar dengan tombol Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

/* -----------------------------------------------------------------
   2. Navigasi Sidebar — highlight item aktif
   ----------------------------------------------------------------- */
const sidebarItems = document.querySelectorAll('.sidebar-item:not(.sidebar-item-danger)');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

sidebarItems.forEach((item) => {
  item.addEventListener('click', () => {
    const label = item.querySelector('span')?.textContent?.trim();

    // Hapus kelas aktif dari semua item
    sidebarItems.forEach((i) => i.classList.remove('active'));
    item.classList.add('active');

    mobileNavItems.forEach((navItem) => {
      const isActive = navItem.dataset.navTarget === label;
      navItem.classList.toggle('active', isActive);
      if (isActive) {
        navItem.setAttribute('aria-current', 'page');
      } else {
        navItem.removeAttribute('aria-current');
      }
    });

    // Navigasi sederhana berdasarkan teks
    switch (label) {
      case 'Beranda':
        // sudah di halaman ini
        break;
      case 'Kamus':
        window.location.href = 'Kamus.html';
        break;
      case 'Profil':
        window.location.href = 'Profile.html';
        break;
      case 'Pengaturan':
        // window.location.href = '../frontend/pages/Pengaturan.html';
        console.log('Navigasi ke Pengaturan');
        break;
      default:
        break;
    }

    // Tutup sidebar setelah memilih
    setTimeout(closeSidebar, 200);
  });
});

mobileNavItems.forEach((item) => {
  item.addEventListener('click', () => {
    const sidebarItem = [...sidebarItems].find(
      (navItem) => navItem.querySelector('span')?.textContent?.trim() === item.dataset.navTarget
    );

    sidebarItem?.click();
  });
});

document.querySelector('.profile-badge')?.addEventListener('click', () => {
  window.location.href = 'Profile.html';
});

/* -----------------------------------------------------------------
   3. Tombol Keluar (Logout)
   ----------------------------------------------------------------- */
document.getElementById('btnLogout')?.addEventListener('click', async () => {
  const confirm = window.confirm('Apakah kamu yakin ingin keluar?');
  if (!confirm) return;

  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert('Gagal keluar: ' + error.message);
      return;
    }
    // Redirect ke halaman login setelah logout
    window.location.href = 'SignIn.html';
  } catch (err) {
    console.error('Logout error:', err);
    // Fallback jika supabase tidak tersedia (misal mode dev offline)
    window.location.href = 'SignIn.html';
  }
});

/* -----------------------------------------------------------------
   4. Tombol Hapus Akun
   ----------------------------------------------------------------- */
document.getElementById('btnDeleteAccount')?.addEventListener('click', async () => {
  const confirmed = window.confirm(
    'PERINGATAN: Tindakan ini tidak dapat dibatalkan!\n\nAkun kamu beserta semua data progres belajar akan dihapus secara permanen.\n\nApakah kamu yakin?'
  );
  if (!confirmed) return;

  // Konfirmasi kedua
  const doubleConfirm = window.confirm('Konfirmasi terakhir: Hapus akun sekarang?');
  if (!doubleConfirm) return;

  try {
    // Panggil fungsi Supabase untuk hapus akun (memerlukan Edge Function atau RPC di backend)
    // const { error } = await supabaseClient.rpc('delete_user');
    // if (error) throw error;

    // Sementara ini, logout dulu
    await supabaseClient.auth.signOut();
    alert('Akun berhasil dihapus.');
    window.location.href = 'SignIn.html';
  } catch (err) {
    console.error('Delete account error:', err);
    alert('Gagal menghapus akun. Silakan hubungi support.');
  }
});

/* -----------------------------------------------------------------
   5. Lesson Nodes — klik untuk masuk pelajaran
   ----------------------------------------------------------------- */
const STAR_FILLED = '../assets/img/BintangFilled.svg';
const STAR_EMPTY  = '../assets/img/Bintang unfilled.svg';

const NODE_LEVEL_MAP = {
  'node-s2-4': 1,
  'node-s2-3': 2,
  'node-s2-2': 3,
  'node-s2-1': 4,
};

// Mengubah nama level menjadi teks materi yang ramah (contoh: 'Huruf A B C', 'Angka 1 2 3')
function formatLevelMateri(namaLevel, urutanLevel) {
  if (!namaLevel) {
    const fallbackMateri = {
      1: "Huruf A B C",
      2: "Angka 1 2 3",
      3: "Huruf D E F",
      4: "Angka 4 5 6",
    };
    return fallbackMateri[urutanLevel] || `Level ${urutanLevel || ''}`;
  }
  const nama = namaLevel.trim();
  if (/huruf a-c/i.test(nama)) return "Huruf A B C";
  if (/angka 1-3/i.test(nama)) return "Angka 1 2 3";
  if (/huruf d-f/i.test(nama)) return "Huruf D E F";
  if (/angka 4-6/i.test(nama)) return "Angka 4 5 6";
  return nama.replace('-', ' - ');
}

// Update bintang di bawah icon level dan status node (completed/active)
function updateAllLevelStarsAndStatus(statusLevels) {
  if (!statusLevels || !Array.isArray(statusLevels)) return;

  Object.entries(NODE_LEVEL_MAP).forEach(([nodeClass, urutan]) => {
    const levelData = statusLevels.find((item) => item.urutan_level === urutan);
    const nodeElement = document.querySelector(`.${nodeClass}`);
    const starsSuffix = nodeClass.replace(/^node-/, '');
    const starsContainer = document.querySelector(`.node-stars-${starsSuffix}`);

    // Update 3 bintang di bawah icon level
    if (starsContainer) {
      const starImgs = starsContainer.querySelectorAll('img');
      const bintangCount = levelData ? (levelData.bintang || 0) : 0;
      starImgs.forEach((img, idx) => {
        img.src = idx < bintangCount ? STAR_FILLED : STAR_EMPTY;
      });
    }

    // Update status visual node
    if (nodeElement && levelData) {
      nodeElement.classList.remove('completed', 'active');
      if (levelData.status === 'selesai') {
        nodeElement.classList.add('completed');
      } else if (levelData.status === 'berjalan') {
        nodeElement.classList.add('active');
      }
    }
  });
}

const lessonNodes = document.querySelectorAll('.lesson-node');
const lessonModal = document.getElementById('lessonModal');
const lessonModalTitle = document.getElementById('lessonModalTitle');
const lessonModalCancel = document.getElementById('lessonModalCancel');
const lessonModalStart = document.getElementById('lessonModalStart');
const lessonModalLevel = document.getElementById('lessonModalLevel');
let selectedLessonNode = null;
let previousBodyOverflow = '';
let currentLevelId = null;
let allLevels = [];

function closeLessonModal() {
  lessonModal.classList.remove('open');
  lessonModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = previousBodyOverflow;
  selectedLessonNode?.focus();
}

lessonNodes.forEach((node) => {
  node.tabIndex = 0;
  node.setAttribute('role', 'button');

  node.addEventListener('click', () => {
    // Ambil info section dan nomor node dari kelas
    const classes = [...node.classList];
    const nodeClass = classes.find((c) => c.startsWith('node-s'));
    const levelNumber = node.querySelector('.node-text').textContent.trim();
    lessonModalLevel.textContent = levelNumber;
    console.log('Membuka pelajaran:', nodeClass);

    selectedLessonNode = node;
    const targetUrutan = nodeClass ? NODE_LEVEL_MAP[nodeClass] : undefined;
    const lessonModalLetters = document.getElementById('lessonModalLetters') || document.querySelector('.lesson-modal-letters');

    if (targetUrutan !== undefined) {
      const matchedLevel = allLevels.find((item) => item.urutan_level === targetUrutan);
      if (lessonModalTitle) {
        lessonModalTitle.textContent = 'Level';
      }
      if (lessonModalLetters) {
        lessonModalLetters.textContent = formatLevelMateri(matchedLevel ? matchedLevel.nama_level : null, targetUrutan);
      }
    } else {
      if (lessonModalTitle) {
        lessonModalTitle.textContent = 'Level';
      }
      if (lessonModalLetters) {
        lessonModalLetters.textContent = 'Segera Hadir';
      }
    }

    previousBodyOverflow = document.body.style.overflow;
    lessonModal.classList.add('open');
    lessonModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lessonModalCancel.focus();

    // Feedback visual singkat
    node.style.transform = 'scale(0.92)';
    setTimeout(() => {
      node.style.transform = '';
    }, 150);
  });

  node.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      node.click();
    }
  });
});

lessonModalCancel.addEventListener('click', closeLessonModal);
lessonModalStart.addEventListener('click', () => {
  const classes = selectedLessonNode ? [...selectedLessonNode.classList] : [];
  const mapKey = classes.find((c) => c in NODE_LEVEL_MAP);
  const targetUrutan = mapKey ? NODE_LEVEL_MAP[mapKey] : undefined;
  const levelData = targetUrutan !== undefined
    ? allLevels.find((item) => item.urutan_level === targetUrutan)
    : null;

  if (!levelData) {
    alert('Level belum tersedia');
    return;
  }

  if (levelData.status === 'terkunci') {
    alert('Selesaikan level sebelumnya dulu');
    return;
  }

  window.location.href = 'Lesson.html?level=' + levelData.level_id;
});
lessonModal.addEventListener('click', (event) => {
  if (event.target === lessonModal) closeLessonModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lessonModal.classList.contains('open')) {
    closeLessonModal();
  }
});

/* -----------------------------------------------------------------
   5b. Popup selesai pelajaran ("Selamat!")
   Dipanggil setelah semua sesi dalam satu stage selesai.
   Contoh: openCompleteModal({ lessonName: 'Kata Sapaan', stars: 3 });
   Dari halaman Lesson: window.location.href = 'Home.html?complete=1&lesson=Kata%20Sapaan&stars=3';
   ----------------------------------------------------------------- */
const completeModal  = document.getElementById('completeModal');
const completeNext   = document.getElementById('completeModalNext');
const completeCancel = document.getElementById('completeModalCancel');
const completeDesc   = document.getElementById('completeModalDesc');
const completeStars  = document.querySelectorAll('#completeModalStars img');

let completeBodyOverflow = '';

function openCompleteModal({ lessonName = 'Kata Sapaan', stars = 3 } = {}) {
  completeDesc.textContent = `Kamu Lulus Belajar ${lessonName}`;
  completeStars.forEach((img, i) => {
    img.src = i < stars ? STAR_FILLED : STAR_EMPTY;
  });

  completeBodyOverflow = document.body.style.overflow;
  completeModal.classList.add('open');
  completeModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  completeNext.focus();
}

function closeCompleteModal() {
  completeModal.classList.remove('open');
  completeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = completeBodyOverflow;
}

completeCancel.addEventListener('click', closeCompleteModal);
completeNext.addEventListener('click', () => {
  // TODO: arahkan ke pelajaran berikutnya
  closeCompleteModal();
});
completeModal.addEventListener('click', (event) => {
  if (event.target === completeModal) closeCompleteModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && completeModal.classList.contains('open')) {
    closeCompleteModal();
  }
});

// Buka otomatis jika datang dari halaman Lesson (?complete=1&lesson=...&stars=...)
const completeParams = new URLSearchParams(window.location.search);
if (completeParams.get('complete') === '1') {
  const starsParam = completeParams.has('stars') ? Number(completeParams.get('stars')) : 3;
  openCompleteModal({
    lessonName: completeParams.get('lesson') || undefined,
    stars: Math.max(0, Math.min(3, Number.isNaN(starsParam) ? 3 : starsParam)),
  });
  history.replaceState(null, '', window.location.pathname);   // hapus parameter dari URL
}

/* -----------------------------------------------------------------
   6. Update data pengguna (XP, dll.) dari Supabase saat load
   ----------------------------------------------------------------- */
async function loadUserData() {
  // Pastikan xp badge awal = 0 sebelum data dimuat
  const xpEl = document.getElementById('xpValue') || document.querySelector('.xp-value');
  if (xpEl) xpEl.textContent = '0';

  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) return;

    // Ambil profil pengguna dari tabel akun
    const { data: profile } = await supabaseClient
      .from('akun')
      .select('nama')
      .eq('id', user.id)
      .single();

    if (profile) {
      const profileNameEl = document.querySelector('.profile-name');
      if (profileNameEl) {
        profileNameEl.textContent = profile.nama;
      }

      console.log('User loaded:', profile.nama);
    }

    // Ambil status level dari view v_status_level
    // View ini sudah security_invoker=true, jadi otomatis filter per user login
    const { data: statusLevels, error: levelError } = await supabaseClient
      .from('v_status_level')
      .select('level_id, nama_level, status, bintang, urutan_section, urutan_level')
      .order('urutan_section', { ascending: true })
      .order('urutan_level', { ascending: true });

    if (levelError) {
      console.warn(levelError);
    } else if (statusLevels) {
      allLevels = statusLevels;

      const activeLevel = statusLevels.find((item) => item.status === 'berjalan');
      if (activeLevel) {
        currentLevelId = activeLevel.level_id;
      }

      // Hitung total bintang dari semua level yang sudah SELESAI
      // bintang = 0 untuk level belum selesai, 1-3 untuk yang sudah selesai
      const totalBintang = statusLevels.reduce((sum, item) => sum + (item.bintang || 0), 0);
      if (xpEl) {
        xpEl.textContent = totalBintang;
      }

      // Update tampilan bintang di bawah icon level dan status node
      updateAllLevelStarsAndStatus(statusLevels);
    }
  } catch (err) {
    // Abaikan error saat offline / belum login
    console.warn('loadUserData:', err.message);
  }
}

// Jalankan saat DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadUserData);
// Atau langsung panggil jika script sudah di bawah body
loadUserData();
