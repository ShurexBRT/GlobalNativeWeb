document.addEventListener("DOMContentLoaded", () => {
  const langSwitcher = document.getElementById("lang-switcher");
  const langFilePath = (lang) => `assets/lang/${lang}.json`;

  function applyLocalization(data) {
    // Opšta i specifična lokalizacija putem data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (data[key]) {
        el.textContent = data[key];
      }
    });

    // index.html
    const heroTitle = document.querySelector(".hero-overlay h1");
    if (heroTitle && data.heroTitle) {
      heroTitle.textContent = data.heroTitle;
      document.querySelector(".hero-overlay p").textContent = data.heroSubtitle;
      document.querySelector(".top-rated h2").textContent = data.topRatedTitle;
      document.querySelector(".how-it-works h2").textContent = data.howItWorks;
      document.querySelector(".join h2").textContent = data.joinTitle;
      document.querySelector(".join .btn-cta").textContent = data.addCompanyBtn;
      document.querySelector("button[type='submit']").textContent = data.searchButton;

      const steps = document.querySelectorAll(".step p");
      if (steps.length >= 3) {
        steps[0].textContent = data.findService;
        steps[1].textContent = data.contactProvider;
        steps[2].textContent = data.leaveReview;
      }
    }

    // dodaj-firmu.html
    const formTitle = document.querySelector(".form-section h1");
    if (formTitle && data.addFirmTitle) {
      formTitle.textContent = data.addFirmTitle;
      document.querySelector(".form-section p").textContent = data.addFirmSubtitle;
      document.querySelector("button[type='submit']").textContent = data.submitFirm;
      const infoText = document.querySelector(".info");
      if (infoText) infoText.textContent = data.submissionInfo;
    }

    // profile.html
    const profileTitle = document.querySelector(".firm-profile h2");
    if (profileTitle && data.profileDescription) {
      document.querySelector(".firm-profile h2:nth-of-type(1)").textContent = data.profileDescription;
      document.querySelector(".firm-profile h2:nth-of-type(2)").textContent = data.profileContact;
      const webBtn = document.getElementById("firma-websajt");
      if (webBtn) webBtn.textContent = data.visitWebsite;
    }
  }

  function loadLang(lang) {
    fetch(langFilePath(lang))
      .then((res) => res.json())
      .then(applyLocalization)
      .catch((err) => console.error("Greška pri učitavanju jezika:", err));
  }

  if (langSwitcher) {
    langSwitcher.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      loadLang(selectedLang);
    });
  }

  // Učitaj podrazumevani jezik
  loadLang("sr");
});
