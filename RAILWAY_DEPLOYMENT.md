# Railway Deployment Guide for IDURAR ERP CRM

This guide will help you deploy IDURAR ERP CRM to Railway.

## 🚀 Deployment Options

You have two options for deploying to Railway:

### Option 1: Single Service Deployment (Recommended for Start)

Deploy both backend and frontend as a single service. The backend will serve the built frontend files.

### Option 2: Separate Services (Recommended for Production)

Deploy backend and frontend as separate services for better scalability and independent deployments.

---

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **MongoDB Database**: 
   - You can use Railway's MongoDB plugin or
   - Use MongoDB Atlas (free tier available)
3. **GitHub Repository**: Your code should be in a GitHub repository

---

## 🎯 Option 1: Single Service Deployment

### Step 1: Connect Repository to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### Step 2: Configure Environment Variables

In Railway, go to your service → **Variables** tab and add:

#### Required Variables:
```env
# Database
DATABASE=your_mongodb_connection_string

# Server
PORT=8888
NODE_ENV=production

# Frontend (for production builds)
VITE_BACKEND_SERVER=https://your-backend-url.railway.app/
VITE_DEV_REMOTE=remote
```

#### Optional Variables:
```env
# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_here

# OpenAI (if using AI features)
OPENAI_API_KEY=your_openai_api_key

# Email (Resend API)
RESEND_API_KEY=your_resend_api_key

# AWS S3 (if using cloud storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

### Step 3: Configure Build Settings

Railway should automatically detect the root `package.json`. If not:

1. Go to **Settings** → **Build**
2. Set **Build Command**: `npm run build`
3. Set **Start Command**: `npm start`

### Step 4: Deploy

1. Railway will automatically build and deploy
2. Wait for the build to complete
3. Check the **Deployments** tab for logs

### Step 5: Run Setup Script (First Time Only)

After first deployment, you need to run the setup script to initialize the database:

1. Go to **Settings** → **Service**
2. Click **"Generate Domain"** to get your service URL
3. In Railway, go to your service → **Deployments** → Click on the latest deployment
4. Open the **Logs** tab
5. Or use Railway CLI:
   ```bash
   railway run --service your-service-name "cd backend && npm run setup"
   ```

### Step 6: Access Your Application

1. Railway will provide a URL like: `https://your-app.railway.app`
2. The default admin credentials will be created by the setup script
3. Check the setup script output or logs for admin credentials

---

## 🎯 Option 2: Separate Services Deployment

### Part A: Backend Service

#### Step 1: Create Backend Service

1. In Railway, create a **New Service**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Set **Root Directory** to `backend`

#### Step 2: Configure Backend Environment Variables

```env
DATABASE=your_mongodb_connection_string
PORT=8888
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
# ... other backend variables
```

#### Step 3: Configure Backend Build

1. **Root Directory**: `backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`

#### Step 4: Get Backend URL

1. Generate domain for backend service
2. Note the URL: `https://your-backend.railway.app`

---

### Part B: Frontend Service

#### Step 1: Create Frontend Service

1. In Railway, create another **New Service**
2. Select **"Deploy from GitHub repo"**
3. Choose the same repository
4. Set **Root Directory** to `frontend`

#### Step 2: Configure Frontend Environment Variables

```env
VITE_BACKEND_SERVER=https://your-backend.railway.app/
VITE_DEV_REMOTE=remote
NODE_ENV=production
```

#### Step 3: Configure Frontend Build

1. **Root Directory**: `frontend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: 
   - Option A (Static): Use Railway's static file serving
   - Option B (Vite Preview): `npm run preview` (requires Vite server)

#### Step 4: Generate Frontend Domain

1. Generate domain for frontend service
2. This will be your main application URL

---

## 🔧 Troubleshooting

### Build Fails with "Railpack could not determine how to build"

**Solution**: Make sure you have a `package.json` at the root level (which we've created). Railway should detect it automatically.

### MongoDB Connection Error

**Error**: `🔥 Common Error caused issue → : check your .env file first and add your mongodb url`

**Solution**: 
1. Verify your `DATABASE` environment variable is set correctly
2. Make sure MongoDB allows connections from Railway's IP (if using MongoDB Atlas, add `0.0.0.0/0` to IP whitelist)
3. Check MongoDB connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### Frontend Can't Connect to Backend

**Solution**:
1. Verify `VITE_BACKEND_SERVER` environment variable includes the full backend URL with trailing slash
2. Check CORS settings in backend (should allow your frontend domain)
3. Verify backend service is running and accessible

### Port Already in Use

**Solution**: Railway automatically assigns a `PORT` environment variable. Make sure your backend uses `process.env.PORT` (which it does - default 8888).

### Setup Script Not Running

**Solution**: Run setup manually after first deployment:
```bash
railway run --service backend "cd backend && npm run setup"
```

Or use Railway's web interface to run commands in the deployment logs.

---

## 📝 Environment Variables Reference

### Backend Required:
- `DATABASE` - MongoDB connection string
- `PORT` - Server port (Railway provides this automatically)
- `NODE_ENV` - Set to `production`

### Backend Optional:
- `JWT_SECRET` - Secret for JWT tokens
- `OPENAI_API_KEY` - For AI features
- `RESEND_API_KEY` - For email functionality
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME` - For S3 storage

### Frontend Required:
- `VITE_BACKEND_SERVER` - Backend API URL (with trailing slash)
- `VITE_DEV_REMOTE` - Set to `remote` in production

### Frontend Optional:
- `VITE_FILE_BASE_URL` - Base URL for file uploads

---

## 🎉 Post-Deployment

1. **Access your app** at the Railway-provided URL
2. **Run setup script** to initialize database (first time only)
3. **Create admin account** (or use default from setup)
4. **Configure settings** through the admin panel
5. **Set up email** (if using email features)
6. **Configure file storage** (local or S3)

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)

---

## ⚠️ Important Notes

1. **Database Setup**: The setup script creates initial admin user and settings. Run it after first deployment.

2. **Static Files**: In single-service deployment, backend serves frontend static files. Make sure frontend build completes before backend starts.

3. **Environment Variables**: Never commit `.env` files. Always use Railway's environment variables.

4. **Build Order**: For single service, frontend must build before backend starts. The root `package.json` handles this.

5. **Railway Free Tier**: Railway's free tier has limitations. Consider upgrading for production use.

---

## 🆘 Need Help?

If you encounter issues:
1. Check Railway deployment logs
2. Verify all environment variables are set
3. Ensure MongoDB is accessible from Railway
4. Check that build commands complete successfully

Good luck with your deployment! 🚀


