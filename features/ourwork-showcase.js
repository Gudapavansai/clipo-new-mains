/* ==========================================
   OUR WORK SHOWCASE - INTERACTIVE FEATURES
   Tab switching and modal video playback
   ========================================== */

(function () {
    'use strict';

    // ===================================
    // 1. TAB SWITCHING FUNCTIONALITY
    // ===================================

    function initTabs() {
        const tabs = document.querySelectorAll('.ourwork-tab');
        const panels = document.querySelectorAll('.tab-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const targetTab = this.dataset.tab;

                // Remove active class from all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked tab and corresponding panel
                this.classList.add('active');
                const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }

                // Optional: Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'tab_click', {
                        'event_category': 'Our Work',
                        'event_label': targetTab
                    });
                }
            });
        });
    }

    // ===================================
    // 2. VIDEO MODAL FUNCTIONALITY
    // ===================================

    function initVideoModal() {
        const modal = document.getElementById('videoModal');
        const modalPlayer = document.getElementById('modalPlayer');
        const modalClose = document.querySelector('.modal-close');
        const modalOverlay = document.querySelector('.modal-overlay');
        const showcaseCards = document.querySelectorAll('.showcase-card');

        // Open modal when clicking play button or "Play in modal" link
        showcaseCards.forEach(card => {
            const playButton = card.querySelector('.play-button');
            const playLink = card.querySelector('.card-link');

            [playButton, playLink].forEach(trigger => {
                if (trigger) {
                    trigger.addEventListener('click', function (e) {
                        e.preventDefault();
                        openVideoModal(card);
                    });
                }
            });
        });

        // Close modal handlers
        const closeModal = () => {
            modal.classList.remove('active');
            // Clear video content after animation
            setTimeout(() => {
                modalPlayer.innerHTML = '';
            }, 300);

            // Re-enable body scroll
            document.body.style.overflow = '';
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function openVideoModal(card) {
        const modal = document.getElementById('videoModal');
        const modalPlayer = document.getElementById('modalPlayer');
        const videoType = card.dataset.type;
        const videoId = card.dataset.videoId;
        const videoUrl = card.dataset.videoUrl;

        let videoContent = '';

        // Create appropriate video embed based on type
        if (videoType === 'youtube') {
            videoContent = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    title="YouTube video player">
                </iframe>
            `;
        } else if (videoType === 'vimeo') {
            videoContent = `
                <iframe 
                    src="https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0" 
                    frameborder="0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowfullscreen
                    title="Vimeo video player">
                </iframe>
            `;
        } else if (videoType === 'native' && videoUrl) {
            videoContent = `
                <video 
                    controls 
                    autoplay 
                    playsinline
                    style="width: 100%; height: 100%; object-fit: contain;">
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        }

        // Inject video and show modal
        modalPlayer.innerHTML = videoContent;
        modal.classList.add('active');

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Optional: Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_play', {
                'event_category': 'Our Work',
                'event_label': videoId || videoUrl,
                'video_type': videoType
            });
        }
    }

    // ===================================
    // 3. SMOOTH SCROLL ENHANCEMENTS
    // ===================================

    function initSmoothScroll() {
        const showcases = document.querySelectorAll('.video-showcase');

        showcases.forEach(showcase => {
            let isDown = false;
            let startX;
            let scrollLeft;

            // Mouse drag scrolling
            showcase.addEventListener('mousedown', (e) => {
                isDown = true;
                showcase.style.cursor = 'grabbing';
                startX = e.pageX - showcase.offsetLeft;
                scrollLeft = showcase.scrollLeft;
            });

            showcase.addEventListener('mouseleave', () => {
                isDown = false;
                showcase.style.cursor = 'grab';
            });

            showcase.addEventListener('mouseup', () => {
                isDown = false;
                showcase.style.cursor = 'grab';
            });

            showcase.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - showcase.offsetLeft;
                const walk = (x - startX) * 2; // Scroll speed
                showcase.scrollLeft = scrollLeft - walk;
            });

            // Add grab cursor
            showcase.style.cursor = 'grab';
        });
    }

    // ===================================
    // 4. KEYBOARD NAVIGATION
    // ===================================

    function initKeyboardNav() {
        const tabs = document.querySelectorAll('.ourwork-tab');
        let currentIndex = 0;

        tabs.forEach((tab, index) => {
            if (tab.classList.contains('active')) {
                currentIndex = index;
            }
        });

        document.addEventListener('keydown', function (e) {
            // Only handle arrow keys when modal is not open
            if (document.getElementById('videoModal').classList.contains('active')) {
                return;
            }

            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                tabs[currentIndex].click();
                tabs[currentIndex].focus();
            } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
                currentIndex++;
                tabs[currentIndex].click();
                tabs[currentIndex].focus();
            }
        });
    }

    // ===================================
    // 5. INTERSECTION OBSERVER ANIMATIONS
    // ===================================

    function initScrollAnimations() {
        const cards = document.querySelectorAll('.showcase-card');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100); // Stagger animation

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // ===================================
    // 6. LAZY LOADING FOR VIDEO THUMBNAILS
    // ===================================

    function initLazyLoading() {
        const images = document.querySelectorAll('.card-thumbnail img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // Trigger loading
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // ===================================
    // 7. MOBILE TOUCH OPTIMIZATIONS
    // ===================================

    function initTouchOptimizations() {
        if (!('ontouchstart' in window)) return;

        const showcases = document.querySelectorAll('.video-showcase');

        showcases.forEach(showcase => {
            // Prevent vertical scroll when swiping horizontally
            let startY = 0;
            let startX = 0;

            showcase.addEventListener('touchstart', (e) => {
                startY = e.touches[0].pageY;
                startX = e.touches[0].pageX;
            }, { passive: true });

            showcase.addEventListener('touchmove', (e) => {
                const currentY = e.touches[0].pageY;
                const currentX = e.touches[0].pageX;
                const diffY = Math.abs(currentY - startY);
                const diffX = Math.abs(currentX - startX);

                // If scrolling more horizontally than vertically, prevent default
                if (diffX > diffY) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }

    // ===================================
    // 8. INITIALIZATION
    // ===================================

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all features
        initTabs();
        initVideoModal();
        initSmoothScroll();
        initKeyboardNav();
        initScrollAnimations();
        initLazyLoading();
        initTouchOptimizations();

        console.log('✅ Our Work Showcase initialized');
    }

    // Run initialization
    init();

})();
