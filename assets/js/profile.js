document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = parseInt(urlParams.get("firma"));
  const companySection = document.getElementById("companyDetails");
  const reviewsSection = document.getElementById("companyReviews");

  if (!companyId) {
    companySection.innerHTML = "<p>Invalid company ID.</p>";
    return;
  }

  // Učitaj podatke iz firms.json
  fetch("assets/company-list/firms.json")
    .then((res) => res.json())
    .then((firms) => {
      const firma = firms.find((f) => f.id === companyId);
      if (!firma) {
        companySection.innerHTML = "<p>Company not found.</p>";
        return;
      }

      const isSaved = JSON.parse(localStorage.getItem("saved") || "[]").includes(firma.id);

      companySection.innerHTML = `
        <div class="profile-header">
          <h1>${firma.name}</h1>
          <span class="badge">${firma.category}</span>
        </div>
        <div class="rating">
          ${"★".repeat(firma.rating || 0)} (${firma.reviews || 0} reviews)
        </div>
        <p class="desc">${firma.description || "No description available."}</p>
        <div class="location">
          <span class="material-icons">location_on</span> ${firma.city}, ${firma.country}
        </div>
        <div class="languages">
          <span class="material-icons">language</span>
          ${firma.languages.join(", ")}
        </div>
        <div class="actions">
          <a href="tel:${firma.phone}" class="btn-call">
            <span class="material-icons">call</span> Call
          </a>
          <a href="mailto:${firma.email}" class="btn-email">
            <span class="material-icons">mail</span> Email
          </a>
          <a href="https://maps.google.com/?q=${encodeURIComponent(firma.address)}" target="_blank" class="btn-map">
            <span class="material-icons">map</span> Map
          </a>
        </div>

        <div class="save-firm">
          <button id="saveBtn" class="save-btn">
            ${isSaved ? "Remove from saved" : "Save to favorites"}
          </button>
        </div>
      `;

      // Save/Remove from localStorage
      const saveBtn = document.getElementById("saveBtn");
      saveBtn.addEventListener("click", () => {
        const saved = JSON.parse(localStorage.getItem("saved") || "[]");
        const index = saved.indexOf(firma.id);

        if (index === -1) {
          saved.push(firma.id);
          saveBtn.textContent = "Remove from saved";
        } else {
          saved.splice(index, 1);
          saveBtn.textContent = "Save to favorites";
        }

        localStorage.setItem("saved", JSON.stringify(saved));
      });
    });

  // Učitaj recenzije
  fetch("assets/company-list/reviews.json")
    .then((res) => res.json())
    .then((reviewsData) => {
      const reviews = reviewsData[companyId] || [];

      if (reviews.length === 0) {
        reviewsSection.innerHTML = "";
        return;
      }

      reviewsSection.innerHTML = "<h2>Reviews</h2>";
      reviews.forEach((review) => {
        const reviewCard = document.createElement("div");
        reviewCard.className = "review-card";
        reviewCard.innerHTML = `
          <h4>${review.user}</h4>
          <div class="stars">${"★".repeat(review.rating)}</div>
          <p>${review.comment}</p>
        `;
        reviewsSection.appendChild(reviewCard);
      });
    });
});
