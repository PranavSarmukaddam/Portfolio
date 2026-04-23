# GitHub Setup & Deployment Guide

This guide walks you through pushing your portfolio to GitHub and deploying it live.

## Step 1: Verify Security Before Pushing

**CRITICAL**: Make sure sensitive files are NOT going to GitHub.

### Check `.gitignore`
Your `.gitignore` should already include:
```
.env                 ✅ (contains credentials)
node_modules/        ✅ (installed locally)
data/messages.db     ✅ (database file)
```

### Verify `.env.example` has NO real credentials
Open `.env.example` - it should show:
```
EMAIL_USER=your_email@gmail.com           ✅ (placeholder)
EMAIL_PASSWORD=your_16_char_app_password  ✅ (placeholder)
NOTIFICATION_EMAIL=alerts@gmail.com       ✅ (placeholder)
ADMIN_DASHBOARD_TOKEN=your_token          ✅ (placeholder)
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub Web Interface (Easiest)
1. Go to https://github.com/new
2. **Repository name**: `portfolio` (or your choice)
3. **Description**: `Full-stack portfolio website with contact form and admin dashboard`
4. **Public** (so people can see your portfolio)
5. **Don't initialize** with README (you already have one)
6. Click **Create repository**
7. GitHub shows you the commands to run

### Option B: Using GitHub CLI
```bash
# Install GitHub CLI (if you haven't)
# https://cli.github.com

# Login to GitHub
gh auth login

# Create repo
gh repo create portfolio --public --source=. --remote=origin --push
```

## Step 3: Initialize Git (If Not Already Done)

Check if git is initialized:
```bash
cd g:\Portfolio
git status
```

If you get an error, initialize git:
```bash
git init
git config user.name "Your Name"
git config user.email "your_email@github.com"
```

## Step 4: Add Remote and Push to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username.

### Using HTTPS (Recommended for beginners)
```bash
cd g:\Portfolio

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Verify it worked
git remote -v

# Add all files
git add .

# Check what will be committed (should NOT include .env)
git status

# Commit
git commit -m "Initial commit: Full-stack portfolio with admin dashboard and email notifications"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Using SSH (More secure, requires setup)
If you have SSH keys set up:
```bash
git remote add origin git@github.com:YOUR_USERNAME/portfolio.git
git push -u origin main
```

**Troubleshooting `git push` errors:**
- **"fatal: remote origin already exists"**: Run `git remote remove origin` first
- **"fatal: could not read Username"**: Use HTTPS or set up SSH keys
- **"The repository could not be accessed"**: Check GitHub token permissions

## Step 5: Verify on GitHub

Go to https://github.com/YOUR_USERNAME/portfolio

You should see:
- ✅ All your files (except `.env`, `node_modules/`, `data/messages.db`)
- ✅ `README.md` displayed nicely
- ✅ `DEPLOYMENT.md` available
- ✅ `.env.example` (without real credentials)

## Step 6: Deploy to Production

Choose one of these platforms:

### 🎯 **Quickest Setup** (Render)
1. Go to https://render.com
2. Sign up with GitHub (connect your account)
3. Click "New Web Service"
4. Select your portfolio repository
5. Configure:
   - **Name**: `portfolio`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Add Environment Variables**:
   - Add these 4 from your `.env` file:
     - `EMAIL_USER`
     - `EMAIL_PASSWORD`
     - `NOTIFICATION_EMAIL`
     - `ADMIN_DASHBOARD_TOKEN`
7. Click **Deploy Service** 🚀

Your site will be live in ~2 minutes at `https://portfolio.onrender.com`

### 🚂 **Best Free Tier** (Railway)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your portfolio repository
5. Railway auto-detects Node.js
6. Add environment variables in the dashboard
7. Deploy starts automatically

Your site will be live at a Railway URL

### ⚡ **Fastest** (Vercel)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables
4. Deploy

### See full guide: [DEPLOYMENT.md](DEPLOYMENT.md)

## Step 7: Test Your Deployed Site

1. Visit your live site (URL from platform)
2. Check that the portfolio loads
3. Test the contact form - submit a message
4. You should receive an email!
5. Visit `/admin` and unlock with your admin token
6. You should see your message in the admin dashboard

## Step 8: Add Custom Domain (Optional)

After deployment, add your own domain:

1. Buy a domain (GoDaddy, Namecheap, Route53, etc.)
2. In your platform dashboard → Settings → Domains
3. Add your domain
4. Follow DNS setup instructions
5. Done! Your site is now at `yourname.com`

## Push Updates to Production

After making changes locally:

```bash
# Make your changes
# Edit files, test locally with: npm start

# When ready to push:
git add .
git commit -m "Describe your changes"
git push origin main

# Platform auto-deploys within 1-2 minutes!
```

## Security Checklist ✅

Before going live:
- [ ] `.env` file is in `.gitignore`
- [ ] `.env` is NOT in GitHub
- [ ] `.env.example` has only placeholders (no real credentials)
- [ ] No API keys or passwords in code files
- [ ] Admin token is strong (32+ random characters)
- [ ] Email password is Gmail app password (not your actual password)
- [ ] `package.json` has all dependencies

## Troubleshooting

### "fatal: repository not found"
- Check your GitHub username is correct
- Make sure repository is public
- Try: `git remote set-url origin https://github.com/YOUR_USERNAME/portfolio.git`

### ".env is being tracked (shouldn't be!)"
```bash
# Remove .env from git tracking
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

### Changes not showing on deployed site
- Wait 2-3 minutes for auto-deploy to complete
- Check platform logs for errors
- Make sure you pushed with `git push origin main`

### Still having issues?
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting

---

## Summary

```bash
# 1. Setup local git
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# 2. Add to GitHub
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# 3. Push to GitHub
git add .
git commit -m "Initial commit: Portfolio site"
git push -u origin main

# 4. Deploy to Render/Railway/Vercel
# → Sign in with GitHub
# → Select your repository
# → Set environment variables
# → Deploy!

# 5. Visit your live site! 🎉
```

That's it! Your portfolio is now live on the internet.

---

**Questions?** Check:
- [README.md](README.md) - Project overview
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- Your platform's documentation
