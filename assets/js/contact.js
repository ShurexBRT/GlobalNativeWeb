// assets/js/contact.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    // Očisti stare greške
    form.querySelectorAll('.error-msg').forEach(el => el.remove());
    [name, email, message].forEach(f => f.classList.remove('invalid'));

    let valid = true;

    // Validacija
    if (!name.value.trim()) {
      showError(name, 'Name is required.');
      valid = false;
    }
    if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
      showError(email, 'Valid email is required.');
      valid = false;
    }
    if (!message.value.trim()) {
      showError(message, 'Message cannot be empty.');
      valid = false;
    }
    if (!valid) return;

    // Simulirano slanje
    form.reset();
    const success = document.createElement('div');
    success.className = 'success-msg';
    success.textContent = 'Thank you! Your message has been sent.';
    form.appendChild(success);
  });

  function showError(field, msg) {
    field.classList.add('invalid');
    const err = document.createElement('div');
    err.className = 'error-msg';
    err.textContent = msg;
    field.after(err);
  }
});
