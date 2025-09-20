#!/bin/bash

# Study Mate - Vercel Deployment Script
echo "🚀 Starting Study Mate deployment to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Build the project locally to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "📝 Don't forget to:"
    echo "   1. Set up environment variables in Vercel dashboard"
    echo "   2. Configure MongoDB Atlas"
    echo "   3. Set up OAuth providers"
    echo "   4. Configure Cloudinary (optional)"
    echo "   5. Test all features"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
