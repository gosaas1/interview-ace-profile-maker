# Download CV Template Preview Images
# This script downloads preview images for CV templates from various sources

param(
    [string]$OutputPath = "public/previews",
    [switch]$Force = $false
)

# Create output directory if it doesn't exist
if (!(Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force
    Write-Host "Created directory: $OutputPath"
}

# Template image URLs and filenames
$templateImages = @(
    @{
        filename = "modern-professional.png"
        url = "https://raw.githubusercontent.com/b-ran/react-cv/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/3b82f6/ffffff?text=Modern+Professional"
    },
    @{
        filename = "corporate-executive.png"
        url = "https://raw.githubusercontent.com/gndx/gresume-react/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/64748b/ffffff?text=Corporate+Executive"
    },
    @{
        filename = "finance-professional.png"
        url = "https://raw.githubusercontent.com/ihasdapie/resume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/10b981/ffffff?text=Finance+Professional"
    },
    @{
        filename = "technical-engineer.png"
        url = "https://raw.githubusercontent.com/alexcalabrese/techResume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Technical+Engineer"
    },
    @{
        filename = "software-developer.png"
        url = "https://raw.githubusercontent.com/clemmy/react-resume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/f43f5e/ffffff?text=Software+Developer"
    },
    @{
        filename = "data-scientist.png"
        url = "https://raw.githubusercontent.com/Crayon-ShinChan/mr-resume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/059669/ffffff?text=Data+Scientist"
    },
    @{
        filename = "creative-designer.png"
        url = "https://raw.githubusercontent.com/leafty/react-resume-template/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/f59e0b/ffffff?text=Creative+Designer"
    },
    @{
        filename = "marketing-specialist.png"
        url = "https://raw.githubusercontent.com/dninomiya/cv/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/6b7280/ffffff?text=Marketing+Specialist"
    },
    @{
        filename = "minimalist.png"
        url = "https://raw.githubusercontent.com/tomchen/react-printable-cv/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/374151/ffffff?text=Minimalist"
    },
    @{
        filename = "modern-executive.png"
        url = "https://raw.githubusercontent.com/pecamardelli/resume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/1e40af/ffffff?text=Modern+Executive"
    },
    @{
        filename = "healthcare-professional.png"
        url = "https://raw.githubusercontent.com/aaronsimca/aaron-resume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/047857/ffffff?text=Healthcare+Professional"
    },
    @{
        filename = "academic-researcher.png"
        url = "https://raw.githubusercontent.com/SamuelStentz/react-resume-sam/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/be123c/ffffff?text=Academic+Researcher"
    },
    @{
        filename = "startup-founder.png"
        url = "https://raw.githubusercontent.com/oalee/react-portfolio/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/d97706/ffffff?text=Startup+Founder"
    },
    @{
        filename = "consultant.png"
        url = "https://raw.githubusercontent.com/saeedjs/resume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/6d28d9/ffffff?text=Consultant"
    },
    @{
        filename = "project-manager.png"
        url = "https://raw.githubusercontent.com/b-ran/react-cv/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/3b82f6/ffffff?text=Project+Manager"
    },
    @{
        filename = "sales-professional.png"
        url = "https://raw.githubusercontent.com/gndx/gresume-react/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/64748b/ffffff?text=Sales+Professional"
    },
    @{
        filename = "ux-designer.png"
        url = "https://raw.githubusercontent.com/Crayon-ShinChan/mr-resume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/059669/ffffff?text=UX+Designer"
    },
    @{
        filename = "product-manager.png"
        url = "https://raw.githubusercontent.com/leafty/react-resume-template/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/f59e0b/ffffff?text=Product+Manager"
    },
    @{
        filename = "operations-manager.png"
        url = "https://raw.githubusercontent.com/dninomiya/cv/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/6b7280/ffffff?text=Operations+Manager"
    },
    @{
        filename = "senior-developer.png"
        url = "https://raw.githubusercontent.com/clemmy/react-resume/master/public/preview.png"
        fallback = "https://via.placeholder.com/300x400/f43f5e/ffffff?text=Senior+Developer"
    }
)

function Download-Image {
    param(
        [string]$Url,
        [string]$OutputFile,
        [string]$FallbackUrl
    )
    
    $outputPath = Join-Path $OutputPath $OutputFile
    
    # Skip if file exists and not forcing
    if ((Test-Path $outputPath) -and !$Force) {
        Write-Host "Skipping $OutputFile (already exists)" -ForegroundColor Yellow
        return
    }
    
    try {
        Write-Host "Downloading $OutputFile..." -ForegroundColor Green
        
        # Try primary URL first
        try {
            Invoke-WebRequest -Uri $Url -OutFile $outputPath -TimeoutSec 30
            Write-Host "✓ Downloaded $OutputFile from primary source" -ForegroundColor Green
            return
        }
        catch {
            Write-Host "Primary URL failed for $OutputFile, trying fallback..." -ForegroundColor Yellow
            
            # Try fallback URL
            try {
                Invoke-WebRequest -Uri $FallbackUrl -OutFile $outputPath -TimeoutSec 30
                Write-Host "✓ Downloaded $OutputFile from fallback source" -ForegroundColor Green
                return
            }
            catch {
                Write-Host "✗ Failed to download $OutputFile from both sources" -ForegroundColor Red
                Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "✗ Unexpected error downloading $OutputFile: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Download all template images
Write-Host "Starting download of CV template preview images..." -ForegroundColor Cyan
Write-Host "Output directory: $OutputPath" -ForegroundColor Cyan
Write-Host ""

foreach ($template in $templateImages) {
    Download-Image -Url $template.url -OutputFile $template.filename -FallbackUrl $template.fallback
}

Write-Host ""
Write-Host "Download process completed!" -ForegroundColor Cyan
Write-Host "Check the $OutputPath directory for downloaded images." -ForegroundColor Cyan

# List downloaded files
Write-Host ""
Write-Host "Downloaded files:" -ForegroundColor Cyan
Get-ChildItem $OutputPath -Filter "*.png" | ForEach-Object {
    $size = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  $($_.Name) ($size KB)" -ForegroundColor White
} 