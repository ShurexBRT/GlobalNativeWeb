document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/company-list/firms.json")
    .then((res) => res.json())
    .then((data) => {
      const topFirmeContainer = document.getElementById("top-firme");

      // === RANDOM 4 FIRME ZA PRIKAZ ===
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selectedFirms = shuffled.slice(0, 4);

      selectedFirms.forEach((firma) => {
        const card = document.createElement("div");
        card.className = "card";

        const icon = document.createElement("img");
        icon.src = `assets/icons/${firma.icon || 'default.png'}`;
        icon.alt = `${firma.kategorija} icon`;
        icon.className = "icon";

        const title = document.createElement("h3");
        title.textContent = firma.naziv;

        const lokacija = document.createElement("p");
        lokacija.textContent = `${firma.grad}, ${firma.drzava} – ${firma.jezici.join(", ")}`;

        const btn = document.createElement("a");
        btn.href = `profile.html?id=${firma.id}`;
        btn.className = "btn-cta";
        btn.textContent = "Vidi više";

        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(lokacija);
        card.appendChild(btn);

        topFirmeContainer.appendChild(card);
      });

      // === DINAMIČKO POPUNJAVANJE FILTERA ===
      const categorySelect = document.getElementById("category");
      const drzavaSelect = document.getElementById("drzava");
      const gradSelect = document.getElementById("grad");

      if (categorySelect && drzavaSelect && gradSelect) {
        const uniqueCategories = [...new Set(data.map(f => f.kategorija))];
        const uniqueDrzave = [...new Set(data.map(f => f.drzava))];

        // Dodaj kategorije
        uniqueCategories.sort().forEach(cat => {
          const option = document.createElement("option");
          option.value = cat;
          option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
          categorySelect.appendChild(option);
        });

        // Dodaj države
        uniqueDrzave.sort().forEach(drzava => {
          const option = document.createElement("option");
          option.value = drzava;
          option.textContent = drzava;
          drzavaSelect.appendChild(option);
        });

        // Kada se izabere država, ažuriraj gradove
        drzavaSelect.addEventListener("change", () => {
          const selectedDrzava = drzavaSelect.value;
          const gradovi = data
            .filter(f => f.drzava === selectedDrzava)
            .map(f => f.grad);
          const uniqueGradovi = [...new Set(gradovi)];

          gradSelect.innerHTML = '<option value="">-- Izaberi grad --</option>';
          uniqueGradovi.sort().forEach(grad => {
            const option = document.createElement("option");
            option.value = grad;
            option.textContent = grad;
            gradSelect.appendChild(option);
          });
        });
      }
    })
    .catch((err) => {
      console.error("Greška pri učitavanju firmi:", err);
    });
});
