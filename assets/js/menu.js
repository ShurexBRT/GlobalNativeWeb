document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const menuDrawer = document.getElementById("menuDrawer");

  // Otvaranje/zatvaranje menija
  hamburgerBtn.addEventListener("click", () => {
    menuDrawer.classList.toggle("open");
  });

  // Zatvaranje menija klikom van njega
  document.addEventListener("click", (e) => {
    if (
      !menuDrawer.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      menuDrawer.classList.remove("open");
    }
  });

  // (Opcionalno) Klik na stavke – ovde se dodaju linkovi kad budu spremni
  const items = menuDrawer.querySelectorAll("li");
  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      menuDrawer.classList.remove("open");

      switch (index) {
        case 0:
          window.location.href = "profile-user.html";
          break;
        case 1:
          window.location.href = "saved.html";
          break;
        case 2:
          window.location.href = "my-reviews.html"; // kasnije
          break;
        case 3:
          window.location.href = "settings.html"; // kasnije
          break;
        case 4:
          // Firebase logout, redirect na welcome
          logoutUser();
          break;
      }
    });
  });

  function logoutUser() {
    import("https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js").then(({ getAuth, signOut }) => {
      const auth = getAuth();
      signOut(auth).then(() => {
        window.location.href = "welcome.html";
      }).catch((error) => {
        console.error("Logout error:", error);
      });
    });
  }
});
