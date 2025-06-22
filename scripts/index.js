// This script handles the display of reviews on the home page

// Variable to hold reviews
let currentReview = 0;

// Function displays review on the home page
function displayReview() {
    const textEl = document.getElementById("review-text");
    const authorEl = document.getElementById("review-author");

    // Ensure the reviews array is defined and has elements
    if (reviews.length === 0) return;

    const review = reviews[currentReview];
    textEl.textContent = `"${review.text}"`;
    authorEl.textContent = review.author;

    currentReview = (currentReview + 1) % reviews.length;
}

document.addEventListener("DOMContentLoaded", () => {
    // Calls review function on the page
    displayReview();

    // Set interval to change review every 2 seconds
    setInterval(displayReview, 2000);
});
