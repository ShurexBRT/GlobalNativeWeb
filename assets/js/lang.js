document.addEventListener("DOMContentLoaded", () => {
  const langSwitcher = document.getElementById("lang-switcher");
  const langFilePath = (lang) => `assets/lang/${lang}.json`;

  function applyLocalization(data) {
    document.querySelector(".hero-overlay h1").textContent = data.heroTitle;
    document.querySelector(".hero-overlay p").textContent = data.heroSubtitle;
    document.querySelector(".top-rated h2").textContent = data.topRatedTitle;
    document.querySelector(".how-it-works h2").textContent = data.howItWorks;
    document.querySelector(".join h2").textContent = data.joinTitle;
    document.querySelector(".join .btn-cta").textContent = data.addCompanyBtn;
    document.querySelector("button[type='submit']").textContent = data.searchButton;

    // Steps
    const steps = document.querySelectorAll(".step p");
    if (steps.length >= 3) {
      steps[0].textContent = data.findService;
      steps[1].textContent = data.contactProvider;
      steps[2].textContent = data.leaveReview;
    }
  }

  function loadLang(lang) {
    fetch(langFilePath(lang))
      .then((res) => res.json())
      .then(applyLocalization)
      .catch((err) => console.error("Greška pri učitavanju jezika:", err));
  }

  langSwitcher.addEventListener("change", (e) => {
    const selectedLang = e.target.value;
    loadLang(selectedLang);
  });

  // Default load
  loadLang("sr");
});
