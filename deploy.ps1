# Study Mate - Vercel Deployment Script (PowerShell)
Write-Host "🚀 Starting Study Mate deployment to Vercel..." -ForegroundColor Green

# Check if vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in to Vercel
try {
    vercel whoami | Out-Null
    Write-Host "✅ Logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Build the project locally to check for errors
Write-Host "🔨 Building project locally..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "📝 Don't forget to:" -ForegroundColor Yellow
    Write-Host "   1. Set up environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host "   2. Configure MongoDB Atlas" -ForegroundColor White
    Write-Host "   3. Set up OAuth providers" -ForegroundColor White
    Write-Host "   4. Configure Cloudinary (optional)" -ForegroundColor White
    Write-Host "   5. Test all features" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
    exit 1
}
