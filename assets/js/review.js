// assets/js/review.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reviewForm');
  const stars = document.querySelectorAll('.stars .material-icons');
  const reviewText = document.getElementById('reviewText');
  const visitDate = document.getElementById('visitDate');
  const errorMsgs = document.querySelectorAll('.error-msg');
  const successMsg = document.querySelector('.success-msg');
  let selectedRating = 0;

  // Set max date to today
  visitDate.max = new Date().toISOString().split('T')[0];

  // Rating click handler
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.value);
      stars.forEach(s => s.classList.toggle('filled', parseInt(s.dataset.value) <= selectedRating));
    });
  });

  // Clear errors
  function clearErrors() {
    errorMsgs.forEach(e => e.textContent = '');
    stars.forEach(s => s.classList.remove('invalid'));
    reviewText.classList.remove('invalid');
    visitDate.classList.remove('invalid');
  }

  // Show error under field
  function showError(field, msg) {
    const err = document.querySelector(`.error-msg[data-for="${field}"]`);
    err.textContent = msg;
    if (field === 'rating') {
      document.querySelector('.stars').classList.add('invalid');
    } else {
      document.getElementById(field).classList.add('invalid');
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();
    successMsg.classList.add('hidden');

    let hasError = false;
    if (selectedRating === 0) {
      showError('rating', 'Please select a rating.');
      hasError = true;
    }
    if (!reviewText.value.trim()) {
      showError('reviewText', 'Review cannot be empty.');
      hasError = true;
    }
    if (!visitDate.value) {
      showError('visitDate', 'Select visit date.');
      hasError = true;
    }

    if (hasError) {
      // focus first invalid
      const firstErr = document.querySelector('.invalid');
      firstErr && firstErr.focus && firstErr.focus();
      return;
    }

    // TODO: actually POST review to backend
    // For MVP, just show success
    successMsg.classList.remove('hidden');
    form.reset();
    stars.forEach(s => s.classList.remove('filled'));
    selectedRating = 0;
  });
});
