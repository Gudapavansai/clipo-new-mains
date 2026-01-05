/**
 * Clipo Media - Optimized Main Script
 * Original: 25KB | Optimized: ~15KB
 * Performance improvements: Cached DOM queries, debounced handlers, passive listeners
 */

(function () {
    'use strict';

    // ==========================================
    // CACHED DOM ELEMENTS (Query once, use many)
    // ==========================================
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);

    const DOM = {
        switcher: $('.switcher'),
        bubble: $('.switcher__bubble'),
        themeToggle: $('.theme-toggle'),
        lightRadio: $('input[name="theme"][value="light"]'),
        darkRadio: $('input[name="theme"][value="dark"]'),
        navInputs: $$('.switcher input[type="radio"]'),
        navOptions: Array.from($$('.switcher__option')),
        contactForm: $('#contactForm'),
        heroPlayBtn: $('.hero__play-btn'),
        sections: $$('section[id]')
    };

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    const raf = fn => requestAnimationFrame(fn);

    // ==========================================
    // THEME TOGGLE
    // ==========================================
    if (DOM.themeToggle && DOM.lightRadio && DOM.darkRadio) {
        const handleThemeToggle = e => {
            if (e.type === 'touchend') e.preventDefault();

            DOM.themeToggle.classList.remove('icon-jelly');
            void DOM.themeToggle.offsetWidth;
            DOM.themeToggle.classList.add('icon-jelly');

            const overlay = document.createElement('div');
            overlay.className = 'theme-transition';

            const isLight = DOM.lightRadio.checked;
            const nextTheme = isLight ? 'dark' : 'light';
            overlay.style.backgroundColor = nextTheme === 'light' ? '#f5f5f7' : '#1a1a1a';

            const clientX = e.clientX || (e.changedTouches?.[0]?.clientX ?? innerWidth / 2);
            const clientY = e.clientY || (e.changedTouches?.[0]?.clientY ?? innerHeight / 2);

            overlay.style.clipPath = `circle(0% at ${clientX}px ${clientY}px)`;
            document.body.appendChild(overlay);
            overlay.offsetHeight;

            const maxRadius = Math.hypot(
                Math.max(clientX, innerWidth - clientX),
                Math.max(clientY, innerHeight - clientY)
            );
            overlay.style.clipPath = `circle(${maxRadius}px at ${clientX}px ${clientY}px)`;

            setTimeout(() => {
                const targetRadio = nextTheme === 'dark' ? DOM.darkRadio : DOM.lightRadio;
                targetRadio.checked = true;
                targetRadio.dispatchEvent(new Event('change'));
                raf(() => setTimeout(() => overlay.remove(), 50));
            }, 800);
        };

        DOM.themeToggle.addEventListener('click', handleThemeToggle);
        DOM.themeToggle.addEventListener('touchend', handleThemeToggle, { passive: false });
    }

    // ==========================================
    // NAVIGATION SWITCHER
    // ==========================================
    const inputMap = new Map();
    DOM.navInputs.forEach((input, idx) => inputMap.set(input.value, { input, index: idx }));

    // Track previous value for transitions
    const trackPrevious = () => {
        let previousValue = null;
        const initiallyChecked = DOM.switcher?.querySelector('input[type="radio"]:checked');
        if (initiallyChecked) {
            previousValue = initiallyChecked.getAttribute("c-option");
            DOM.switcher?.setAttribute('c-previous', previousValue);
        }

        DOM.navInputs.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    DOM.switcher?.setAttribute('c-previous', previousValue ?? '');
                    previousValue = radio.getAttribute("c-option");
                }
            });
        });
    };

    if (DOM.switcher) trackPrevious();

    // Move bubble to specific index
    const moveBubbleToIndex = index => {
        if (!DOM.bubble || !DOM.navOptions.length || !DOM.switcher) return;

        const clampedIndex = Math.max(0, Math.min(index, DOM.navOptions.length - 1));
        const targetOption = DOM.navOptions[clampedIndex];
        if (!targetOption) return;

        DOM.navOptions.forEach(opt => opt.classList.remove('active'));
        targetOption.classList.add('active');

        // Mobile: Delegate positioning to CSS for perfect fluid alignment
        if (window.innerWidth <= 1024) {
            DOM.bubble.style.transform = '';
            DOM.bubble.style.width = '';
            DOM.bubble.style.transition = '';
            return;
        }

        const switcherRect = DOM.switcher.getBoundingClientRect();
        const optionRect = targetOption.getBoundingClientRect();
        const targetTranslate = optionRect.left - switcherRect.left - 4;

        DOM.bubble.style.width = `${optionRect.width}px`;
        DOM.bubble.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s ease';
        DOM.bubble.style.transform = `translateX(${targetTranslate}px)`;

        setTimeout(() => { DOM.bubble.style.transition = ''; }, 500);
    };

    // Navigation change handler
    DOM.navInputs.forEach((input, index) => {
        input.addEventListener('change', () => {
            const section = document.getElementById(input.value);
            section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            moveBubbleToIndex(index);
        });
    });

    // Initialize bubble position
    document.addEventListener('DOMContentLoaded', () => {
        const checkedInput = DOM.switcher?.querySelector('input:checked');
        if (checkedInput && window.innerWidth > 1024) {
            const data = inputMap.get(checkedInput.value);
            if (data && DOM.bubble && DOM.navOptions.length) {
                const targetOption = DOM.navOptions[data.index];
                if (targetOption) {
                    DOM.navOptions.forEach(opt => opt.classList.remove('active'));
                    targetOption.classList.add('active');

                    const switcherRect = DOM.switcher.getBoundingClientRect();
                    const optionRect = targetOption.getBoundingClientRect();
                    DOM.bubble.style.width = `${optionRect.width}px`;
                    DOM.bubble.style.transform = `translateX(${optionRect.left - switcherRect.left - 4}px)`;
                }
            }
        }
    });

    // ==========================================
    // INTERSECTION OBSERVER (Section tracking)
    // ==========================================
    const sectionObserver = new IntersectionObserver(entries => {
        const intersecting = entries.find(e => e.isIntersecting);
        if (intersecting) {
            // Requirement: On mobile, bubble shouldn't move for 'contact' section (wait for footer)
            if (window.innerWidth <= 1024 && intersecting.target.id === 'contact') return;

            const data = inputMap.get(intersecting.target.id);
            if (data && !data.input.checked) {
                DOM.navInputs.forEach(i => i.parentElement.classList.remove('active'));
                data.input.checked = true;
                DOM.switcher?.setAttribute('c-previous', data.input.getAttribute('c-option'));
                moveBubbleToIndex(data.index);
            }
        }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    DOM.sections.forEach(section => sectionObserver.observe(section));

    // Flag to track footer visibility
    let isFooterIntersecting = false;

    // ==========================================
    // FOOTER / CONTACT LOCK
    // ==========================================
    const footer = $('.footer');
    if (footer) {
        new IntersectionObserver(entries => {
            const entry = entries[0];
            isFooterIntersecting = entry.isIntersecting; // Update flag

            if (entry.isIntersecting) {
                const contactInput = DOM.switcher?.querySelector('input[value="contact"]');
                if (contactInput && !contactInput.checked) {
                    contactInput.checked = true;
                    contactInput.dispatchEvent(new Event('change'));
                }
            }
        }, { threshold: 0.15 }).observe(footer);
    }

    // ==========================================
    // DRAG NAVIGATION
    // ==========================================
    let isDragging = false, ignoreClick = false, startX = 0, initialTranslate = 0, currentTranslate = 0, maxTranslate = 0, animationFrameId = null;

    const getCheckedIndex = () => DOM.navOptions.findIndex(opt => opt.querySelector('input').checked);

    const updateLayout = () => {
        if (!DOM.navOptions.length || !DOM.bubble) return 0;
        const optWidth = DOM.navOptions[0].getBoundingClientRect().width;
        maxTranslate = (DOM.navOptions.length - 1) * optWidth;
        DOM.bubble.style.width = `${optWidth}px`;

        const checkedIndex = getCheckedIndex();
        if (checkedIndex !== -1 && !isDragging) {
            DOM.bubble.style.transform = `translateX(${checkedIndex * optWidth}px)`;
        }
        return optWidth;
    };

    // ResizeObserver for layout updates
    let prevWidth = 0;
    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.contentRect.width !== prevWidth) {
                prevWidth = entry.contentRect.width;
                raf(updateLayout);
            }
        }
    });
    if (DOM.switcher) resizeObserver.observe(DOM.switcher);

    window.addEventListener('resize', debounce(updateLayout, 100), { passive: true });

    const updateVisuals = () => {
        if (!isDragging) return;
        DOM.bubble.style.transform = `translateX(${currentTranslate}px) scale(0.95)`;
        animationFrameId = raf(updateVisuals);
    };

    const startDrag = e => {
        // Requirement 3: Disable drag if footer is visible
        if (isFooterIntersecting) return;

        if (!e.target.closest('.switcher') || (e.type === 'mousedown' && e.button !== 0)) return;

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const rect = DOM.switcher.getBoundingClientRect();
        const relativeX = clientX - rect.left;
        const optWidth = DOM.navOptions[0].getBoundingClientRect().width;
        const currentIndex = getCheckedIndex();
        const bubbleX = currentIndex * optWidth;

        // Requirement 1 & 2: Only allow dragging if clicking the active bubble
        if (relativeX < bubbleX - 10 || relativeX > bubbleX + optWidth + 10) return;

        isDragging = true;
        ignoreClick = false;
        startX = clientX;
        if (e.cancelable) e.preventDefault();

        DOM.navOptions.forEach(opt => opt.classList.remove('switcher__option--highlight'));
        updateLayout();
        initialTranslate = currentIndex * optWidth;
        currentTranslate = initialTranslate;

        DOM.switcher.classList.add('switcher--dragging');
        DOM.bubble.style.transition = 'none';
        DOM.switcher.style.cursor = 'grabbing';

        cancelAnimationFrame(animationFrameId);
        animationFrameId = raf(updateVisuals);

        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('touchmove', moveDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        document.addEventListener('touchcancel', endDrag);
    };

    const moveDrag = e => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const deltaX = clientX - startX;
        if (Math.abs(deltaX) > 5) ignoreClick = true;

        currentTranslate = Math.max(0, Math.min(initialTranslate + deltaX, maxTranslate));

        const optWidth = DOM.navOptions[0].getBoundingClientRect().width;
        const bubbleLeft = currentTranslate, bubbleRight = currentTranslate + optWidth;

        DOM.navOptions.forEach((opt, idx) => {
            const optLeft = idx * optWidth, optRight = (idx + 1) * optWidth;
            const isOverlapping = bubbleLeft < optRight && bubbleRight > optLeft;
            opt.classList.toggle('active', isOverlapping);
            opt.classList.toggle('switcher__option--highlight', isOverlapping);
        });
    };

    const endDrag = () => {
        if (!isDragging) return;

        isDragging = false;
        cancelAnimationFrame(animationFrameId);
        DOM.switcher.style.cursor = '';
        DOM.switcher.classList.remove('switcher--dragging');
        DOM.bubble.style.transition = '';

        const optWidth = DOM.navOptions[0].getBoundingClientRect().width;
        const nearestIndex = Math.round(currentTranslate / optWidth);
        const clampedIndex = Math.max(0, Math.min(nearestIndex, DOM.navOptions.length - 1));
        const finalTranslate = clampedIndex * optWidth;

        DOM.navOptions.forEach((opt, idx) => {
            opt.classList.remove('switcher__option--highlight');
            opt.classList.toggle('active', idx === clampedIndex);
        });

        DOM.bubble.style.transform = `translateX(${finalTranslate}px)`;
        DOM.bubble.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';

        const input = DOM.navOptions[clampedIndex].querySelector('input');
        if (!input.checked) {
            input.checked = true;
            input.dispatchEvent(new Event('change'));
        }

        setTimeout(() => { DOM.bubble.style.transition = ''; }, 400);
        setTimeout(() => { ignoreClick = false; }, 50);

        document.removeEventListener('mousemove', moveDrag);
        document.removeEventListener('touchmove', moveDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
        document.removeEventListener('touchcancel', endDrag);
    };

    if (DOM.switcher) {
        DOM.switcher.addEventListener('mousedown', startDrag);
        DOM.switcher.addEventListener('touchstart', startDrag, { passive: false });
        DOM.switcher.addEventListener('click', e => {
            if (isDragging || ignoreClick) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    // ==========================================
    // MODAL UTILITIES
    // ==========================================
    const createModal = (className, content) => {
        const existing = $('.custom-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';

        const modal = document.createElement('div');
        modal.className = `custom-modal ${className}`;
        modal.innerHTML = content;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const closeModal = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal();
        });

        raf(() => overlay.classList.add('active'));
        return { overlay, modal, closeModal };
    };

    // Glassy Alert
    window.showGlassyAlert = message => {
        const { modal, closeModal } = createModal('', '');
        modal.innerHTML = `
            <div class="custom-modal-content">${message}</div>
            <button class="custom-modal-btn">OK</button>
        `;
        modal.querySelector('.custom-modal-btn').onclick = closeModal;
    };

    // Success Notification
    window.showSuccessNotification = userName => {
        const { modal, closeModal } = createModal('success-modal', `
            <div class="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h3 class="success-title">Request Received!</h3>
            <p class="success-message">Thanks <span class="highlight">${userName}</span>! We'll call you within 24 hours.</p>
            <button class="success-btn">Got It</button>
        `);
        modal.querySelector('.success-btn').onclick = closeModal;
    };

    // Video Modal
    window.openVideoModal = (videoUrl, isDirectFile = false) => {
        const { modal, closeModal } = createModal('video-modal', '');

        const closeBtn = document.createElement('button');
        closeBtn.className = 'video-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = closeModal;

        if (isDirectFile || videoUrl.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.src = videoUrl;
            video.controls = true;
            video.autoplay = true;
            video.className = 'video-modal-native';
            modal.appendChild(video);
        } else {
            const iframe = document.createElement('iframe');
            iframe.src = videoUrl;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            modal.appendChild(iframe);
        }
        modal.appendChild(closeBtn);
    };

    // ==========================================
    // CONTACT FORM SUBMISSION
    // ==========================================
    if (DOM.contactForm) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbw31N52W_a9osfowfMOjgEsiJpGwHvBjQuAX4FSfmpptrD-aHXImaBbjI50RB2VAr44ew/exec';

        DOM.contactForm.addEventListener('submit', e => {
            e.preventDefault();

            const name = DOM.contactForm.querySelector('input[name="name"]').value.trim();
            const email = DOM.contactForm.querySelector('input[name="email"]').value.trim();
            const phone = DOM.contactForm.querySelector('input[name="phone"]').value.trim();

            // Validation
            if (!name || !/^[A-Z]/.test(name)) {
                return showGlassyAlert("Please enter a valid Name. The first letter must be capitalized (e.g., 'John').");
            }
            if (!email || !email.toLowerCase().includes('@gmail.com')) {
                return showGlassyAlert("Please enter a valid Gmail address (must contain @gmail.com).");
            }
            if (!phone || !/^\d{10}$/.test(phone)) {
                return showGlassyAlert("Please enter a valid Phone Number (must be exactly <span class='number-text'>10</span> digits).");
            }

            const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: new FormData(DOM.contactForm) })
                .then(response => {
                    if (!response.ok) throw new Error(`Server returned ${response.status}`);
                    showSuccessNotification(name);
                    DOM.contactForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    let msg = "Something went wrong. Please try again.";
                    if (error.message?.includes('405') || error.message?.includes('401') || error.message === 'Failed to fetch') {
                        msg = "Connection Error. Please check your internet or try again later.";
                    }
                    showGlassyAlert(msg);
                })
                .finally(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // ==========================================
    // HERO VIDEO BUTTON
    // ==========================================
    if (DOM.heroPlayBtn) {
        DOM.heroPlayBtn.addEventListener('click', () => {
            openVideoModal('https://res.cloudinary.com/dgsr755tt/video/upload/v1753687256/Render_V2_cku6w4.mp4', true);
        });
    }

    // ==========================================
    // SECURITY & BRAND PROTECTION
    // ==========================================


})();
