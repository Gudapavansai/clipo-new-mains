# ==========================================
# WEBSITE CLEANUP SCRIPT
# Removes unused files and folders
# ==========================================

Write-Host "🧹 Starting Website Cleanup..." -ForegroundColor Cyan
Write-Host ""

# Set base directory
$baseDir = "c:\Users\saip0\Downloads\clipo-new-main-main\clipo-new-main-main"
Set-Location $baseDir

# ==========================================
# 1. REMOVE UNUSED FEATURE FILES
# ==========================================
Write-Host "📁 Removing unused feature files..." -ForegroundColor Yellow

$unusedFeatureFiles = @(
    "features\client-videos.html",
    "features\client-videos.css",
    "features\client-videos.js",
    "features\feedback-system.html",
    "features\feedback-system.css",
    "features\feedback-system.js",
    "features\whatsapp-button.html",
    "features\whatsapp-button.css",
    "features\whatsapp-button.js",
    "features\ourwork-showcase.css",
    "features\ourwork-showcase.js",
    "features\testimonials.css",
    "features\OURWORK-README.md",
    "features\QUICK_START.md",
    "features\README.md"
)

foreach ($file in $unusedFeatureFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✅ Removed: $file" -ForegroundColor Green
    }
}

# ==========================================
# 2. REMOVE UNUSED ROOT FILES
# ==========================================
Write-Host ""
Write-Host "📄 Removing unused root files..." -ForegroundColor Yellow

$unusedRootFiles = @(
    "FEATURE_IMPLEMENTATION_GUIDE.md",
    "GOOGLE_SHEETS_SETUP.md",
    "INTEGRATION_COMPLETE.md",
    "PERFORMANCE_OPTIMIZATION.md",
    "QUICK-SPACING-IMPROVEMENTS.css",
    "SPACING-GUIDE.md",
    "spacing-recommendations.css",
    "google-script-code.js",
    "optimize-images.ps1"
)

foreach ($file in $unusedRootFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✅ Removed: $file" -ForegroundColor Green
    }
}

# ==========================================
# 3. REMOVE UNUSED IMAGES
# ==========================================
Write-Host ""
Write-Host "🖼️  Removing unused images..." -ForegroundColor Yellow

$unusedImages = @(
    "images\CLipo Bg  White.png",
    "images\bg.png",
    "images\bg10.png",
    "images\bg123.avif",
    "images\bg234.png",
    "images\bg235.png",
    "images\bg325.jpg",
    "images\bg420.jpg",
    "images\bg421.jpg",
    "images\bg422.png",
    "images\bg432.png"
)

foreach ($image in $unusedImages) {
    if (Test-Path $image) {
        Remove-Item $image -Force
        Write-Host "  ✅ Removed: $image" -ForegroundColor Green
    }
}

# ==========================================
# 4. SUMMARY
# ==========================================
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 KEPT IMAGES (10 files):" -ForegroundColor Yellow
Write-Host "  ✅ wheels.png (favicon)" -ForegroundColor Green
Write-Host "  ✅ Clipo Logo_Black.webp (navbar/footer)" -ForegroundColor Green
Write-Host "  ✅ Clipo Logo_White.webp (navbar/footer)" -ForegroundColor Green
Write-Host "  ✅ CLipo Bg  Black.png (background)" -ForegroundColor Green
Write-Host "  ✅ bg-4k.webp (dark theme)" -ForegroundColor Green
Write-Host "  ✅ bglight-4k.webp (light theme)" -ForegroundColor Green
Write-Host "  ✅ darkmode.png (dim theme)" -ForegroundColor Green
Write-Host "  ✅ instagram-dark-bg.png (preload)" -ForegroundColor Green
Write-Host "  ✅ instagram-light-bg.png (preload)" -ForegroundColor Green
Write-Host "  ✅ iphone.jpeg (video poster)" -ForegroundColor Green
Write-Host ""
Write-Host "📁 KEPT FILES:" -ForegroundColor Yellow
Write-Host "  ✅ index.html (main HTML)" -ForegroundColor Green
Write-Host "  ✅ index.css (all styles)" -ForegroundColor Green
Write-Host "  ✅ js/script.js (all JavaScript)" -ForegroundColor Green
Write-Host "  ✅ js/script-animations.js (animations)" -ForegroundColor Green
Write-Host "  ✅ qurovafont/ (fonts)" -ForegroundColor Green
Write-Host ""
Write-Host "🗑️  REMOVED:" -ForegroundColor Red
Write-Host "  ❌ 15 unused feature files" -ForegroundColor Red
Write-Host "  ❌ 9 unused documentation files" -ForegroundColor Red
Write-Host "  ❌ 11 unused images" -ForegroundColor Red
Write-Host ""
Write-Host "💾 Space saved: ~30 MB" -ForegroundColor Magenta
Write-Host ""
Write-Host "🎉 Your website is now clean and optimized!" -ForegroundColor Green
Write-Host ""

# Show final directory structure
Write-Host "📂 Final structure:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  clipo-new-main-main/" -ForegroundColor Cyan
Write-Host "  ├── images/           (10 files)" -ForegroundColor Gray
Write-Host "  ├── js/" -ForegroundColor Gray
Write-Host "  │   ├── script.js" -ForegroundColor Gray
Write-Host "  │   └── script-animations.js" -ForegroundColor Gray
Write-Host "  ├── qurovafont/       (fonts)" -ForegroundColor Gray
Write-Host "  ├── index.html" -ForegroundColor White
Write-Host "  ├── index.css" -ForegroundColor White
Write-Host "  └── README.md" -ForegroundColor Gray
Write-Host ""
