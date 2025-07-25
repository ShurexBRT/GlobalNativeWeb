// assets/js/search-handler.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const branch  = branchSelect.value;
    const drzava  = countrySelect.value;
    const grad    = citySelect.value;
    const params  = new URLSearchParams();
    if (branch)  params.set('branch', branch);
    if (drzava)  params.set('drzava', drzava);
    if (grad)    params.set('grad', grad);
    window.location.href = `results.html?${params.toString()}`;
  });
});
