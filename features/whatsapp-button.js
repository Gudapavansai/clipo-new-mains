/* ===================================
   WHATSAPP BUTTON JAVASCRIPT
   Add this to your js/script.js file
   =================================== */

// WhatsApp Widget Controller
class WhatsAppWidget {
    constructor() {
        this.toggle = document.getElementById('whatsappToggle');
        this.menu = document.getElementById('whatsappMenu');
        this.isOpen = false;

        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) {
            console.log('Simple WhatsApp button in use');
            this.initSimpleButton();
            return;
        }

        this.attachEventListeners();
        this.initNotifications();

        console.log('✅ Advanced WhatsApp widget initialized');
    }

    initSimpleButton() {
        const simpleButton = document.querySelector('.whatsapp-float');
        if (!simpleButton) return;

        // Track clicks
        simpleButton.addEventListener('click', () => {
            this.trackEvent('WhatsApp Click', 'Simple Button');
        });

        // Add keyboard support
        simpleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                simpleButton.click();
            }
        });
    }

    attachEventListeners() {
        // Toggle button click
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Option clicks
        const options = this.menu.querySelectorAll('.whatsapp-option');
        options.forEach((option, index) => {
            option.addEventListener('click', () => {
                const label = option.querySelector('strong')?.textContent || `Option ${index + 1}`;
                this.trackEvent('WhatsApp Option Click', label);
                this.closeMenu();
            });
        });

        // Keyboard navigation
        this.toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMenu();
            } else if (e.key === 'Escape') {
                this.closeMenu();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
                this.toggle.focus();
            }
        });

        // Focus trap when menu is open
        this.menu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabKey(e);
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        this.toggle.setAttribute('aria-expanded', 'true');
        this.isOpen = true;

        // Focus first option
        setTimeout(() => {
            const firstOption = this.menu.querySelector('.whatsapp-option');
            if (firstOption) firstOption.focus();
        }, 100);

        this.trackEvent('WhatsApp Menu', 'Opened');
    }

    closeMenu() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.isOpen = false;
    }

    handleTabKey(e) {
        const focusableElements = this.menu.querySelectorAll('.whatsapp-option');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Notification badge system
    initNotifications() {
        // Check if there are unread messages (you can customize this logic)
        const hasNotification = this.checkForNotifications();

        if (hasNotification) {
            this.toggle.classList.add('has-notification');
        }
    }

    checkForNotifications() {
        // Implement your logic here
        // For example, check localStorage, session, or server
        return localStorage.getItem('whatsappNotification') === 'true';
    }

    showNotification() {
        this.toggle.classList.add('has-notification');
        localStorage.setItem('whatsappNotification', 'true');
    }

    hideNotification() {
        this.toggle.classList.remove('has-notification');
        localStorage.removeItem('whatsappNotification');
    }

    // Analytics tracking
    trackEvent(category, action, label = '') {
        console.log('📊 Event:', { category, action, label });

        // Google Analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        // Meta Pixel (if available)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: action
            });
        }
    }

    // Utility: Get current time greeting
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }

    // Utility: Generate dynamic WhatsApp message
    generateMessage(type = 'general') {
        const greeting = this.getGreeting();
        const page = document.title || 'your website';

        const messages = {
            general: `${greeting}! I'm visiting ${page} and interested in your services.`,
            quote: `${greeting}! I'd like to get a custom quote for a project.`,
            support: `${greeting}! I need some assistance with my project.`,
            project: `${greeting}! I'd like to discuss a potential collaboration.`
        };

        return encodeURIComponent(messages[type] || messages.general);
    }

    // Update WhatsApp link dynamically
    updateWhatsAppLink(element, messageType = 'general') {
        const phoneNumber = '919985585558'; // Your WhatsApp number
        const message = this.generateMessage(messageType);
        const url = `https://wa.me/${phoneNumber}?text=${message}`;

        element.href = url;
    }

    // Auto-show widget after delay (optional)
    autoShow(delay = 5000) {
        setTimeout(() => {
            if (!this.isOpen && !sessionStorage.getItem('whatsappAutoShown')) {
                this.openMenu();
                sessionStorage.setItem('whatsappAutoShown', 'true');

                // Auto-close after 10 seconds if not interacted
                setTimeout(() => {
                    if (this.isOpen && !this.menu.matches(':hover')) {
                        this.closeMenu();
                    }
                }, 10000);
            }
        }, delay);
    }

    // Show widget on exit intent
    initExitIntent() {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !sessionStorage.getItem('whatsappExitShown')) {
                this.openMenu();
                sessionStorage.setItem('whatsappExitShown', 'true');
            }
        });
    }

    // Show widget on scroll percentage
    initScrollTrigger(percentage = 50) {
        let triggered = false;

        window.addEventListener('scroll', () => {
            if (triggered) return;

            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercent >= percentage) {
                this.showNotification();
                triggered = true;
            }
        });
    }
}

// Alternative: Simple Initialization for basic button
function initSimpleWhatsAppButton() {
    const button = document.querySelector('.whatsapp-float');
    if (!button) return;

    // Dynamic message based on current page
    const updateMessage = () => {
        const hour = new Date().getHours();
        let greeting = 'Hi';

        if (hour < 12) greeting = 'Good morning';
        else if (hour < 17) greeting = 'Good afternoon';
        else greeting = 'Good evening';

        const page = document.title || 'your website';
        const message = `${greeting}! I'm visiting ${page} and interested in Clipo Media's services.`;

        const phoneNumber = '919985585558';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        button.href = url;
    };

    updateMessage();

    // Track click
    button.addEventListener('click', () => {
        console.log('📱 WhatsApp button clicked');

        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'WhatsApp',
                event_label: 'Float Button'
            });
        }
    });
}

// Initialize WhatsApp Widget
let whatsappWidget;

function initWhatsAppWidget() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            whatsappWidget = new WhatsAppWidget();

            // Optional: Enable auto-features
            // whatsappWidget.autoShow(8000); // Show after 8 seconds
            // whatsappWidget.initExitIntent(); // Show on exit intent
            // whatsappWidget.initScrollTrigger(60); // Show at 60% scroll
        });
    } else {
        whatsappWidget = new WhatsAppWidget();
    }
}

// Run initialization
initWhatsAppWidget();

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhatsAppWidget;
}

// Console helper for debugging
window.openWhatsAppMenu = function () {
    if (whatsappWidget) {
        whatsappWidget.openMenu();
    } else {
        console.log('WhatsApp widget not initialized');
    }
};

window.showWhatsAppNotification = function () {
    if (whatsappWidget) {
        whatsappWidget.showNotification();
    }
};
