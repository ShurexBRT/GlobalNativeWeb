// assets/js/profile.js

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const companyId = params.get('firma');
  const companySection = document.getElementById('company-details');
  const reviewsSection = document.getElementById('reviews-section');

  if (!companyId) {
    companySection.innerHTML = '<p>Invalid company ID.</p>';
    return;
  }

  // Load firms and reviews together
  Promise.all([
    fetch('assets/company-list/firms.json').then(res => res.json()),
    fetch('assets/company-list/reviews.json').then(res => res.json())
  ])
  .then(([firms, reviewsData]) => {
    const firma = firms.find(f => f.id === companyId);
    if (!firma) {
      companySection.innerHTML = '<p>Company not found.</p>';
      return;
    }

    // Compute rating & count from reviews.json
    const reviews = reviewsData[companyId] || [];
    const count = reviews.length;
    const avg = count
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;
    const avgFixed = avg ? avg.toFixed(1) : '';

    // Check saved state
    const savedList = JSON.parse(localStorage.getItem('saved') || '[]');
    let isSaved = savedList.includes(firma.id);

    // Render profile details, rating, and Write Review button
    companySection.innerHTML = `
      <div class="profile-header">
        <h1>${firma.naziv}</h1>
        <button id="saveBtn" class="save-btn">
          ${isSaved ? 'Remove from saved' : 'Save to favorites'}
        </button>
      </div>
      <div class="rating">
        <span class="material-icons">star</span>
        ${avgFixed} · ${count} review${count !== 1 ? 's' : ''}
      </div>
      <div class="tags">
        <span class="tag">${capitalize(firma.kategorija)}</span>
        <span class="tag">${firma.jezici.map(capitalize).join(', ')}</span>
      </div>
      <div class="actions">
        <a href="tel:${firma.telefon}"><span class="material-icons">call</span> Call</a>
        <a href="mailto:${firma.email}"><span class="material-icons">email</span> Email</a>
        <a href="https://maps.google.com/?q=${encodeURIComponent(
          firma.adresa + ', ' + firma.grad + ', ' + firma.drzava
        )}" target="_blank">
          <span class="material-icons">open_in_new</span> Open in Maps
        </a>
      </div>
      <div class="location">
        <span class="material-icons">location_on</span> ${firma.adresa}, ${firma.grad}
      </div>
      <div class="description">
        ${firma.opis || 'No description available.'}
      </div>
      <button id="writeReview" class="write-review">
        <span class="material-icons">rate_review</span> Write a review
      </button>
    `;

    // Save/Remove handler
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
      const list = JSON.parse(localStorage.getItem('saved') || '[]');
      if (isSaved) {
        const idx = list.indexOf(firma.id);
        list.splice(idx, 1);
        saveBtn.textContent = 'Save to favorites';
      } else {
        list.push(firma.id);
        saveBtn.textContent = 'Remove from saved';
      }
      isSaved = !isSaved;
      localStorage.setItem('saved', JSON.stringify(list));
    });

    // Write Review button handler
    document
      .getElementById('writeReview')
      .addEventListener('click', () => {
        window.location.href = `write-review.html?firma=${encodeURIComponent(companyId)}`;
      });

    // Render reviews below
    if (reviews.length) {
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
    }
  })
  .catch(err => {
    console.error('Error loading profile data:', err);
    companySection.innerHTML = '<p>Error loading company details.</p>';
  });

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
});
