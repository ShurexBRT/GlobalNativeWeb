document.addEventListener("DOMContentLoaded", () => {
  const langSwitcher = document.getElementById("lang-switcher");
  const langFilePath = (lang) => `assets/lang/${lang}.json`;

  function applyLocalization(data) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (data[key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = data[key];
        } else {
          el.textContent = data[key];
        }
      }
    });
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

  // Default language
  loadLang("sr");
});
