document.addEventListener("DOMContentLoaded", async () => {
  const branchList = document.getElementById("branchList");
  const resultsList = document.getElementById("resultsList");

  try {
    const res = await fetch("assets/company-list/firms.json");
    const firms = await res.json();

    // === GENERIŠEMO BRANCH LIST ===
    const branchMap = new Map();
    firms.forEach(f => {
      const kat = f.kategorija;
      if (kat) {
        branchMap.set(kat, (branchMap.get(kat) || 0) + 1);
      }
    });

    const sortedBranches = [...branchMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6); // top 6

    sortedBranches.forEach(([kategorija, count]) => {
      const div = document.createElement("div");
      div.className = "branch-card";
      div.innerHTML = `
        <i class="material-icons">business</i>
        <h3>${kategorija}</h3>
        <p>${count} providers</p>
      `;
      branchList.appendChild(div);
    });

    // === TOP-RATED RANDOM FIRME ===
    const shuffled = [...firms].sort(() => 0.5 - Math.random()).slice(0, 4);
    shuffled.forEach(f => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${f.naziv}</h3>
        <p>${f.kategorija} • ${f.grad}, ${f.drzava}</p>
        <img src="assets/placeholders/service.png" alt="${f.naziv}" style="width:100%; border-radius: 6px; margin: 0.5rem 0;" />
        <p class="rating"><span class="material-icons">star</span> ${f.ocena || "4.5"}</p>
        <a href="profile.html?firma=${f.id}" class="btn">View</a>
      `;
      resultsList.appendChild(card);
    });
  } catch (err) {
    console.error("Greška pri učitavanju firmi:", err);
    branchList.innerHTML = `<p>Greška u učitavanju podataka.</p>`;
    resultsList.innerHTML = `<p>Greška u učitavanju firmi.</p>`;
  }
});
