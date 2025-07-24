// assets/js/profile.js

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get('firma');
  const companySection = document.getElementById('company-details');
  const reviewsSection = document.getElementById('reviews-section');

  if (!companyId) {
    companySection.innerHTML = '<p>Invalid company ID.</p>';
    return;
  }

  // Load firms data
  fetch('assets/company-list/firms.json')
    .then(res => res.json())
    .then(firms => {
      const firma = firms.find(f => f.id === companyId);
      if (!firma) {
        companySection.innerHTML = '<p>Company not found.</p>';
        return;
      }

      // Determine saved state
      const savedList = JSON.parse(localStorage.getItem('saved') || '[]');
      let isSaved = savedList.includes(firma.id);

      // Render profile details
      companySection.innerHTML = `
        <div class="profile-header">
          <h1>${firma.naziv}</h1>
          <button id="saveBtn" class="save-btn">
            ${isSaved ? 'Remove from saved' : 'Save to favorites'}
          </button>
        </div>
        <div class="rating">
          ${'★'.repeat(firma.rating || 0)} ${firma.rating ? firma.rating.toFixed(1) : ''} 
          <span>(${firma.reviewsCount || 0} reviews)</span>
        </div>
        <div class="tags">
          <span class="tag">${firma.kategorija.charAt(0).toUpperCase() + firma.kategorija.slice(1)}</span>
          <span class="tag">${firma.jezici.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}</span>
        </div>
        <div class="actions">
          <a href="tel:${firma.telefon}"><span class="material-icons">call</span> Call</a>
          <a href="mailto:${firma.email}"><span class="material-icons">email</span> Email</a>
          <a href="https://maps.google.com/?q=${encodeURIComponent(firma.adresa + ', ' + firma.grad + ', ' + firma.drzava)}" target="_blank">
            <span class="material-icons">open_in_new</span> Open in Maps
          </a>
        </div>
        <div class="location">
          <span class="material-icons">location_on</span> ${firma.adresa}, ${firma.grad}
        </div>
        <div class="description">
          ${firma.opis || 'No description available.'}
        </div>
      `;

      // Save/Remove handler
      const saveBtn = document.getElementById('saveBtn');
      saveBtn.addEventListener('click', () => {
        const list = JSON.parse(localStorage.getItem('saved') || '[]');
        if (list.includes(firma.id)) {
          // remove
          const idx = list.indexOf(firma.id);
          list.splice(idx, 1);
          saveBtn.textContent = 'Save to favorites';
          isSaved = false;
        } else {
          // add
          list.push(firma.id);
          saveBtn.textContent = 'Remove from saved';
          isSaved = true;
        }
        localStorage.setItem('saved', JSON.stringify(list));
      });
    })
    .catch(err => {
      console.error('Error loading firms:', err);
      companySection.innerHTML = '<p>Error loading company details.</p>';
    });

  // Load reviews
  fetch('assets/company-list/reviews.json')
    .then(res => res.json())
    .then(data => {
      const reviews = data[companyId] || [];
      if (!reviews.length) {
        return; // no reviews
      }
      reviewsSection.innerHTML = '<h2>Reviews</h2>';
      reviews.forEach(r => {
        const div = document.createElement('div');
        div.className = 'review';
        div.innerHTML = `
          <div class="meta">
            <span>${r.user}</span>
            <span>${'★'.repeat(r.rating)}</span>
          </div>
          <div class="text">${r.comment}</div>
        `;
        reviewsSection.appendChild(div);
      });
    })
    .catch(err => console.error('Error loading reviews:', err));
});
