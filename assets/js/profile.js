document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const firmaId = params.get("firma");
  const companySection = document.getElementById("company-details");
  const reviewSection = document.getElementById("reviews-section");

  if (!firmaId) {
    companySection.innerHTML = "<p>Company not found.</p>";
    return;
  }

  try {
    const [firmaRes, reviewRes] = await Promise.all([
      fetch("assets/company-list/firms.json"),
      fetch("assets/company-list/reviews.json")
    ]);

    const firme = await firmaRes.json();
    const reviews = await reviewRes.json();

    const firma = firme.find(f => String(f.id) === firmaId);
    if (!firma) {
      companySection.innerHTML = "<p>Company not found.</p>";
      return;
    }

    const recenzije = reviews.filter(r => String(r.companyId) === firmaId);

    // === Prikaz firme ===
    companySection.innerHTML = `
      <h1>${firma.naziv}</h1>
      <div class="rating">
        <span class="material-icons">star</span> ${firma.ocena || "4.5"} (${recenzije.length} reviews)
      </div>

      <div class="tags">
        <span class="tag">${firma.kategorija}</span>
        ${firma.jezici.map(lang => `<span class="tag">${lang}</span>`).join("")}
      </div>

      <div class="actions">
        ${firma.telefon ? `<a href="tel:${firma.telefon}"><span class="material-icons">call</span> Call</a>` : ""}
        ${firma.email ? `<a href="mailto:${firma.email}"><span class="material-icons">email</span> Email</a>` : ""}
        ${firma.grad && firma.drzava ? `<a href="https://www.google.com/maps/search/${firma.grad} ${firma.drzava}" target="_blank"><span class="material-icons">location_on</span> Map</a>` : ""}
      </div>

      <div class="location">
        ${firma.grad}, ${firma.drzava}
      </div>

      <div class="description">
        ${firma.opis || "No description available."}
      </div>
    `;

    // === Prikaz recenzija ===
    if (recenzije.length > 0) {
      reviewSection.innerHTML = `<h2>Reviews</h2>`;
      recenzije.forEach(r => {
        const div = document.createElement("div");
        div.className = "review";
        div.innerHTML = `
          <div class="meta">
            <span>${r.user}</span>
            <span>${r.date}</span>
          </div>
          <div class="text">
            <span class="material-icons" style="color:#ffaa00; vertical-align: bottom;">star</span> ${r.rating}
            <p>${r.comment}</p>
          </div>
        `;
        reviewSection.appendChild(div);
      });

      reviewSection.innerHTML += `
        <a href="write-review.html" class="write-review">Write a review</a>
      `;
    }

  } catch (err) {
    console.error("Greška:", err);
    companySection.innerHTML = "<p>Error loading company info.</p>";
  }
});
