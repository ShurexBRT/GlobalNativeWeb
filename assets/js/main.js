document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/company-list/firms.json")
    .then((res) => res.json())
    .then((data) => {
      const topFirmeContainer = document.getElementById("top-firme");

      // Uzmi random 4 firme
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
    })
    .catch((err) => {
      console.error("Greška pri učitavanju firmi:", err);
    });
});
