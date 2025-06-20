let currentReview = 0;

function displayReview() {
  const textEl = document.getElementById("review-text");
  const authorEl = document.getElementById("review-author");

  if (reviews.length === 0) return;

  const review = reviews[currentReview];
  textEl.textContent = `"${review.text}"`;
  authorEl.textContent = review.author;

  currentReview = (currentReview + 1) % reviews.length;
}

document.addEventListener("DOMContentLoaded", () => {
  displayReview();
  setInterval(displayReview, 2000);
});
