// assets/js/saved.js

function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

document.addEventListener('DOMContentLoaded', () => {
  const container  = document.getElementById('savedContainer');
  const empty      = document.getElementById('emptyState');
  const resetBtn   = document.getElementById('resetSaved');
  const savedIds   = JSON.parse(localStorage.getItem('saved')||'[]');

  resetBtn.addEventListener('click', ()=>{ location.href='index.html'; });

  if (!savedIds.length) {
    empty.classList.remove('hidden');
    return;
  }

  fetch('assets/company-list/firms.json')
    .then(r=>r.json())
    .then(firms => {
      const savedFirms = firms.filter(f=> savedIds.includes(f.id));
      if (!savedFirms.length) {
        empty.classList.remove('hidden');
        return;
      }

      // Count header
      const countEl = document.createElement('div');
      countEl.className = 'saved-count';
      countEl.textContent = `You have ${savedFirms.length} saved services`;
      container.appendChild(countEl);

      savedFirms.forEach(firm => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';

        // Navigate to profile unless clicking “Remove”
        card.addEventListener('click', e => {
          if (e.target.closest('.btn-remove')) return;
          location.href = `profile.html?firma=${encodeURIComponent(firm.id)}`;
        });

        // Title & info
        card.innerHTML = `
          <h2>${firm.naziv}</h2>
          <div class="info">${capitalize(firm.kategorija)}</div>
          <div class="location">
            <span class="material-icons">location_on</span> 
            ${firm.grad}, ${firm.drzava}
          </div>
          <div class="rating">(${(firm.rating||0).toFixed(1)} · ${firm.reviewsCount||0} reviews)</div>
        `;

        // Buttons
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const btnDetails = document.createElement('button');
        btnDetails.className = 'btn-details';
        btnDetails.textContent = 'Details';
        btnDetails.addEventListener('click', e => {
          e.stopPropagation();
          location.href = `profile.html?firma=${encodeURIComponent(firm.id)}`;
        });

        const btnRemove = document.createElement('button');
        btnRemove.className = 'btn-remove';
        btnRemove.textContent = 'Remove';
        btnRemove.addEventListener('click', e => {
          e.stopPropagation();
          const idx = savedIds.indexOf(firm.id);
          savedIds.splice(idx, 1);
          localStorage.setItem('saved', JSON.stringify(savedIds));
          card.remove();
          countEl.textContent = `You have ${savedIds.length} saved services`;
          if (!savedIds.length) empty.classList.remove('hidden');
        });

        actions.append(btnDetails, btnRemove);
        card.appendChild(actions);
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error loading saved firms:', err);
      empty.classList.remove('hidden');
    });
});
