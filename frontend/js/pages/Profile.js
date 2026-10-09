const profileSidebar = document.getElementById('sidebar');
const profileOverlay = document.getElementById('sidebarOverlay');
const profileMenuToggle = document.getElementById('menuToggle');
const profileSidebarClose = document.getElementById('sidebarClose');

function closeProfileSidebar() {
  profileSidebar.classList.remove('open');
  profileOverlay.classList.remove('active');
  profileMenuToggle.setAttribute('aria-expanded', 'false');
  profileMenuToggle.setAttribute('aria-label', 'Buka sidebar');
  document.body.style.overflow = '';
}

function openProfileSidebar() {
  profileSidebar.classList.add('open');
  profileOverlay.classList.add('active');
  profileMenuToggle.setAttribute('aria-expanded', 'true');
  profileMenuToggle.setAttribute('aria-label', 'Tutup sidebar');
  document.body.style.overflow = 'hidden';
  profileSidebarClose.focus();
}

profileMenuToggle.addEventListener('click', () => {
  if (profileMenuToggle.getAttribute('aria-expanded') === 'true') {
    closeProfileSidebar();
  } else {
    openProfileSidebar();
  }
});

profileSidebarClose.addEventListener('click', closeProfileSidebar);
profileOverlay.addEventListener('click', closeProfileSidebar);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && profileSidebar.classList.contains('open')) {
    closeProfileSidebar();
  }
});

document.getElementById('logoutAccount').addEventListener('click', async () => {
  if (!window.confirm('Kamu yakin ingin keluar dari akun saat ini?')) return;

  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    window.alert(`Gagal keluar: ${error.message}`);
    return;
  }

  window.location.href = 'SignIn.html';
});

document.getElementById('btnLogout').addEventListener('click', () => {
  document.getElementById('logoutAccount').click();
  closeProfileSidebar();
});

document.getElementById('deleteAccount').addEventListener('click', () => {
  window.alert('Untuk menghapus akun, silakan hubungi dukungan IsyaraKu.');
});

document.getElementById('btnDeleteAccount').addEventListener('click', () => {
  closeProfileSidebar();
  document.getElementById('deleteAccount').click();
});

async function loadProfile() {
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.error('Gagal memuat pengguna:', error.message);
    return;
  }

  const user = session?.user;
  if (!user) return;

  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Gagal memuat profil:', profileError.message);
  }

  const name = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name;
  const email = user.email;

  if (name) {
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileNameDetail').textContent = name;
  }

  if (email) {
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profileEmailDetail').textContent = email;
  }
}

loadProfile();
