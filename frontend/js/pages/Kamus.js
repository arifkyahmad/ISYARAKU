const dictionarySearch = document.getElementById('dictionarySearch');
const letterCards = [...document.querySelectorAll('.letter-card')];
const letterEmptyState = document.getElementById('letterEmptyState');
const lettersTab = document.getElementById('lettersTab');
const wordsTab = document.getElementById('wordsTab');
const lettersPanel = document.getElementById('lettersPanel');
const wordsPanel = document.getElementById('wordsPanel');
const categoryCards = [...document.querySelectorAll('.category-card')];
const categoryEmptyState = document.getElementById('categoryEmptyState');
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
    const matches = card.dataset.letter.includes(query);
    card.hidden = !matches;
    if (matches) visibleCards += 1;
  });

  categoryCards.forEach((card) => {
    const matches = card.dataset.category.includes(categoryQuery);
    card.hidden = !matches;
    if (matches) visibleCategories += 1;
  });

  letterEmptyState.hidden = visibleCards > 0;
  categoryEmptyState.hidden = visibleCategories > 0;
}

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
