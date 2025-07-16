document.addEventListener("DOMContentLoaded", async () => {
  const resultsContainer = document.getElementById("search-results");
  const infoContainer = document.getElementById("search-info");

  const params = new URLSearchParams(window.location.search);

  // Fail-safe: ako nema parametara, prekidamo i prikazujemo poruku
  if (![...params.keys()].length) {
    infoContainer.innerHTML = "";
    resultsContainer.innerHTML = `
      <div class="empty">
        <p>Please return to the home page and use the search form.</p>
      </div>
    `;
    console.warn("No search parameters found.");
    return;
  }

  const kategorija = params.get("kategorija") || "";
  const drzava = params.get("drzava") || "";
  const grad = params.get("grad") || "";
  const jezici = params.getAll("jezici");
  const sort = params.get("sort") || "az";

  try {
    const res = await fetch("assets/company-list/firms.json");
    const firms = await res.json();

    let filtered = firms.filter((firma) => {
      const matchKat = !kategorija || firma.kategorija?.toLowerCase() === kategorija.toLowerCase();
      const matchDrz = !drzava || firma.drzava?.toLowerCase() === drzava.toLowerCase();
      const matchGrad = !grad || firma.grad?.toLowerCase().includes(grad.toLowerCase());

      const matchLangs = jezici.length === 0 || jezici.some(lang => firma.jezici.includes(lang));
      return matchKat && matchDrz && matchGrad && matchLangs;
    });

    // Sortiranje
    if (sort === "az") {
      filtered.sort((a, b) => a.naziv.localeCompare(b.naziv));
    } else if (sort === "ocena") {
      filtered.sort((a, b) => (b.ocena || 0) - (a.ocena || 0));
    }

    // Info prikaz
    infoContainer.innerHTML = `
      <p><strong>${filtered.length}</strong> result(s) found.</p>
      <p>
        ${kategorija ? `Category: <b>${kategorija}</b>` : ""}
        ${grad ? ` | City: <b>${grad}</b>` : ""}
        ${jezici.length ? ` | Languages: <b>${jezici.join(", ")}</b>` : ""}
      </p>
    `;

    // Prikaz rezultata
    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="empty">
          <p>No results found. Try adjusting your filters.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((firma) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${firma.naziv}</h3>
        <p>${firma.kategorija} • ${firma.grad}, ${firma.drzava}</p>
        <img src="assets/placeholders/service.png" alt="${firma.naziv}" />
        <p class="rating"><span class="material-icons">star</span> ${firma.ocena || "4.5"}</p>
        <a href="profile.html?firma=${firma.id}" class="btn">View</a>
      `;
      resultsContainer.appendChild(card);
    });

  } catch (err) {
    console.error("Greška:", err);
    resultsContainer.innerHTML = `
      <div class="error">
        <p>Error loading results. Please try again later.</p>
      </div>
    `;
  }
});
