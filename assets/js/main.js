document.addEventListener('DOMContentLoaded', async () => {
  const branchSelect = document.getElementById('branchSelect');
  const countrySelect = document.getElementById('countrySelect');
  const citySelect = document.getElementById('citySelect');
  const popularGrid = document.getElementById('popularBranchesGrid');

  let data = [];
  try {
    const response = await fetch('assets/company-list/firms.json');
    data = await response.json();
  } catch (err) {
    console.error('Greška pri učitavanju firms.json:', err);
    return;
  }

  // Populate branch select
  const branches = [...new Set(data.map(item => item.kategorija))].sort();
  branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch;
    option.textContent = branch.charAt(0).toUpperCase() + branch.slice(1);
    branchSelect.appendChild(option);
  });

  // Handle branch selection to populate countries
  branchSelect.addEventListener('change', () => {
    const selectedBranch = branchSelect.value;
    const countries = [...new Set(
      data
        .filter(f => f.kategorija === selectedBranch)
        .map(f => f.drzava)
    )].sort();

    countrySelect.disabled = false;
    countrySelect.innerHTML = '<option value="">Bilo koja država</option>' +
      countries.map(c => `<option value="${c}">${c}</option>`).join('');

    // Reset city select
    citySelect.disabled = true;
    citySelect.innerHTML = '<option value="">Bilo koji grad</option>';
  });

  // Handle country selection to populate cities
  countrySelect.addEventListener('change', () => {
    const selectedBranch = branchSelect.value;
    const selectedCountry = countrySelect.value;
    const cities = [...new Set(
      data
        .filter(f => f.kategorija === selectedBranch && f.drzava === selectedCountry)
        .map(f => f.grad)
    )].sort();

    citySelect.disabled = false;
    citySelect.innerHTML = '<option value="">Bilo koji grad</option>' +
      cities.map(g => `<option value="${g}">${g}</option>`).join('');
  });

  // Populate popular branches grid
  const popularBranches = ['advokat', 'doktor', 'veterinar', 'knjigovođa'];
  popularBranches.forEach(branch => {
    const item = document.createElement('div');
    item.classList.add('popular-branch');

    const icon = document.createElement('img');
    icon.src = `assets/icons/${branch}.svg`;
    icon.alt = branch.charAt(0).toUpperCase() + branch.slice(1);
    icon.classList.add('popular-icon');

    const label = document.createElement('span');
    label.textContent = branch.charAt(0).toUpperCase() + branch.slice(1);

    item.append(icon, label);
    item.addEventListener('click', () => {
      // Set branch and reset subsequent selects
      branchSelect.value = branch;
      branchSelect.dispatchEvent(new Event('change'));
      // Submit form
      document.getElementById('searchForm').submit();
    });

    popularGrid.appendChild(item);
  });
});
