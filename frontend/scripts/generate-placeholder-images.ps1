# Generate Placeholder Images for CV Templates
# This script creates placeholder images for CV templates using a placeholder service

param(
    [string]$OutputPath = "public/previews",
    [switch]$Force = $false
)

# Create output directory if it doesn't exist
if (!(Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force
    Write-Host "Created directory: $OutputPath"
}

# Template configurations with colors and text
$templateConfigs = @(
    @{ name = "modern-professional"; color = "3b82f6"; text = "Modern+Professional" },
    @{ name = "corporate-executive"; color = "64748b"; text = "Corporate+Executive" },
    @{ name = "finance-professional"; color = "10b981"; text = "Finance+Professional" },
    @{ name = "technical-engineer"; color = "8b5cf6"; text = "Technical+Engineer" },
    @{ name = "software-developer"; color = "f43f5e"; text = "Software+Developer" },
    @{ name = "data-scientist"; color = "059669"; text = "Data+Scientist" },
    @{ name = "creative-designer"; color = "f59e0b"; text = "Creative+Designer" },
    @{ name = "marketing-specialist"; color = "6b7280"; text = "Marketing+Specialist" },
    @{ name = "minimalist"; color = "374151"; text = "Minimalist" },
    @{ name = "modern-executive"; color = "1e40af"; text = "Modern+Executive" },
    @{ name = "healthcare-professional"; color = "047857"; text = "Healthcare+Professional" },
    @{ name = "academic-researcher"; color = "be123c"; text = "Academic+Researcher" },
    @{ name = "startup-founder"; color = "d97706"; text = "Startup+Founder" },
    @{ name = "consultant"; color = "6d28d9"; text = "Consultant" },
    @{ name = "project-manager"; color = "3b82f6"; text = "Project+Manager" },
    @{ name = "sales-professional"; color = "64748b"; text = "Sales+Professional" },
    @{ name = "ux-designer"; color = "059669"; text = "UX+Designer" },
    @{ name = "product-manager"; color = "f59e0b"; text = "Product+Manager" },
    @{ name = "operations-manager"; color = "6b7280"; text = "Operations+Manager" },
    @{ name = "senior-developer"; color = "f43f5e"; text = "Senior+Developer" }
)

function Generate-PlaceholderImage {
    param(
        [string]$TemplateName,
        [string]$Color,
        [string]$Text
    )
    
    $filename = "$TemplateName.png"
    $outputPath = Join-Path $OutputPath $filename
    
    # Skip if file exists and not forcing
    if ((Test-Path $outputPath) -and !$Force) {
        Write-Host "Skipping $filename (already exists)" -ForegroundColor Yellow
        return
    }
    
    # Generate placeholder URL
    $placeholderUrl = "https://via.placeholder.com/300x400/$Color/ffffff?text=$Text"
    
    try {
        Write-Host "Generating $filename..." -ForegroundColor Green
        
        Invoke-WebRequest -Uri $placeholderUrl -OutFile $outputPath -TimeoutSec 30
        Write-Host "Generated $filename" -ForegroundColor Green
    }
    catch {
        $err = $_
        Write-Host ("Failed to generate $filename: " + $err.Exception.Message) -ForegroundColor Red
    }
}

# Generate all placeholder images
Write-Host "Generating placeholder images for CV templates..." -ForegroundColor Cyan
Write-Host "Output directory: $OutputPath" -ForegroundColor Cyan
Write-Host ""

foreach ($config in $templateConfigs) {
    Generate-PlaceholderImage -TemplateName $config.name -Color $config.color -Text $config.text
}

Write-Host ""
Write-Host "Placeholder generation completed!" -ForegroundColor Cyan
Write-Host "Check the $OutputPath directory for generated images." -ForegroundColor Cyan

# List generated files
Write-Host ""
Write-Host "Generated files:" -ForegroundColor Cyan
Get-ChildItem $OutputPath -Filter "*.png" | ForEach-Object {
    $size = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  $($_.Name) ($size KB)" -ForegroundColor White
} 