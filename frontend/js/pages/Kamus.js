const dictionarySearch = document.getElementById('dictionarySearch');
let letterCards = [];
const letterGrid = document.getElementById('letterGrid');
const letterStatusMessage = document.getElementById('letterStatusMessage');
const letterEmptyState = document.getElementById('letterEmptyState');
const lettersTab = document.getElementById('lettersTab');
const wordsTab = document.getElementById('wordsTab');
const lettersPanel = document.getElementById('lettersPanel');
const wordsPanel = document.getElementById('wordsPanel');
const categoryCards = [...document.querySelectorAll('.category-group, .category-card')];
const categoryEmptyState = document.getElementById('categoryEmptyState');
const schoolCategory = document.getElementById('schoolCategory');
const schoolWords = document.getElementById('schoolWords');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Buka sidebar');
  document.body.style.overflow = '';
}

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Tutup sidebar');
  document.body.style.overflow = 'hidden';
  sidebarClose.focus();
}

function filterLetters() {
  const query = dictionarySearch.value.trim().toLocaleUpperCase('id');
  const categoryQuery = dictionarySearch.value.trim().toLocaleLowerCase('id');
  let visibleCards = 0;
  let visibleCategories = 0;

  letterCards.forEach((card) => {
    const matches = (card.dataset.letter || '').toLocaleUpperCase('id').includes(query);
    card.hidden = !matches;
    if (matches) visibleCards += 1;
  });

  categoryCards.forEach((card) => {
    const matches = (card.dataset.category || '').includes(categoryQuery);
    card.hidden = !matches;
    if (matches) visibleCategories += 1;
  });

  if (letterEmptyState) {
    letterEmptyState.hidden = visibleCards > 0 || letterCards.length === 0;
  }
  if (categoryEmptyState) {
    categoryEmptyState.hidden = visibleCategories > 0;
  }
}

function getSupabase() {
  if (window.supabaseClient) return window.supabaseClient;
  if (typeof supabase !== "undefined" && typeof SUPABASE_URL !== "undefined" && typeof SUPABASE_PUBLISHABLE_KEY !== "undefined") {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    return window.supabaseClient;
  }
  return null;
}

const allowedHuruf = ['A', 'B', 'C', 'D', 'E', 'F'];
const allowedAngka = ['1', '2', '3', '4', '5', '6'];

async function muatDataKamus() {
  if (letterStatusMessage) {
    letterStatusMessage.hidden = false;
    letterStatusMessage.textContent = 'Memuat kamus...';
  }

  const client = getSupabase();
  if (!client) {
    if (letterStatusMessage) {
      letterStatusMessage.textContent = 'Gagal memuat kamus (koneksi database tidak tersedia).';
    }
    return;
  }

  try {
    const { data, error } = await client
      .from('kamus')
      .select('id, kata, jenis, video(url_path)')
      .in('jenis', ['alfabet', 'angka']);

    if (error) {
      if (letterStatusMessage) {
        letterStatusMessage.textContent = 'Gagal memuat kamus. Silakan coba lagi.';
      }
      return;
    }

    const items = (data || []).filter((item) => {
      const kataUpper = (item.kata || '').trim().toLocaleUpperCase('id');
      if (item.jenis === 'alfabet') {
        return allowedHuruf.includes(kataUpper);
      }
      if (item.jenis === 'angka') {
        return allowedAngka.includes(kataUpper);
      }
      return false;
    });

    items.sort((a, b) => {
      if (a.jenis !== b.jenis) {
        return a.jenis === 'alfabet' ? -1 : 1;
      }
      return (a.kata || '').localeCompare(b.kata || '', 'id', { numeric: true });
    });

    if (!letterGrid) return;
    letterGrid.innerHTML = '';

    if (items.length === 0) {
      if (letterStatusMessage) {
        letterStatusMessage.hidden = false;
        letterStatusMessage.textContent = 'Tidak ada kata yang tersedia.';
      }
      letterCards = [];
      filterLetters();
      return;
    }

    if (letterStatusMessage) {
      letterStatusMessage.hidden = true;
    }

    items.forEach((item) => {
      const kata = item.kata;
      const card = document.createElement('article');
      card.className = 'letter-card';
      card.dataset.letter = kata;
      card.style.cursor = 'pointer';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Pelajari isyarat ${kata}`);

      const span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = kata;
      card.appendChild(span);

      const kataUpper = (kata || '').trim().toLocaleUpperCase('id');
      if (item.jenis === 'alfabet' && allowedHuruf.includes(kataUpper)) {
        const img = document.createElement('img');
        img.src = `../assets/img/hand-illustration ${kataUpper}.svg`;
        img.alt = `Isyarat tangan huruf ${kataUpper}`;
        card.appendChild(img);
      }

      card.addEventListener('click', () => {
        window.location.href = `DetailKamus.html?id=${encodeURIComponent(item.id)}`;
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = `DetailKamus.html?id=${encodeURIComponent(item.id)}`;
        }
      });

      letterGrid.appendChild(card);
    });

    letterCards = [...document.querySelectorAll('.letter-card')];
    filterLetters();
  } catch (err) {
    if (letterStatusMessage) {
      letterStatusMessage.hidden = false;
      letterStatusMessage.textContent = 'Gagal memuat kamus. Terjadi kesalahan jaringan.';
    }
  }
}

muatDataKamus();

function selectTab(selectedTab) {
  const showingLetters = selectedTab === lettersTab;
  document.body.classList.toggle('dictionary-words-active', !showingLetters);
  lettersTab.classList.toggle('is-active', showingLetters);
  wordsTab.classList.toggle('is-active', !showingLetters);
  lettersTab.setAttribute('aria-selected', String(showingLetters));
  wordsTab.setAttribute('aria-selected', String(!showingLetters));
  lettersTab.tabIndex = showingLetters ? 0 : -1;
  wordsTab.tabIndex = showingLetters ? -1 : 0;
  lettersPanel.hidden = !showingLetters;
  wordsPanel.hidden = showingLetters;
}

dictionarySearch.addEventListener('input', filterLetters);
lettersTab.addEventListener('click', () => selectTab(lettersTab));
wordsTab.addEventListener('click', () => selectTab(wordsTab));

schoolCategory.addEventListener('click', () => {
  const isExpanded = schoolCategory.getAttribute('aria-expanded') === 'true';
  schoolCategory.setAttribute('aria-expanded', String(!isExpanded));
  schoolWords.hidden = isExpanded;
});

[lettersTab, wordsTab].forEach((tab) => {
  tab.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const nextTab = tab === lettersTab ? wordsTab : lettersTab;
      selectTab(nextTab);
      nextTab.focus();
    }
  });
});

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sidebar.classList.contains('open')) {
    closeSidebar();
  }
});

sidebar.querySelectorAll('.sidebar-item:not([href])').forEach((item) => {
  item.addEventListener('click', closeSidebar);
});
