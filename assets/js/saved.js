// assets/js/saved.js

document.addEventListener('DOMContentLoaded', () => {
  const savedContainer = document.getElementById('savedContainer');
  const emptyState = document.getElementById('emptyState');
  const resetBtn = document.getElementById('resetSaved');

  resetBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  const savedIds = JSON.parse(localStorage.getItem('saved') || '[]');
  if (!savedIds.length) {
    emptyState.classList.remove('hidden');
    return;
  }

  fetch('assets/company-list/firms.json')
    .then(res => res.json())
    .then(firms => {
      const savedFirms = firms.filter(f => savedIds.includes(f.id));
      if (!savedFirms.length) {
        emptyState.classList.remove('hidden');
        return;
      }

      const countEl = document.createElement('div');
      countEl.className = 'saved-count';
      countEl.textContent = `You have ${savedFirms.length} saved services`;
      savedContainer.appendChild(countEl);

      savedFirms.forEach(firm => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';
        card.addEventListener('click', e => {
          if (e.target.closest('.btn-remove')) return;
          window.location.href = `profile.html?firma=${encodeURIComponent(firm.id)}`;
        });

        const title = document.createElement('h2');
        title.textContent = firm.naziv;

        const category = document.createElement('div');
        category.className = 'info';
        category.textContent = firm.kategorija.charAt(0).toUpperCase() + firm.kategorija.slice(1);

        const location = document.createElement('div');
        location.className = 'location';
        location.innerHTML = `<span class="material-icons">location_on</span> ${firm.grad}, ${firm.drzava}`;

        const rating = document.createElement('div');
        rating.className = 'rating';
        rating.textContent = `(${firm.rating?.toFixed(1) || '0.0'} · ${firm.reviewsCount || 0} reviews)`;

        const btnDetails = document.createElement('button');
        btnDetails.textContent = 'Open details';
        btnDetails.className = 'btn-details';
        btnDetails.addEventListener('click', e => {
          e.stopPropagation();
          window.location.href = `profile.html?firma=${encodeURIComponent(firm.id)}`;
        });

        const btnRemove = document.createElement('button');
        btnRemove.textContent = 'Remove';
        btnRemove.className = 'btn-remove';
        btnRemove.addEventListener('click', e => {
          e.stopPropagation();
          const idx = savedIds.indexOf(firm.id);
          if (idx > -1) {
            savedIds.splice(idx, 1);
            localStorage.setItem('saved', JSON.stringify(savedIds));
            card.remove();
            countEl.textContent = `You have ${savedIds.length} saved services`;
            if (!savedIds.length) emptyState.classList.remove('hidden');
          }
        });

        card.append(title, category, location, rating, btnDetails, btnRemove);
        savedContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error loading firms:', err);
      emptyState.classList.remove('hidden');
    });
});
