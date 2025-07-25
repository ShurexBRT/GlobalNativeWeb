// assets/js/main.js

const categoryIconMap = {
  frizer: 'content_cut',
  doktor: 'local_hospital',
  pravnik: 'gavel',
  stupak: 'build',
  // add your other categories here...
};

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
  const branchSelect  = document.getElementById('branchSelect');
  const countrySelect = document.getElementById('countrySelect');
  const citySelect    = document.getElementById('citySelect');
  const branchList    = document.getElementById('branchList');

  fetch('assets/company-list/firms.json')
    .then(r => r.json())
    .then(firms => {
      // 1) Unique lists
      const branches = [...new Set(firms.map(f => f.kategorija))].sort();
      const countries = [...new Set(firms.map(f => f.drzava))].sort();
      const allCities = [...new Set(firms.map(f => f.grad))].sort();

      // 2) Populate branch & country & city selects
      branches.forEach(b => {
        const o = new Option(capitalize(b), b);
        branchSelect.add(o);
      });
      countries.forEach(c => {
        const o = new Option(capitalize(c), c);
        countrySelect.add(o);
      });
      allCities.forEach(c => {
        const o = new Option(capitalize(c), c);
        citySelect.add(o);
      });

      // 3) When country changes, filter cities
      countrySelect.addEventListener('change', () => {
        const sel = countrySelect.value;
        citySelect.length = 1; // keep “Any city”
        const filtered = sel
          ? firms.filter(f => f.drzava === sel).map(f => f.grad)
          : allCities;
        [...new Set(filtered)].sort().forEach(ct => {
          citySelect.add(new Option(capitalize(ct), ct));
        });
      });

      // 4) Render top 4 popular branches
      branches.slice(0, 4).forEach(b => {
        const icon = categoryIconMap[b] || 'work';
        const card = document.createElement('div');
        card.className = 'branch-card';
        card.innerHTML = `<i class="material-icons">${icon}</i><h3>${capitalize(b)}</h3>`;
        card.addEventListener('click', () => {
          branchSelect.value = b;
          document.getElementById('searchForm').dispatchEvent(new Event('submit'));
        });
        branchList.appendChild(card);
      });
    })
    .catch(console.error);
});
