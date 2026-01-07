# Our Work Showcase - Premium Glassmorphic Design

## 🎨 Overview
This is a premium, Apple-inspired video showcase section featuring:
- **Tabbed Navigation** - Switch between Essentials, Implementation, and Showcase
- **Horizontal Scrolling Cards** - Modern, touch-friendly video gallery
- **Glassmorphism Effects** - Premium blurred glass aesthetics
- **Modal Video Playback** - Full-screen video player with YouTube, Vimeo, and native video support
- **Fully Responsive** - Optimized for mobile, tablet, and desktop

## 📁 Files Created

### 1. **HTML Structure** (`index.html`)
- Replaced the old "Our Work" section (lines 316-382)
- Added tabbed navigation interface
- Horizontal scrolling video cards
- Video modal for full-screen playback

### 2. **CSS Styles** (`features/ourwork-showcase.css`)
- Premium glassmorphic tab design
- Horizontal scrolling showcase with custom scrollbar
- Video card styling with badges and overlays
- Modal video player styling
- Full responsive design for all devices

### 3. **JavaScript** (`features/ourwork-showcase.js`)
- Tab switching functionality
- Modal video playback (YouTube, Vimeo, Native)
- Smooth scroll with mouse drag
- Keyboard navigation support
- Intersection Observer animations
- Lazy loading for performance
- Mobile touch optimizations

## ✨ Key Features

### Tabbed Navigation
```html
<div class="ourwork-tabs">
    <button class="ourwork-tab active" data-tab="essentials">Essentials</button>
    <button class="ourwork-tab" data-tab="implementation">Implementation</button>
    <button class="ourwork-tab" data-tab="showcase">Showcase</button>
</div>
```

### Video Cards
Each card includes:
- ✅ Thumbnail image
- ✅ Platform badge (YouTube/Vimeo)
- ✅ Duration badge
- ✅ Play button overlay
- ✅ Title and description
- ✅ "Play in modal" link

### Modal Video Player
- Automatic video type detection (YouTube/Vimeo/Native)
- Autoplay on open
- Close with click, Escape key, or overlay click
- Backdrop blur effect
- Smooth animations

## 🎯 Usage

### Adding New Videos

Add a new showcase card to any tab panel:

```html
<div class="showcase-card" data-video-id="YOUR_VIDEO_ID" data-type="youtube">
    <div class="card-thumbnail">
        <img src="THUMBNAIL_URL" alt="Video title" loading="lazy">
        <div class="card-overlay">
            <button class="play-button" aria-label="Play video">
                <!-- SVG play icon -->
            </button>
        </div>
        <span class="platform-badge youtube-badge">YouTube</span>
        <span class="duration-badge">X min</span>
    </div>
    <div class="card-content">
        <h3 class="card-title">Your Video Title</h3>
        <p class="card-description">Your video description...</p>
        <a href="#" class="card-link">
            Play in modal
            <!-- SVG external link icon -->
        </a>
    </div>
</div>
```

### Video Types

**YouTube:**
```html
data-video-id="dQw4w9WgXcQ" data-type="youtube"
```

**Vimeo:**
```html
data-video-id="76979871" data-type="vimeo"
```

**Native Video:**
```html
data-video-url="path/to/video.mp4" data-type="native"
```

## 🎨 Customization

### Tab Colors
Modify in `ourwork-showcase.css`:
```css
.ourwork-tab.active {
    background: color-mix(in srgb, var(--c-glass) 25%, transparent);
}
```

### Card Hover Effects
```css
.showcase-card:hover {
    transform: translateY(-8px);
}
```

### Modal Backdrop
```css
.modal-overlay {
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(20px);
}
```

## 📱 Responsive Breakpoints

- **Desktop:** 1024px+ - Full featured experience
- **Tablet:** 768px - 1023px - Optimized for touch
- **Mobile:** < 768px - Compact tabbed interface
- **Small Mobile:** < 480px - Extra compact design

## 🚀 Performance Optimizations

✅ **Lazy Loading** - Images load only when visible
✅ **Intersection Observer** - Staggered card animations
✅ **Deferred Scripts** - Non-blocking JavaScript
✅ **Custom Scrollbar** - Smooth horizontal scrolling
✅ **Touch Optimized** - Swipe gestures on mobile
✅ **Keyboard Navigation** - Arrow keys for accessibility

## 🎯 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Accessibility

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Semantic HTML structure

## 📊 Analytics Integration

The JavaScript includes Google Analytics event tracking:
- Tab clicks
- Video plays
- Video type interaction

Enable by ensuring `gtag` is available on your site.

## 🎨 Design Reference

This implementation matches the Apple-style glassmorphic showcase design with:
- Soft blurred backgrounds
- Subtle shadows and highlights
- Smooth animations
- Premium color palette
- Modern typography

## 💡 Tips

1. **Video Thumbnails:** Use high-quality YouTube thumbnails: `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`

2. **Duration:** Keep duration badges short and accurate

3. **Titles:** Use concise, descriptive titles (under 50 characters)

4. **Descriptions:** Keep descriptions to 2 lines maximum

5. **Cards Per Tab:** 4-8 cards for optimal scrolling experience

## 🐛 Troubleshooting

**Videos not playing?**
- Check video IDs are correct
- Verify data-type attribute matches video source
- Ensure iframes are allowed in browser

**Tabs not switching?**
- Verify JavaScript is loaded
- Check browser console for errors
- Ensure data-tab and data-panel values match

**Scrolling issues?**
- Check CSS overflow properties
- Verify scroll-snap is supported
- Test touch events on mobile

## 📞 Support

For questions or issues, refer to:
- Main project documentation
- CSS comments in `ourwork-showcase.css`
- JavaScript comments in `ourwork-showcase.js`

---

**Created:** 2026-01-07
**Version:** 1.0.0
**Design:** Premium Glassmorphic Showcase
**Compatibility:** All modern browsers
