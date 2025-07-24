// assets/js/account.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('accountForm');
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const city = document.getElementById('city');
  const langContainer = document.getElementById('languagePills');
  const deleteBtn = document.getElementById('deleteAccount');
  const logoutBtn = document.getElementById('logoutBtn');
  const userNameEl = document.getElementById('userName');
  const userEmailEl = document.getElementById('userEmail');
  const avatarEl = document.getElementById('avatar');

  // Load profile from localStorage
  let profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  fullName.value = profile.fullName || '';
  email.value = profile.email || '';
  city.value = profile.city || '';
  userNameEl.textContent = profile.fullName || 'Your Name';
  userEmailEl.textContent = profile.email || 'you@example.com';
  if (profile.avatar) avatarEl.src = profile.avatar;

  // Fetch unique languages from firms.json
  fetch('assets/company-list/firms.json')
    .then(res => res.json())
    .then(firms => {
      const languages = [...new Set(firms.flatMap(f => f.jezici))].sort();
      languages.forEach(lang => {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
        if ((profile.languages || []).includes(lang)) pill.classList.add('selected');
        pill.addEventListener('click', () => {
          pill.classList.toggle('selected');
        });
        langContainer.appendChild(pill);
      });
    })
    .catch(err => console.error('Error loading languages:', err));

  form.addEventListener('submit', e => {
    e.preventDefault();
    profile.fullName = fullName.value;
    profile.email = email.value;
    profile.city = city.value;
    profile.languages = Array.from(langContainer.querySelectorAll('.selected')).map(p => p.textContent.toLowerCase());
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile saved!');
    userNameEl.textContent = profile.fullName;
    userEmailEl.textContent = profile.email;
  });

  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account?')) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('saved');
      window.location.href = 'welcome.html';
    }
  });

  logoutBtn.addEventListener('click', () => {
    window.location.href = 'welcome.html';
  });
});
