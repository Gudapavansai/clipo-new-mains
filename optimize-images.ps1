# Image Optimization Script for Clipo Media
# This PowerShell script helps compress images for better web performance

Write-Host "🖼️  Clipo Media - Image Optimization Helper" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running from project directory
if (-not (Test-Path "images")) {
    Write-Host "❌ Error: Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "📊 Analyzing images in ./images/ folder..." -ForegroundColor Yellow
Write-Host ""

# Get all images and their sizes
$images = Get-ChildItem -Path "images" -Include *.png, *.jpg, *.jpeg -Recurse
$totalSize = 0
$largeImages = @()

foreach ($img in $images) {
    $sizeMB = [math]::Round($img.Length / 1MB, 2)
    $totalSize += $img.Length
    
    if ($sizeMB -gt 0.5) {
        $largeImages += [PSCustomObject]@{
            Name = $img.Name
            Path = $img.FullName
            SizeMB = $sizeMB
        }
    }
}

$totalSizeMB = [math]::Round($totalSize / 1MB, 2)

Write-Host "📈 Total image size: $totalSizeMB MB" -ForegroundColor Cyan
Write-Host "🔍 Found $($largeImages.Count) images larger than 0.5MB:" -ForegroundColor Yellow
Write-Host ""

# Display large images
$largeImages | Sort-Object -Property SizeMB -Descending | Format-Table -AutoSize

Write-Host ""
Write-Host "💡 OPTIMIZATION RECOMMENDATIONS:" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Recommendations for each large image
foreach ($img in ($largeImages | Sort-Object -Property SizeMB -Descending)) {
    Write-Host "📦 $($img.Name) ($($img.SizeMB) MB)" -ForegroundColor Yellow
    
    if ($img.Name -like "*Logo*") {
        Write-Host "   → Logo image - should be <100KB" -ForegroundColor White
        Write-Host "   → Recommended: Use TinyPNG or export at lower resolution" -ForegroundColor Gray
        Write-Host "   → Target size: 50-100KB (95% reduction)" -ForegroundColor Green
    }
    elseif ($img.Name -like "*Bg*" -or $img.Name -like "*background*") {
        Write-Host "   → Background image - should be <500KB" -ForegroundColor White
        Write-Host "   → Recommended: Compress with quality 85%, consider WebP format" -ForegroundColor Gray
        Write-Host "   → Target size: 300-500KB (90% reduction)" -ForegroundColor Green
    }
    elseif ($img.Name -like "*instagram*") {
        Write-Host "   → Gradient background - already optimized!" -ForegroundColor Green
        Write-Host "   → Current size is acceptable for quality" -ForegroundColor Gray
    }
    else {
        Write-Host "   → Should be compressed to <200KB" -ForegroundColor White
        Write-Host "   → Use online tools or ImageMagick" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host ""
Write-Host "🛠️  OPTIMIZATION TOOLS:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Online Tools (Easiest)" -ForegroundColor Yellow
Write-Host "  • TinyPNG: https://tinypng.com/" -ForegroundColor White
Write-Host "  • Squoosh: https://squoosh.app/" -ForegroundColor White
Write-Host "  • Compressor.io: https://compressor.io/" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Bulk Conversion (Recommended)" -ForegroundColor Yellow
Write-Host "  • Use online bulk converters" -ForegroundColor White
Write-Host "  • Or install ImageMagick for command-line processing" -ForegroundColor White
Write-Host ""

# Calculate potential savings
$potentialSavings = 0
foreach ($img in $largeImages) {
    if ($img.Name -like "*Logo*") {
        $potentialSavings += ($img.SizeMB - 0.08) * 1MB
    }
    elseif ($img.Name -like "*Bg*" -and $img.Name -notlike "*instagram*") {
        $potentialSavings += ($img.SizeMB - 0.4) * 1MB
    }
}

$potentialSavingsMB = [math]::Round($potentialSavings / 1MB, 2)

if ($potentialSavingsMB -gt 0) {
    Write-Host ""
    Write-Host "💰 POTENTIAL SAVINGS: ~$potentialSavingsMB MB" -ForegroundColor Green
    $percentSavings = [math]::Round(($potentialSavings / $totalSize) * 100, 0)
    Write-Host "   ($percentSavings% reduction in total image size)" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Analysis complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit https://tinypng.com/ or https://squoosh.app/" -ForegroundColor White
Write-Host "2. Upload the large images listed above" -ForegroundColor White
Write-Host "3. Download optimized versions" -ForegroundColor White
Write-Host "4. Replace original files in ./images/ folder" -ForegroundColor White
Write-Host "5. Test your website to ensure images look good" -ForegroundColor White
Write-Host ""
