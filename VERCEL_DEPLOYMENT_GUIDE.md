# Vercel Deployment Guide for Study Mate

This guide will help you deploy your Study Mate application to Vercel with all the necessary configurations.

## 🚀 Pre-Deployment Checklist

### 1. **Environment Variables Setup**

Create a `.env.local` file with the following variables:

```bash
# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studymate?retryWrites=true&w=majority
MONGODB_DB_NAME=studymate

# NextAuth.js
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# AI Services
GEMINI_API_KEY=your-gemini-api-key

# Cloud Storage (Optional - for production file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_UPLOAD_PRESET=studymate_documents

# Production Settings
NODE_ENV=production
```

### 2. **MongoDB Atlas Setup**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster

2. **Configure Database Access**
   - Go to "Database Access" in your Atlas dashboard
   - Create a new database user with read/write permissions
   - Note down the username and password

3. **Configure Network Access**
   - Go to "Network Access" in your Atlas dashboard
   - Add IP address `0.0.0.0/0` to allow access from anywhere (for Vercel)

4. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string and replace `<password>` with your database user password

### 3. **OAuth Provider Setup (Optional)**

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/callback/google`

#### GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `https://your-app-name.vercel.app/api/auth/callback/github`

### 4. **Cloudinary Setup (Optional - for file uploads)**

1. Create a [Cloudinary](https://cloudinary.com/) account
2. Get your cloud name, API key, and API secret from the dashboard
3. Create an upload preset:
   - Go to Settings > Upload
   - Create a new upload preset named `studymate_documents`
   - Set signing mode to "Unsigned" for public uploads

## 📦 Deployment Steps

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   cd study-mate
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - Project name: `study-mate` (or your preferred name)
   - Directory: `./`
   - Override settings? `N`

### Method 2: Deploy via GitHub Integration

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Set Environment Variables**
   - In Vercel dashboard, go to your project
   - Go to Settings > Environment Variables
   - Add all the environment variables from your `.env.local`

## ⚙️ Vercel Configuration

The project includes the following Vercel-specific configurations:

### `vercel.json`
- Sets maximum function duration to 30 seconds
- Configures CORS headers for API routes
- Sets up proper routing for uploads

### `next.config.mjs`
- Optimized for Vercel deployment
- External packages configuration for PDF processing
- Production optimizations

### `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces bundle size

## 🔧 Post-Deployment Configuration

### 1. **Update OAuth Redirect URLs**
After deployment, update your OAuth provider redirect URLs:
- Google: `https://your-app-name.vercel.app/api/auth/callback/google`
- GitHub: `https://your-app-name.vercel.app/api/auth/callback/github`

### 2. **Update NEXTAUTH_URL**
In Vercel dashboard, update the `NEXTAUTH_URL` environment variable to your actual domain.

### 3. **Test the Application**
1. Visit your deployed URL
2. Test user registration/login
3. Test document upload
4. Test AI features (summaries, flashcards)

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript errors are resolved
   - Check build logs in Vercel dashboard

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has proper permissions

3. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check OAuth provider configurations
   - Ensure redirect URLs are correct

4. **File Upload Issues**
   - Check Cloudinary configuration
   - Verify upload preset settings
   - Check file size limits

5. **API Timeout Issues**
   - Some operations (PDF processing, AI generation) may take time
   - Consider implementing background jobs for heavy operations
   - Check Vercel function timeout settings

### Performance Optimization:

1. **Enable Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Consider using Vercel's Image Optimization

3. **Database Optimization**
   - Add proper indexes
   - Use connection pooling
   - Implement caching where appropriate

## 📊 Monitoring and Analytics

### 1. **Vercel Analytics**
- Built-in performance monitoring
- Real-time metrics
- Error tracking

### 2. **Custom Monitoring**
- Add error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user engagement

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use Vercel's environment variable system
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable IP whitelisting when possible
   - Regular security updates

3. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS everywhere

## 🚀 Going Live Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas connected and tested
- [ ] OAuth providers configured
- [ ] File upload working (local or cloud)
- [ ] AI services (Gemini) working
- [ ] All features tested
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Backup strategy implemented

## 📞 Support

If you encounter issues during deployment:

1. Check Vercel deployment logs
2. Review this guide for common solutions
3. Check the project's GitHub issues
4. Contact Vercel support for platform-specific issues

Your Study Mate application should now be successfully deployed on Vercel! 🎉
