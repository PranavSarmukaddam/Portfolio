# Deployment Guide

Deploy your portfolio to the web with these services.

## Quick Start (Recommended)

### Option 1: Render (Free tier available)
Best for Node.js apps. Automatic deploys from GitHub.

1. **Create Render account**: https://render.com (sign up with GitHub)
2. **Connect your GitHub repo**: Click "New +" → "Web Service"
3. **Configure**:
   - Runtime: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
4. **Add environment variables**:
   - Go to "Environment" tab
   - Add `EMAIL_USER`, `EMAIL_PASSWORD`, `NOTIFICATION_EMAIL`, `ADMIN_DASHBOARD_TOKEN`
   - Values come from your local `.env` file
5. **Deploy**: Click "Deploy" - done in ~2 minutes!

**Free tier limits**: 0.5 GB RAM, spins down after 15 min of inactivity (wakes up when accessed)

### Option 2: Railway (Free tier)
Simple and fast deployment.

1. **Create Railway account**: https://railway.app (sign up with GitHub)
2. **Click "Start New Project"** → **"Deploy from GitHub repo"**
3. **Select your portfolio repository**
4. **Railway auto-detects Node.js** - click through setup
5. **Add variables**:
   - Go to "Variables" tab
   - Copy all values from your `.env` file
6. **Deploy automatically** when you push to GitHub

**Free tier**: $5/month credit (usually enough for personal projects)

### Option 3: Vercel
Great if you want the fastest deployment.

1. **Go to**: https://vercel.com/new
2. **Import your GitHub repository**
3. **Select framework**: Keep default (Node.js)
4. **Add environment variables** before deploying
5. **Click Deploy**

### Option 4: Heroku (Paid - starting $7/month)
Classic Node.js hosting, but no longer has free tier.

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set EMAIL_USER=you@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password
heroku config:set NOTIFICATION_EMAIL=alerts@gmail.com
heroku config:set ADMIN_DASHBOARD_TOKEN=your_token

# Deploy
git push heroku main
```

---

## Email Setup (All Platforms)

1. **Enable 2-Factor Authentication on Gmail**:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"

2. **Create Gmail App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select **Mail** and **Windows Computer**
   - Copy the 16-character password

3. **Set Environment Variables**:
   - In deployment platform: add `EMAIL_PASSWORD` = the 16-char password you just copied
   - Also set `EMAIL_USER` and `NOTIFICATION_EMAIL`

---

## Database

The app uses SQLite locally (`data/messages.db`), which is auto-created and populated on first run.

**⚠️ Important**: On **Render/Railway/Heroku**, the database file is temporary and will reset when your app restarts.

For persistent database, upgrade to:
- **Render Postgres** ($7/month)
- **Railway Postgres** (included in free tier)
- Or set up **MongoDB Atlas** (free tier available)

Currently, messages are only saved temporarily. This is fine for testing.

---

## Domain Setup

After deploying, your app gets a free subdomain:
- Render: `your-app.onrender.com`
- Railway: `your-app.up.railway.app`
- Vercel: `your-app.vercel.app`

### Add Custom Domain:
1. Buy a domain (Namecheap, GoDaddy, Route53, etc.)
2. In your hosting platform, go to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS setup instructions (usually just update nameservers)

---

## First Deployment Checklist

- [ ] `.env` file exists locally (NOT committed to GitHub)
- [ ] `.env.example` has placeholders only
- [ ] `.gitignore` includes `.env`, `node_modules/`, `data/messages.db`
- [ ] All credentials are in `.env`, NOT hardcoded in files
- [ ] `package.json` has all dependencies
- [ ] Test locally: `npm start` works
- [ ] Push to GitHub
- [ ] Connect GitHub repo to hosting platform
- [ ] Set environment variables in hosting dashboard
- [ ] Deployment succeeds and site is live

---

## Monitoring & Troubleshooting

### Check logs:
- **Render**: Dashboard → Logs tab
- **Railway**: Dashboard → Logs
- **Vercel**: Deployments → View logs
- **Heroku**: `heroku logs --tail`

### Common issues:

**"PORT not set"**: App runs on port 3000 locally, but hosting platform sets `PORT` env var automatically. Check `server.js` uses: `const port = process.env.PORT || 3000;` ✓ (Already done)

**"Module not found"**: Run `npm install` before deploying. Platform usually does this automatically.

**"Email not working"**: Check environment variables are set correctly in dashboard.

---

## Security Checklist

✅ `.env` is in `.gitignore` (not pushed)
✅ `.env.example` has only placeholders
✅ Admin token is strong and random
✅ Email password is Gmail app password (not real password)
✅ HTTPS enabled automatically (all modern platforms)
✅ No API keys or secrets in code files

---

## Next Steps

1. Deploy to Render or Railway (easiest)
2. Set environment variables in dashboard
3. Visit your live app
4. Test contact form - you should get an email
5. Add custom domain when ready
