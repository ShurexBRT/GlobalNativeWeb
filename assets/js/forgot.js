import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const forgotForm = document.getElementById("forgot-form");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");

forgotForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  message.textContent = "";

  if (!email) {
    message.textContent = "Please enter your email address.";
    message.style.color = "#d32f2f";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    message.textContent = "Reset link sent! Please check your email.";
    message.style.color = "#1b8f5e";
    forgotForm.reset();
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        message.textContent = "No account found with this email.";
        break;
      case "auth/invalid-email":
        message.textContent = "Invalid email address.";
        break;
      default:
        message.textContent = "Something went wrong. Try again later.";
        break;
    }
    message.style.color = "#d32f2f";
  }
});
