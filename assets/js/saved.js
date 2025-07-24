document.addEventListener('DOMContentLoaded', () => {
  const savedContainer = document.getElementById('savedContainer');
  const emptyState = document.getElementById('emptyState');

  const savedIds = JSON.parse(localStorage.getItem('saved') || '[]');

  if (!savedIds.length) {
    emptyState.classList.remove('hidden');
    return;
  }

  fetch('assets/company-list/firms.json')
    .then(res => res.json())
    .then(firms => {
      const savedFirms = firms.filter(firm => savedIds.includes(firm.id));
      if (!savedFirms.length) {
        emptyState.classList.remove('hidden');
        return;
      }

      // Display total count of saved services
      const countEl = document.createElement('div');
      countEl.className = 'saved-count';
      countEl.textContent = `You have ${savedFirms.length} saved services`;
      savedContainer.appendChild(countEl);

      savedFirms.forEach(firm => {
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h2');
        title.textContent = firm.naziv;

        const category = document.createElement('div');
        category.className = 'info';
        category.textContent = firm.kategorija.charAt(0).toUpperCase() + firm.kategorija.slice(1);

        const location = document.createElement('div');
        location.className = 'location';
        location.innerHTML = `<span class="material-icons">location_on</span> ${firm.grad}, ${firm.drzava}`;

        // Placeholder for reviews count
        const rating = document.createElement('div');
        rating.className = 'rating';
        rating.textContent = '(0 reviews)';

        const btn = document.createElement('button');
        btn.textContent = 'Open details';
        btn.addEventListener('click', () => window.location.href = `profile.html?firma=${firm.id}`);

        card.append(title, category, location, rating, btn);
        savedContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading firms:', error);
      emptyState.classList.remove('hidden');
    });
});
