document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("search-form");
  const resultSection = document.querySelector(".top-rated .card-grid");

  if (!form || !resultSection) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const selectedCategory = form.category.value;
    const selectedLanguages = Array.from(
      form.querySelectorAll("input[name='lang']:checked")
    ).map((input) => input.value);

    try {
      const res = await fetch("assets/data/companies.json");
      const companies = await res.json();

      const filtered = companies.filter((company) => {
        const matchCategory = selectedCategory
          ? company.kategorija === selectedCategory
          : true;
        const matchLanguage = selectedLanguages.length
          ? company.jezici.some((lang) => selectedLanguages.includes(lang))
          : true;
        return matchCategory && matchLanguage;
      });

      // Prikaz rezultata
      resultSection.innerHTML = "";

      if (filtered.length === 0) {
        resultSection.innerHTML = "<p>No matching companies found.</p>";
        return;
      }

      filtered.forEach((company) => {
        resultSection.innerHTML += `
          <div class="card">
            <img src="assets/icons/${company.ikonica}" alt="${company.kategorija} icon" class="icon">
            <h3>${company.naziv}</h3>
            <p>${company.grad} - ${company.jezici.map(lang => `🇺🇳 ${lang}`).join(', ')}</p>
            <p>${company.opis || ""}</p>
          </div>
        `;
      });
    } catch (error) {
      console.error("Greška pri učitavanju firmi:", error);
    }
  });
});
