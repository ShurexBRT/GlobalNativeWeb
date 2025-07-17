document.addEventListener("DOMContentLoaded", () => {
  const savedContainer = document.getElementById("savedContainer");
  const emptyState = document.getElementById("emptyState");

  const savedIds = JSON.parse(localStorage.getItem("saved") || "[]");

  if (!savedIds.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  fetch("assets/company-list/firms.json")
    .then(res => res.json())
    .then(firms => {
      const savedFirms = firms.filter(firm => savedIds.includes(firm.id));

      if (!savedFirms.length) {
        emptyState.classList.remove("hidden");
        return;
      }

      savedFirms.forEach(firm => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <h2>${firm.name}</h2>
          <div class="info">${firm.category}</div>
          <div class="location"><span class="material-icons">location_on</span> ${firm.city}, ${firm.country}</div>
          <div class="rating">
            ${"★".repeat(firm.rating || 0)}
            <span>(${firm.reviews || 0} reviews)</span>
          </div>
          <button onclick="window.location.href='profile.html?firma=${firm.id}'">
            Open details
          </button>
        `;

        savedContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error loading firms:", error);
      emptyState.classList.remove("hidden");
    });
});
