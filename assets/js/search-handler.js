document.addEventListener('DOMContentLoaded', async () => {
  const resultsList = document.getElementById('resultsList');
  const spinner = document.getElementById('spinner');
  const emptyState = document.getElementById('emptyState');
  const resetBtn = document.getElementById('resetFilters');

  // Reset filters button
  resetBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Parse search parameters
  const params = new URLSearchParams(window.location.search);
  const branch = params.get('branch') || '';
  const country = params.get('drzava') || '';
  const city = params.get('grad') || '';

  // Fetch data
  let firms = [];
  try {
    const res = await fetch('assets/company-list/firms.json');
    firms = await res.json();
  } catch (err) {
    console.error('Error loading companies:', err);
    showEmpty();
    return;
  }

  // Filter data
  const filtered = firms.filter(firma => {
    const matchBranch = !branch || firma.kategorija.toLowerCase() === branch.toLowerCase();
    const matchCountry = !country || firma.drzava.toLowerCase() === country.toLowerCase();
    const matchCity = !city || firma.grad.toLowerCase().includes(city.toLowerCase());
    return matchBranch && matchCountry && matchCity;
  });

  // No results
  if (filtered.length === 0) {
    showEmpty();
    return;
  }

  // Category to icon mapping
  const categoryIconMap = {
    advokat: 'gavel',
    doktor: 'local_hospital',
    veterinar: 'pets',
    'knjigovođa': 'calculate',
    'knjigovodja': 'calculate',
    'auto-servis': 'build',
    električar: 'electrical_services',
    frizer: 'content_cut',
    'kafić': 'local_cafe',
    restoran: 'restaurant',
    pedijatar: 'local_hospital',
    stomatolog: 'local_hospital',
    prevodilac: 'g_translate',
    psiholog: 'psychology',
    moler: 'format_paint',
    vodoinstalater: 'plumbing'
  };

  // Utility functions
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getSaved() {
    try {
      return JSON.parse(localStorage.getItem('saved')) || [];
    } catch {
      return [];
    }
  }

  function toggleFavorite(id, iconEl) {
    const saved = getSaved();
    const idx = saved.indexOf(id);
    if (idx > -1) {
      saved.splice(idx, 1);
      iconEl.textContent = 'favorite_border';
    } else {
      saved.push(id);
      iconEl.textContent = 'favorite';
    }
    localStorage.setItem('saved', JSON.stringify(saved));
  }

  // Infinite scroll setup
  let page = 0;
  const pageSize = 10;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadPage();
      }
    });
  }, { rootMargin: '200px' });

  // Start loading
  loadPage();
  observer.observe(spinner);

  // Render a page of results
  function loadPage() {
    const start = page * pageSize;
    const end = start + pageSize;
    const chunk = filtered.slice(start, end);
    chunk.forEach(renderCard);
    page++;
    if (page * pageSize >= filtered.length) {
      spinner.classList.add('hidden');
      observer.disconnect();
    }
  }

  // Render individual card
  function renderCard(firma) {
    const card = document.createElement('div');
    card.className = 'card';

    // Header with title and favorite button
    const header = document.createElement('div');
    header.className = 'card-header';
    const title = document.createElement('h3');
    title.textContent = firma.naziv;
    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-btn';
    favBtn.setAttribute('aria-label', 'Save');
    const favIcon = document.createElement('span');
    favIcon.className = 'material-icons';
    favIcon.textContent = getSaved().includes(firma.id) ? 'favorite' : 'favorite_border';
    favBtn.appendChild(favIcon);
    favBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(firma.id, favIcon);
    });
    header.append(title, favBtn);

    // Subline with category icon and location
    const subline = document.createElement('p');
    subline.className = 'subline';
    const catIcon = document.createElement('span');
    catIcon.className = 'material-icons';
    catIcon.textContent = categoryIconMap[firma.kategorija] || 'work';
    subline.append(catIcon, document.createTextNode(' ' + capitalize(firma.kategorija)));
    subline.append(document.createTextNode(` • ${firma.grad}, ${firma.drzava}`));

    // Image
    const img = document.createElement('img');
    img.src = firma.slika;
    img.alt = firma.naziv;
    img.loading = 'lazy';

    // Tags: service type and languages
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags';
    const catPill = document.createElement('span');
    catPill.className = 'pill';
    catPill.textContent = capitalize(firma.kategorija);
    const langPill = document.createElement('span');
    langPill.className = 'pill';
    langPill.textContent = firma.jezici.join(', ');
    tagsDiv.append(catPill, langPill);

    // Address
    const addr = document.createElement('p');
    addr.className = 'address';
    const addrIcon = document.createElement('span');
    addrIcon.className = 'material-icons';
    addrIcon.textContent = 'location_on';
    addr.append(addrIcon, document.createTextNode(` ${firma.adresa}, ${firma.grad}`));

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'actions';
    const callBtn = document.createElement('button');
    callBtn.className = 'icon-btn';
    callBtn.setAttribute('aria-label', 'Call');
    callBtn.innerHTML = '<span class="material-icons">call</span>';
    callBtn.addEventListener('click', () => window.location.href = `tel:${firma.telefon}`);
    const emailBtn = document.createElement('button');
    emailBtn.className = 'icon-btn';
    emailBtn.setAttribute('aria-label', 'Email');
    emailBtn.innerHTML = '<span class="material-icons">email</span>';
    emailBtn.addEventListener('click', () => window.location.href = `mailto:${firma.email}`);
    const mapBtn = document.createElement('button');
    mapBtn.className = 'icon-btn';
    mapBtn.setAttribute('aria-label', 'Open in Maps');
    mapBtn.innerHTML = '<span class="material-icons">open_in_new</span>';
    mapBtn.addEventListener('click', () => window.open(
      `https://maps.google.com/?q=${encodeURIComponent(firma.adresa + ', ' + firma.grad + ', ' + firma.drzava)}`, '_blank'
    ));
    actions.append(callBtn, emailBtn, mapBtn);

    // Assemble card
    card.append(header, subline, img, tagsDiv, addr, actions);
    resultsList.appendChild(card);
  }

  // Show empty state
  function showEmpty() {
    spinner.classList.add('hidden');
    emptyState.classList.remove('hidden');
  }
});
