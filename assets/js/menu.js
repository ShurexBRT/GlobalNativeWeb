// assets/js/menu.js

document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const menuDrawer = document.getElementById('menuDrawer');

  // Ako nema dugmeta ili drawer-a, ne radimo ništa
  if (!hamburgerBtn || !menuDrawer) return;

  // Otvaranje/zatvaranje menija
  hamburgerBtn.addEventListener('click', e => {
    e.stopPropagation();
    menuDrawer.classList.toggle('open');
  });

  // Zatvaranje menija klikom van njega
  document.addEventListener('click', e => {
    if (
      menuDrawer.classList.contains('open') &&
      !menuDrawer.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      menuDrawer.classList.remove('open');
    }
  });

  // Klik na stavke menija
  const items = menuDrawer.querySelectorAll('li');
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      menuDrawer.classList.remove('open');
      switch (index) {
        case 0:
          window.location.href = 'profile-user.html';
          break;
        case 1:
          window.location.href = 'saved.html';
          break;
        case 2:
          window.location.href = 'my-reviews.html';
          break;
        case 3:
          window.location.href = 'settings.html';
          break;
        case 4:
          window.location.href = 'welcome.html';
          break;
        default:
          break;
    
      }
    });
  })})