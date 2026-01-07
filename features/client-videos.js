/* ===================================
   CLIENT VIDEO SECTION JAVASCRIPT
   Add this to your js/script.js file
   =================================== */

// Video Category Filtering System
function initVideoFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const videoCards = document.querySelectorAll('.video-card');
  
  if (!filterButtons.length || !videoCards.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      const category = button.dataset.category;
      
      // Filter video cards
      videoCards.forEach((card, index) => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
          
          // Re-trigger animation
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease forwards`;
            card.style.animationDelay = `${index * 0.1}s`;
          }, 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Lazy Load Videos (Performance Optimization)
function initVideoLazyLoading() {
  const videoCards = document.querySelectorAll('.video-card');
  
  if (!videoCards.length || !('IntersectionObserver' in window)) return;
  
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const wrapper = entry.target.querySelector('.video-wrapper');
        const iframe = wrapper?.querySelector('iframe');
        const video = wrapper?.querySelector('video');
        
        // Load iframe if it has data-src
        if (iframe && iframe.dataset.src && !iframe.src) {
          wrapper.classList.add('loading');
          iframe.src = iframe.dataset.src;
          
          iframe.addEventListener('load', () => {
            wrapper.classList.remove('loading');
          });
        }
        
        // Preload video metadata
        if (video && video.preload === 'none') {
          video.preload = 'metadata';
        }
        
        // Stop observing once loaded
        videoObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px', // Start loading 50px before entering viewport
    threshold: 0.1
  });
  
  videoCards.forEach(card => {
    videoObserver.observe(card);
  });
}

// Track Video Interactions (Analytics)
function initVideoTracking() {
  const videoCards = document.querySelectorAll('.video-card');
  
  videoCards.forEach(card => {
    const iframe = card.querySelector('iframe');
    const video = card.querySelector('video');
    const title = card.querySelector('.video-info h3')?.textContent || 'Unknown';
    const category = card.dataset.category || 'uncategorized';
    
    // Track iframe clicks
    if (iframe) {
      card.addEventListener('click', () => {
        console.log('Video clicked:', {
          title,
          category,
          type: 'iframe',
          timestamp: new Date().toISOString()
        });
        
        // Send to your analytics if needed
        // Example: gtag('event', 'video_click', { video_title: title });
      });
    }
    
    // Track native video plays
    if (video) {
      video.addEventListener('play', () => {
        console.log('Video played:', {
          title,
          category,
          type: 'native',
          timestamp: new Date().toISOString()
        });
      });
      
      video.addEventListener('ended', () => {
        console.log('Video completed:', {
          title,
          category,
          timestamp: new Date().toISOString()
        });
      });
    }
  });
}

// Auto-play videos on hover (Optional)
function initVideoHoverPlay() {
  const videoCards = document.querySelectorAll('.video-card');
  
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    
    if (!video) return;
    
    card.addEventListener('mouseenter', () => {
      if (video.paused) {
        video.play().catch(e => {
          console.log('Auto-play prevented:', e);
        });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (!video.paused) {
        video.pause();
      }
    });
  });
}

// Fullscreen video functionality
function initVideoFullscreen() {
  const videoCards = document.querySelectorAll('.video-card');
  
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    
    if (!video) return;
    
    // Double-click for fullscreen
    video.addEventListener('dblclick', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });
  });
}

// Keyboard navigation for video filters
function initVideoKeyboardNav() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (!filterButtons.length) return;
  
  filterButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
      let targetIndex;
      
      switch(e.key) {
        case 'ArrowLeft':
          targetIndex = index > 0 ? index - 1 : filterButtons.length - 1;
          break;
        case 'ArrowRight':
          targetIndex = index < filterButtons.length - 1 ? index + 1 : 0;
          break;
        case 'Home':
          targetIndex = 0;
          break;
        case 'End':
          targetIndex = filterButtons.length - 1;
          break;
        default:
          return;
      }
      
      e.preventDefault();
      filterButtons[targetIndex].focus();
      filterButtons[targetIndex].click();
    });
  });
}

// Video statistics counter
function updateVideoStats() {
  const totalVideos = document.querySelectorAll('.video-card').length;
  const testimonials = document.querySelectorAll('[data-category="testimonials"]').length;
  const caseStudies = document.querySelectorAll('[data-category="case-studies"]').length;
  const brandFilms = document.querySelectorAll('[data-category="brand-films"]').length;
  
  console.log('Video Statistics:', {
    total: totalVideos,
    testimonials,
    caseStudies,
    brandFilms
  });
}

// Initialize all video features
function initClientVideos() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVideoFeatures);
  } else {
    initializeVideoFeatures();
  }
}

function initializeVideoFeatures() {
  initVideoFilters();
  initVideoLazyLoading();
  initVideoTracking();
  initVideoKeyboardNav();
  updateVideoStats();
  
  // Optional features (uncomment if needed)
  // initVideoHoverPlay();
  // initVideoFullscreen();
  
  console.log('✅ Client video section initialized');
}

// Run initialization
initClientVideos();

// Export functions for external use (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initVideoFilters,
    initVideoLazyLoading,
    initVideoTracking,
    updateVideoStats
  };
}
