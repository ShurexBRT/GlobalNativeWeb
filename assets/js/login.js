// login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.textContent = '';

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!email || !password) {
    errorMessage.textContent = 'Please enter both email and password.';
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage.textContent = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage.textContent = 'This user is disabled.';
        break;
      case 'auth/user-not-found':
        errorMessage.textContent = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage.textContent = 'Incorrect password.';
        break;
      default:
        errorMessage.textContent = 'Login failed. Please try again.';
        break;
    }
  }
});
