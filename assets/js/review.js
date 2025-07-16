import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// === DOM elementi
const form = document.getElementById("reviewForm");
const starsContainer = document.getElementById("starsContainer");
const reviewText = document.getElementById("reviewText");
const visitDate = document.getElementById("visitDate");
const companyNameTitle = document.getElementById("companyName");

let selectedRating = 0;
let companyId = null;

// === Prikaz imena firme iz URL parametra
const params = new URLSearchParams(window.location.search);
companyId = params.get("firma");

if (!companyId) {
  alert("Missing company ID.");
  window.location.href = "index.html";
}

// === Učitavanje firme da bismo prikazali naziv
fetch("assets/company-list/firms.json")
  .then(res => res.json())
  .then(data => {
    const company = data.find(f => String(f.id) === companyId);
    if (company) {
      companyNameTitle.textContent = `Leave a review for ${company.naziv}`;
    }
  });

// === Zvezdice
for (let i = 1; i <= 5; i++) {
  const star = document.createElement("span");
  star.classList.add("material-icons");
  star.textContent = "star";
  star.dataset.value = i;

  star.addEventListener("click", () => {
    selectedRating = i;
    updateStars();
  });

  starsContainer.appendChild(star);
}

function updateStars() {
  const allStars = starsContainer.querySelectorAll(".material-icons");
  allStars.forEach((star, index) => {
    if (index < selectedRating) {
      star.classList.add("filled");
    } else {
      star.classList.remove("filled");
    }
  });
}

// === Submit forma
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const review = reviewText.value.trim();
  const date = visitDate.value;

  if (!selectedRating || !review || !date) {
    alert("All fields are required.");
    return;
  }

  if (review.length > 200) {
    alert("Review must be less than 200 characters.");
    return;
  }

  let userName = "Anonymous";

  await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        userName = user.displayName;
      }
      resolve();
    });
  });

  const newReview = {
    companyId: companyId,
    user: userName,
    rating: selectedRating,
    comment: review,
    date: date
  };

  // === Ovde ide slanje na server ili API (za sad samo loguj)
  console.log("Review saved:", newReview);

  // === Redirect posle slanja
  alert("Review submitted!");
  window.location.href = "index.html";
});
