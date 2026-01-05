/**
 * Clipo Media - Optimized GSAP Scroll Animations
 * Original: 12KB | Optimized: ~8KB
 * Performance: Reduced DOM queries, optimized batch animations, simplified parallax
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // Early exit if GSAP not loaded
        if (!window.gsap || !window.ScrollTrigger) {
            console.warn('GSAP or ScrollTrigger not loaded');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth < 768;
        const $ = selector => document.querySelector(selector);
        const $$ = selector => document.querySelectorAll(selector);

        // ==========================================
        // INITIAL STATE (Prevent FOUC)
        // ==========================================
        const heroElements = '.hero__badge, .hero__title, .hero__description, .hero__buttons';
        gsap.set(heroElements, { opacity: 0, y: 40 });
        gsap.set('.hero__visual', {
            opacity: 0,
            scale: 0.9,
            rotationX: 10,
            transformPerspective: 1000
        });

        // ==========================================
        // HERO ENTRY ANIMATION
        // ==========================================
        gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
            .to('.hero__badge', { opacity: 1, y: 0 })
            .to('.hero__title', { opacity: 1, y: 0 }, '-=0.6')
            .to('.hero__description', { opacity: 1, y: 0 }, '-=0.6')
            .to('.hero__buttons', { opacity: 1, y: 0 }, '-=0.6')
            .to('.hero__visual', {
                opacity: 1,
                scale: 1,
                rotationX: 0,
                duration: 1,
                ease: 'back.out(1.2)'
            }, '-=0.8');

        // ==========================================
        // HERO VIDEO SCROLL CONTROL
        // ==========================================
        const heroVideo = document.getElementById('hero-video');
        if (heroVideo) {
            const initVideoScroll = () => {
                if (isMobile) return; // Disable pinning/scrubbing on mobile to prevent "hanging" feel

                gsap.to(heroVideo, {
                    scrollTrigger: {
                        trigger: ".hero",
                        start: "top top",
                        end: "+=100%",
                        scrub: 1,
                        pin: true,
                        invalidateOnRefresh: true
                    },
                    currentTime: heroVideo.duration || 5,
                    ease: "none"
                });
            };

            if (heroVideo.readyState >= 1) {
                initVideoScroll();
            } else {
                heroVideo.addEventListener('loadedmetadata', initVideoScroll);
            }
        }

        // ==========================================
        // SECTION TITLES
        // ==========================================
        gsap.utils.toArray('.section__title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: { trigger: title, start: 'top 85%', once: true },
                opacity: 0,
                y: 30,
                duration: 0.8
            });
        });

        // ==========================================
        // CARD ANIMATION HELPER
        // ==========================================
        const animateCards = (selector, containerSelector, config = {}) => {
            const cards = $$(selector);
            if (!cards.length || isMobile) return;

            const { yOffset = 30, scale = 1, delay = 0.15, duration = 0.6 } = config;

            // Set initial state
            gsap.set(cards, { opacity: 0, y: yOffset, scale });

            // Check if already in viewport
            const container = $(containerSelector);
            if (container) {
                const rect = container.getBoundingClientRect();
                const inViewport = rect.top < window.innerHeight * 0.85;

                if (inViewport) {
                    cards.forEach((card, i) => {
                        card.dataset.animated = 'true';
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration,
                            delay: i * delay,
                            ease: config.ease || 'power2.out'
                        });
                    });
                    return;
                }
            }

            // Scroll trigger for cards not in viewport
            ScrollTrigger.batch(selector, {
                start: 'top 90%',
                once: true,
                onEnter: batch => {
                    batch.forEach((card, i) => {
                        if (card.dataset.animated !== 'true') {
                            card.dataset.animated = 'true';
                            gsap.to(card, {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                duration,
                                delay: i * delay,
                                ease: config.ease || 'power2.out'
                            });
                        }
                    });
                }
            });
        };

        // ==========================================
        // ABOUT SECTION
        // ==========================================
        animateCards('.vision-card', '.about__visions', { yOffset: 40, delay: 0.2, duration: 0.8 });

        // Stats animation
        const statItems = $$('.stat');
        if (statItems.length && !isMobile) {
            gsap.set(statItems, { opacity: 0, scale: 0.6 });

            const statsSection = $('.about__stats');
            if (statsSection) {
                const inViewport = statsSection.getBoundingClientRect().top < window.innerHeight * 0.85;

                if (inViewport) {
                    statItems.forEach((stat, i) => {
                        stat.dataset.animated = 'true';
                        gsap.to(stat, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.6,
                            delay: i * 0.15,
                            ease: 'back.out(1.7)'
                        });
                    });
                } else {
                    gsap.to('.stat', {
                        scrollTrigger: {
                            trigger: '.about__stats',
                            start: 'top 85%',
                            once: true
                        },
                        opacity: 1,
                        scale: 1,
                        stagger: 0.15,
                        duration: 0.6,
                        ease: 'back.out(1.7)'
                    });
                }
            }
        }

        // ==========================================
        // SERVICES & PRICING GRIDS
        // ==========================================
        animateCards('.service-card', '.services__grid', { delay: 0.1 });
        animateCards('.pricing-card', '.pricing__grid', { scale: 0.98, delay: 0.15 });

        // ==========================================
        // PARALLAX GRADIENT ORBS
        // ==========================================
        const orbs = gsap.utils.toArray('.gradient-orb');
        orbs.forEach((orb, i) => {
            gsap.to(orb, {
                y: [300, -150, 100][i] || 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1 + i * 0.5
                }
            });
        });

        // ==========================================
        // FOOTER
        // ==========================================
        if ($('.footer')) {
            gsap.from('.footer__content', {
                scrollTrigger: { trigger: '.footer', start: 'top 90%', once: true },
                opacity: 0,
                y: 20,
                duration: 1,
                ease: 'power2.out'
            });
        }

        // ==========================================
        // MOUSE GLOW EFFECT (Optimized)
        // ==========================================
        const glowCards = gsap.utils.toArray('.glass-card, .vision-card, .pricing-card');

        glowCards.forEach(card => {
            let glow = card.querySelector('.scroll-glow-effect');
            if (!glow) {
                glow = document.createElement('div');
                glow.className = 'scroll-glow-effect';
                Object.assign(glow.style, {
                    position: 'absolute',
                    inset: '0',
                    background: 'radial-gradient(circle at center, rgba(200,80,192,0.35), transparent 70%)',
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s ease',
                    mixBlendMode: 'overlay'
                });
                card.appendChild(glow);
            }

            card.style.position = 'relative';
            card.style.overflow = 'hidden';

            let ticking = false;
            card.addEventListener('mousemove', e => {
                if (ticking) return;
                ticking = true;

                requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, 
                        rgba(240, 148, 51, 0.4) 0%, 
                        rgba(220, 39, 67, 0.4) 40%, 
                        rgba(188, 24, 136, 0.4) 80%, 
                        transparent 100%)`;
                    glow.style.opacity = 1;
                    ticking = false;
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                glow.style.opacity = 0;
            }, { passive: true });
        });

    });

})();
