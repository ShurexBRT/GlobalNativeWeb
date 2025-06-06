document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const resultsContainer = document.getElementById("search-firme");
  const searchSection = document.getElementById("search-results");

  if (!form || !resultsContainer) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedCategory = form.category.value.toLowerCase();
    const selectedLanguages = Array.from(
      form.querySelectorAll("input[name='lang']:checked")
    ).map(cb => cb.value.toLowerCase());

    const grad = form.grad?.value?.trim().toLowerCase() || "";
    const drzava = form.drzava?.value?.trim().toLowerCase() || "";

    try {
      const res = await fetch("assets/company-list/firms.json");
      const data = await res.json();

      const filtered = data.filter(firma => {
        const kategorija = firma.kategorija?.toLowerCase() || "";
        const jezici = firma.jezici?.map(j => j.toLowerCase()) || [];
        const firmaGrad = firma.grad?.toLowerCase() || "";
        const firmaDrzava = firma.drzava?.toLowerCase() || "";

        const matchCategory = !selectedCategory || kategorija.includes(selectedCategory);
        const matchLanguages = selectedLanguages.length === 0 || selectedLanguages.some(lang => jezici.includes(lang));
        const matchGrad = !grad || firmaGrad.includes(grad);
        const matchDrzava = !drzava || firmaDrzava.includes(drzava);

        return matchCategory && matchLanguages && matchGrad && matchDrzava;
      });

      // Prikazuj sekciju i resetuj rezultate
      searchSection.style.display = "block";
      resultsContainer.innerHTML = "";

      if (filtered.length === 0) {
        resultsContainer.innerHTML = "<p>Nema rezultata pretrage.</p>";
        return;
      }

      filtered.forEach(firma => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="assets/icons/${firma.kategorija}.png" alt="${firma.kategorija}" class="icon" />
          <h3>${firma.naziv}</h3>
          <p>${firma.grad} – ${firma.jezici.join(", ")}</p>
          <a href="profile.html?firma=${firma.id}" class="btn-cta">Vidi više</a>
        `;
        resultsContainer.appendChild(card);
      });

    } catch (error) {
      console.error("Greška pri učitavanju firmi:", error);
      resultsContainer.innerHTML = "<p>Greška pri učitavanju podataka.</p>";
    }
  });
});
