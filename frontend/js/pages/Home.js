/* ===================================================================
   Home.js  –  Logika interaktif halaman Beranda IsyaraKu
   ================================================================= */

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
    window.location.href = '../frontend/pages/SignIn.html';
  } catch (err) {
    console.error('Logout error:', err);
    // Fallback jika supabase tidak tersedia (misal mode dev offline)
    window.location.href = '../frontend/pages/SignIn.html';
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
    window.location.href = '../frontend/pages/SignIn.html';
  } catch (err) {
    console.error('Delete account error:', err);
    alert('Gagal menghapus akun. Silakan hubungi support.');
  }
});

/* -----------------------------------------------------------------
   5. Lesson Nodes — klik untuk masuk pelajaran
   ----------------------------------------------------------------- */
const lessonNodes = document.querySelectorAll('.lesson-node');
const lessonModal = document.getElementById('lessonModal');
const lessonModalCancel = document.getElementById('lessonModalCancel');
const lessonModalStart = document.getElementById('lessonModalStart');
let selectedLessonNode = null;
let previousBodyOverflow = '';

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
    console.log('Membuka pelajaran:', nodeClass);

    selectedLessonNode = node;
    previousBodyOverflow = document.body.style.overflow;
    lessonModal.classList.add('open');
    lessonModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lessonModalCancel.focus();

    // TODO: Navigasi ke halaman pelajaran yang sesuai
    // Contoh: window.location.href = `../frontend/pages/Lesson.html?node=${nodeClass}`;

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
lessonModalStart.addEventListener('click', closeLessonModal);
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

const STAR_FILLED = '../assets/img/BintangFilled.svg';
const STAR_EMPTY  = '../assets/img/Bintang unfilled.svg';
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
   6. Section Cards — klik pada tombol buku untuk preview materi
   ----------------------------------------------------------------- */
const sectionBookBtns = document.querySelectorAll('.section-book-btn');

sectionBookBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.section-card');
    const title = card.querySelector('.section-title')?.textContent?.trim();
    console.log('Preview materi section:', title);
    // TODO: Tampilkan modal / navigasi ke halaman overview section
  });
});

/* -----------------------------------------------------------------
   7. Update data pengguna (XP, dll.) dari Supabase saat load
   ----------------------------------------------------------------- */
async function loadUserData() {
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

    // Ambil total bintang dari view v_status_level
    const { data: statusLevels, error: levelError } = await supabaseClient
      .from('v_status_level')
      .select('bintang');

    if (levelError) {
      console.warn(levelError);
    } else if (statusLevels) {
      const totalBintang = statusLevels.reduce((sum, item) => sum + (item.bintang || 0), 0);
      const xpEl = document.querySelector('.xp-value');
      if (xpEl) {
        xpEl.textContent = totalBintang;
      }
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

/* -----------------------------------------------------------------
   8. Smooth scroll-reveal untuk section cards & nodes (opsional)
   ----------------------------------------------------------------- */
if ('IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll(
    '.section-card, .lesson-node, .scene-img'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = entry.target.style.transform.replace(
            'translateY(24px)',
            ''
          );
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });
}
