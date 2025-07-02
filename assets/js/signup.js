// signup.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');
const googleBtn = document.getElementById('googleSignUp');

// Google sign-up
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = 'index.html';
    } catch (error) {
      errorMessage.textContent = 'Google sign-up failed.';
    }
  });
}

// Email/password sign-up
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.textContent = '';

  const name = signupForm.fullName.value.trim();
  const email = signupForm.email.value.trim();
  const password = signupForm.password.value;
  const confirmPassword = signupForm.confirmPassword.value;

  if (!name || !email || !password || !confirmPassword) {
    errorMessage.textContent = 'All fields are required.';
    return;
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = 'Passwords do not match.';
    return;
  }

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    errorMessage.textContent = 'Password must be at least 8 characters, include a capital letter, a number and a symbol.';
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage.textContent = 'Email already in use.';
        break;
      case 'auth/invalid-email':
        errorMessage.textContent = 'Invalid email address.';
        break;
      case 'auth/weak-password':
        errorMessage.textContent = 'Weak password.';
        break;
      default:
        errorMessage.textContent = 'Signup failed. Please try again.';
        break;
    }
  }
});
