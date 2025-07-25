// assets/js/my-reviews.js

document.addEventListener('DOMContentLoaded', () => {
  const reviewsList = document.getElementById('reviewsList');
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const userName = profile.fullName;

  if (!userName) {
    reviewsList.innerHTML = '<p class="empty-state">No user profile found.</p>';
    return;
  }

  Promise.all([
    fetch('assets/company-list/reviews.json').then(r => r.json()),
    fetch('assets/company-list/firms.json').then(r => r.json())
  ])
  .then(([reviewsData, firms]) => {
    const userReviews = [];

    Object.entries(reviewsData).forEach(([firmId, reviews]) => {
      reviews.forEach(r => {
        if (r.user === userName) {
          userReviews.push({ firmId, rating: r.rating, comment: r.comment });
        }
      });
    });

    if (userReviews.length === 0) {
      reviewsList.innerHTML = '<p class="empty-state">You have not written any reviews yet.</p>';
      return;
    }

    userReviews.forEach(r => {
      const firm = firms.find(f => f.id === r.firmId) || {};
      const card = document.createElement('div');
      card.className = 'review';
      card.innerHTML = `
        <div class="meta">
          <a href="profile.html?firma=${encodeURIComponent(r.firmId)}">${firm.naziv || 'Unknown'}</a>
          <span>${'★'.repeat(r.rating)}</span>
        </div>
        <div class="text">${r.comment}</div>
      `;
      reviewsList.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    reviewsList.innerHTML = '<p class="empty-state">Error loading your reviews.</p>';
  });
});
