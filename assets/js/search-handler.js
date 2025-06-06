document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const resultsContainer = document.getElementById("top-firme");

  if (!form || !resultsContainer) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedCategory = form.category.value;
    const selectedLanguages = Array.from(form.querySelectorAll("input[name='lang']:checked")).map(cb => cb.value.toLowerCase());
    const grad = form.grad?.value?.toLowerCase();
    const drzava = form.drzava?.value?.toLowerCase();

    try {
      const res = await fetch("assets/company-list/firms.json");
      const data = await res.json();

      const filtered = data.filter((firma) => {
        const matchCategory = !selectedCategory || firma.kategorija === selectedCategory;
        const matchLanguages = selectedLanguages.length === 0 || selectedLanguages.some(lang => firma.jezici.map(j => j.toLowerCase()).includes(lang));
        const matchGrad = !grad || firma.grad.toLowerCase().includes(grad);
        const matchDrzava = !drzava || firma.drzava.toLowerCase().includes(drzava);

        return matchCategory && matchLanguages && matchGrad && matchDrzava;
      });

      resultsContainer.innerHTML = "";

      if (filtered.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
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
    }
  });
});
