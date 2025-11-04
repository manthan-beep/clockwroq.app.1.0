# Railway Quick Start Guide

## 🚀 Quick Deploy to Railway

### Step 1: Push to GitHub
Make sure all changes are committed and pushed to your GitHub repository.

### Step 2: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### Step 3: Set Environment Variables
In Railway Dashboard → Your Service → **Variables**, add:

```env
DATABASE=your_mongodb_connection_string
NODE_ENV=production
VITE_BACKEND_SERVER=https://your-app.railway.app/
VITE_DEV_REMOTE=remote
```

**Important**: Replace `your_mongodb_connection_string` with your actual MongoDB URI.
Replace `your-app.railway.app` with your actual Railway domain (set this after first deploy).

### Step 4: Deploy
Railway will automatically:
1. Detect the root `package.json`
2. Run `npm run build` (installs dependencies and builds frontend)
3. Run `npm start` (starts backend server)

### Step 5: Run Setup (First Time)
After first deployment succeeds:
1. Open Railway service logs
2. Or use Railway CLI:
   ```bash
   railway run --service your-service "cd backend && npm run setup"
   ```

### Step 6: Access Your App
1. Railway will provide a URL: `https://your-app.railway.app`
2. Open it in your browser
3. Login with admin credentials (check setup script output)

---

## 📝 Important Notes

- **MongoDB**: You need a MongoDB database. Use MongoDB Atlas (free) or Railway's MongoDB plugin
- **Environment Variables**: Set `VITE_BACKEND_SERVER` AFTER Railway generates your domain
- **Build Time**: First build may take 5-10 minutes
- **Port**: Railway automatically sets `PORT` - your app uses `process.env.PORT`

---

## 🔧 Troubleshooting

**Build fails?**
- Check Railway logs for specific errors
- Verify `package.json` exists at root
- Ensure Node.js version is 20+

**Can't connect to MongoDB?**
- Verify `DATABASE` environment variable is set
- Check MongoDB allows connections from Railway IPs
- MongoDB Atlas: Add `0.0.0.0/0` to IP whitelist

**Frontend shows but API doesn't work?**
- Verify `VITE_BACKEND_SERVER` is set correctly
- Check CORS settings
- Verify backend service is running

---

For detailed instructions, see `RAILWAY_DEPLOYMENT.md`


