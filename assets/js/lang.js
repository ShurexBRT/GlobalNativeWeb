document.addEventListener("DOMContentLoaded", () => {
  const langSwitcher = document.getElementById("lang-switcher");
  const langFilePath = (lang) => `assets/lang/${lang}.json`;

  // Prevod svih elemenata sa data-i18n atributom
  function applyLocalization(data) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (data[key]) {
        el.textContent = data[key];
      }
    });
  }

  // Učitavanje prevoda
  function loadLang(lang) {
    fetch(langFilePath(lang))
      .then((res) => res.json())
      .then((data) => {
        applyLocalization(data);
      })
      .catch((err) => console.error("Greška pri učitavanju jezika:", err));
  }

  // Reaguje na izbor jezika
  if (langSwitcher) {
    langSwitcher.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      localStorage.setItem("lang", selectedLang); // zapamti izbor
      loadLang(selectedLang);
    });
  }

  // Učitaj jezik iz localStorage (ili default na sr)
  const savedLang = localStorage.getItem("lang") || "sr";
  if (langSwitcher) {
    langSwitcher.value = savedLang;
  }
  loadLang(savedLang);
});
