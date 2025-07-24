document.addEventListener('DOMContentLoaded', () => {
  const branchSelect = document.getElementById('branchSelect');
  const popularGrid = document.getElementById('popularBranchesGrid');

  // Popuni dropdown granama iz firms.json
  fetch('assets/company-list/firms.json')
    .then(response => response.json())
    .then(data => {
      const branches = [...new Set(data.map(item => item.branch))].sort();
      branches.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = branch;
        branchSelect.appendChild(option);
      });
    })
    .catch(err => console.error('Greška pri učitavanju firms.json:', err));

  // Definiši popularne grane
  const popularBranches = [
    'Advokat',
    'Doktor',
    'Veterinar',
    'Knjigovođa'
  ];

  // Kreiraj grid popularnih grana
  popularBranches.forEach(branch => {
    const item = document.createElement('div');
    item.classList.add('popular-branch');

    const icon = document.createElement('img');
    icon.src = `assets/icons/${branch.toLowerCase()}.svg`;
    icon.alt = branch;
    icon.classList.add('popular-icon');

    const label = document.createElement('span');
    label.textContent = branch;

    item.append(icon, label);
    item.addEventListener('click', () => {
      branchSelect.value = branch;
      document.getElementById('searchForm').submit();
    });

    popularGrid.appendChild(item);
  });
});
