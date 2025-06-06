// Učitavanje JSON firme i prikaz rezultata
async function fetchCompanies() {
  const response = await fetch('assets/company-list/firme.json');
  const companies = await response.json();
  return companies;
}

// Filtriranje i prikaz rezultata
async function searchCompanies(filters = {}) {
  const companies = await fetchCompanies();
  const resultsSection = document.querySelector('.results-grid');
  if (!resultsSection) return;

  resultsSection.innerHTML = '';

  const filtered = companies.filter(company => {
    const categoryMatch = !filters.category || company.kategorija === filters.category;
    const languageMatch = !filters.languages || filters.languages.some(lang => company.jezici.includes(lang));
    return categoryMatch && languageMatch;
  });

  if (filtered.length === 0) {
    resultsSection.innerHTML = '<p>No results found.</p>';
    return;
  }

  filtered.forEach(firma => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="assets/icons/${firma.ikonica || 'default.png'}" alt="icon" class="icon">
      <h3>${firma.naziv}</h3>
      <p>${firma.grad} - ${firma.jezici.join(', ')}</p>
      <a href="profile.html?firma=${encodeURIComponent(firma.id)}">View Profile</a>
    `;
    resultsSection.appendChild(card);
  });
}

// Event za formu pretrage
const searchForm = document.getElementById('search-form');
if (searchForm) {
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const category = searchForm.querySelector('select[name="category"]').value;
    const languages = Array.from(searchForm.querySelectorAll('input[name="lang"]:checked')).map(cb => cb.value);
    await searchCompanies({ category, languages });
  });

  // Automatski poziv bez filtera na učitavanje
  searchCompanies();
}

// Prikaz profila firme
async function loadProfile() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('firma');
  if (!id) return;

  const companies = await fetchCompanies();
  const firma = companies.find(f => f.id === id);
  if (!firma) return;

  const container = document.querySelector('.firm-profile');
  if (!container) return;

  container.innerHTML = `
    <div class="profile-header">
      <img src="${firma.logo || 'https://via.placeholder.com/100'}" alt="Logo firme">
      <div class="profile-info">
        <h2>${firma.naziv}</h2>
        <p>${firma.grad}, ${firma.drzava}</p>
        <p>Govore jezike: ${firma.jezici.join(', ')}</p>
      </div>
    </div>
    <div class="profile-description">
      <p>${firma.opis}</p>
    </div>
    <div class="profile-contact">
      <p>Email: <a href="mailto:${firma.email}">${firma.email}</a></p>
      ${firma.telefon ? `<p>Telefon: <a href="tel:${firma.telefon}">${firma.telefon}</a></p>` : ''}
      ${firma.websajt ? `<p>Web: <a href="${firma.websajt}" target="_blank">${firma.websajt}</a></p>` : ''}
      <p>Adresa: ${firma.adresa}</p>
    </div>
  `;
}
loadProfile();
