// assets/js/settings.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('settingsForm');
  const notifEmail = document.getElementById('notifEmail');
  const notifSMS = document.getElementById('notifSMS');
  const langContainer = document.getElementById('settingsLangPills');

  // Učitaj prethodna podešavanja
  const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  notifEmail.checked = settings.notifEmail || false;
  notifSMS.checked = settings.notifSMS || false;
  const savedlangs = settings.languages || [];

  // Generiši jezičke “pill-e” iz firms.json
  fetch('assets/company-list/firms.json')
    .then(res => res.json())
    .then(firms => {
      const languages = [...new Set(firms.flatMap(f => f.jezici))].sort();
      languages.forEach(lang => {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
        if (savedlangs.includes(lang)) pill.classList.add('selected');
        pill.addEventListener('click', () => pill.classList.toggle('selected'));
        langContainer.appendChild(pill);
      });
    })
    .catch(err => console.error('Error loading languages:', err));

  // Sačuvaj podešavanja
  form.addEventListener('submit', e => {
    e.preventDefault();
    const selectedLangs = Array.from(
      langContainer.querySelectorAll('.pill.selected')
    ).map(p => p.textContent.toLowerCase());
    const newSettings = {
      notifEmail: notifEmail.checked,
      notifSMS: notifSMS.checked,
      languages: selectedLangs
    };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    alert('Settings saved!');
  });
});
