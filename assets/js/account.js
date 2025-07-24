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

  // Supported languages
  const languages = ['Russian','German','Spanish','Ukrainian'];

  // Load or init profile
  let profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  // Populate fields
  fullName.value = profile.fullName || '';
  email.value = profile.email || '';
  city.value = profile.city || '';
  userNameEl.textContent = profile.fullName || 'Your Name';
  userEmailEl.textContent = profile.email || 'you@example.com';
  if (profile.avatar) avatarEl.src = profile.avatar;

  // Render language pills
  languages.forEach(lang => {
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = lang;
    if ((profile.languages||[]).includes(lang)) pill.classList.add('selected');
    pill.addEventListener('click', () => {
      pill.classList.toggle('selected');
    });
    langContainer.appendChild(pill);
  });

  // Save changes
  form.addEventListener('submit', e => {
    e.preventDefault();
    profile.fullName = fullName.value;
    profile.email = email.value;
    profile.city = city.value;
    profile.languages = Array.from(langContainer.querySelectorAll('.selected')).map(p=>p.textContent);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile saved!');
    // Update preview
    userNameEl.textContent = profile.fullName;
    userEmailEl.textContent = profile.email;
  });

  // Delete account
  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account?')) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('saved');
      window.location.href = 'welcome.html';
    }
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    // Clear session if any
    window.location.href = 'welcome.html';
  });
});