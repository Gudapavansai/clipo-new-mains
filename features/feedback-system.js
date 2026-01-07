/* ===================================
   FEEDBACK RATING SYSTEM JAVASCRIPT
   Add this to your js/script.js file
   =================================== */

// Star Rating Feedback System
class FeedbackSystem {
    constructor() {
        this.starRating = document.getElementById('starRating');
        this.ratingText = document.getElementById('ratingText');
        this.feedbackForm = document.getElementById('feedbackForm');
        this.feedbackSuccess = document.getElementById('feedbackSuccess');
        this.feedbackResetBtn = document.getElementById('feedbackResetBtn');
        this.totalRatingsElement = document.getElementById('totalRatings');
        this.averageScoreElement = document.getElementById('averageScore');
        this.starsDisplay = document.getElementById('starsDisplay');
        this.reviewsList = document.getElementById('reviewsList');

        this.ratingLabels = {
            1: 'Terrible 😞',
            2: 'Poor 😕',
            3: 'Average 😐',
            4: 'Good 😊',
            5: 'Excellent! 🎉'
        };

        this.init();
    }

    init() {
        if (!this.feedbackForm) return;

        this.attachEventListeners();
        this.updateAverageRating();
        this.displayRecentReviews();

        console.log('✅ Feedback system initialized');
    }

    attachEventListeners() {
        // Star hover and selection
        if (this.starRating) {
            const stars = this.starRating.querySelectorAll('label');
            const inputs = this.starRating.querySelectorAll('input');

            stars.forEach(star => {
                star.addEventListener('mouseenter', () => this.handleStarHover(star));
            });

            this.starRating.addEventListener('mouseleave', () => this.handleStarLeave());

            inputs.forEach(input => {
                input.addEventListener('change', () => this.handleStarSelect(input));
            });
        }

        // Form submission
        if (this.feedbackForm) {
            this.feedbackForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Reset button
        if (this.feedbackResetBtn) {
            this.feedbackResetBtn.addEventListener('click', () => this.resetForm());
        }
    }

    handleStarHover(star) {
        const rating = star.previousElementSibling.value;
        this.ratingText.textContent = this.ratingLabels[rating];
        this.ratingText.classList.add('selected');
    }

    handleStarLeave() {
        const checkedStar = this.starRating.querySelector('input:checked');
        if (checkedStar) {
            this.ratingText.textContent = this.ratingLabels[checkedStar.value];
        } else {
            this.ratingText.textContent = 'Select a rating';
            this.ratingText.classList.remove('selected');
        }
    }

    handleStarSelect(input) {
        this.ratingText.textContent = this.ratingLabels[input.value];
        this.ratingText.classList.add('selected');

        // Add vibration feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.feedbackForm);
        const rating = formData.get('rating');

        if (!rating) {
            this.showNotification('Please select a rating before submitting', 'error');
            return;
        }

        const feedbackData = {
            rating: parseInt(rating),
            name: formData.get('name') || 'Anonymous',
            email: formData.get('email') || '',
            comment: formData.get('comment') || '',
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent
        };

        // Show loading state
        this.feedbackForm.classList.add('loading');

        try {
            // Save to storage (choose your method)
            await this.saveToLocalStorage(feedbackData);

            // Uncomment the method you want to use:
            // await this.sendToServer(feedbackData);
            // await this.sendToGoogleSheets(feedbackData);

            // Show success message
            this.showSuccess();

            // Update displays
            this.updateAverageRating();
            this.displayRecentReviews();

            console.log('✅ Feedback submitted:', feedbackData);

        } catch (error) {
            console.error('❌ Error submitting feedback:', error);
            this.showNotification('Sorry, there was an error. Please try again.', 'error');
            this.feedbackForm.classList.remove('loading');
        }
    }

    // Storage Methods

    async saveToLocalStorage(feedbackData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let ratings = JSON.parse(localStorage.getItem('userRatings') || '[]');
                ratings.unshift(feedbackData); // Add to beginning

                // Keep only last 50 ratings
                if (ratings.length > 50) {
                    ratings = ratings.slice(0, 50);
                }

                localStorage.setItem('userRatings', JSON.stringify(ratings));
                resolve();
            }, 500); // Simulate network delay
        });
    }

    async sendToServer(feedbackData) {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        return await response.json();
    }

    async sendToGoogleSheets(feedbackData) {
        // Replace with your Google Apps Script Web App URL
        const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

        const formDataForSheet = new FormData();
        Object.keys(feedbackData).forEach(key => {
            formDataForSheet.append(key, feedbackData[key]);
        });

        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formDataForSheet
        });

        if (!response.ok) {
            throw new Error('Google Sheets error');
        }

        return await response.json();
    }

    // UI Methods

    showSuccess() {
        this.feedbackForm.style.display = 'none';
        this.feedbackSuccess.style.display = 'block';

        // Auto-reset after 5 seconds
        setTimeout(() => {
            this.resetForm();
        }, 5000);
    }

    resetForm() {
        this.feedbackForm.reset();
        this.feedbackForm.style.display = 'flex';
        this.feedbackSuccess.style.display = 'none';
        this.feedbackForm.classList.remove('loading');
        this.ratingText.textContent = 'Select a rating';
        this.ratingText.classList.remove('selected');
    }

    showNotification(message, type = 'info') {
        // Simple alert for now - you can replace with a fancy toast notification
        alert(message);
    }

    // Rating Display Methods

    updateAverageRating() {
        const ratings = JSON.parse(localStorage.getItem('userRatings') || '[]');

        if (ratings.length > 0) {
            const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
            const average = (sum / ratings.length).toFixed(1);

            if (this.averageScoreElement) {
                this.averageScoreElement.textContent = average;
            }

            if (this.totalRatingsElement) {
                this.totalRatingsElement.textContent = ratings.length;
            }

            // Update star display width
            const percentage = (average / 5) * 100;
            if (this.starsDisplay) {
                const starsFill = this.starsDisplay.querySelector('.stars-fill');
                if (starsFill) {
                    starsFill.style.width = `${percentage}%`;
                }
            }
        }
    }

    displayRecentReviews(limit = 5) {
        if (!this.reviewsList) return;

        const ratings = JSON.parse(localStorage.getItem('userRatings') || '[]');
        const recentRatings = ratings.slice(0, limit);

        if (recentRatings.length === 0) return;

        this.reviewsList.innerHTML = recentRatings.map(review => {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            const date = new Date(review.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `
        <div class="review-item">
          <div class="review-header">
            <span class="review-author">${this.escapeHtml(review.name)}</span>
            <span class="review-stars">${stars}</span>
          </div>
          <div class="review-date">${date}</div>
          ${review.comment ? `<p class="review-comment">${this.escapeHtml(review.comment)}</p>` : ''}
        </div>
      `;
        }).join('');

        // Show the reviews section
        const recentReviewsSection = document.getElementById('recentReviews');
        if (recentReviewsSection) {
            recentReviewsSection.style.display = 'block';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Analytics Methods

    getRatingDistribution() {
        const ratings = JSON.parse(localStorage.getItem('userRatings') || '[]');
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        ratings.forEach(review => {
            distribution[review.rating]++;
        });

        return distribution;
    }

    getAverageByDateRange(startDate, endDate) {
        const ratings = JSON.parse(localStorage.getItem('userRatings') || '[]');
        const filteredRatings = ratings.filter(review => {
            const reviewDate = new Date(review.timestamp);
            return reviewDate >= startDate && reviewDate <= endDate;
        });

        if (filteredRatings.length === 0) return 0;

        const sum = filteredRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / filteredRatings.length).toFixed(1);
    }

    exportRatings(format = 'json') {
        const ratings = JSON.parse(localStorage.getItem('userRatings') || '[]');

        if (format === 'json') {
            const dataStr = JSON.stringify(ratings, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportLink = document.createElement('a');
            exportLink.setAttribute('href', dataUri);
            exportLink.setAttribute('download', `ratings-export-${Date.now()}.json`);
            exportLink.click();
        } else if (format === 'csv') {
            const csvContent = this.convertToCSV(ratings);
            const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);

            const exportLink = document.createElement('a');
            exportLink.setAttribute('href', dataUri);
            exportLink.setAttribute('download', `ratings-export-${Date.now()}.csv`);
            exportLink.click();
        }
    }

    convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${value.toString().replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });

        return csvRows.join('\n');
    }
}

// Initialize Feedback System
let feedbackSystem;

function initFeedbackSystem() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            feedbackSystem = new FeedbackSystem();
        });
    } else {
        feedbackSystem = new FeedbackSystem();
    }
}

// Run initialization
initFeedbackSystem();

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackSystem;
}

// Console helper for debugging
window.getFeedbackStats = function () {
    if (!feedbackSystem) {
        console.log('Feedback system not initialized');
        return;
    }

    const ratings = JSON.parse(localStorage.getItem('userRatings') || '[]');
    const distribution = feedbackSystem.getRatingDistribution();

    console.log('📊 Feedback Statistics:', {
        totalReviews: ratings.length,
        distribution: distribution,
        averageRating: feedbackSystem.averageScoreElement?.textContent || 'N/A',
        lastReview: ratings[0] || null
    });
};
