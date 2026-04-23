# Portfolio Website - Full Stack

A modern, responsive portfolio website built with Node.js + Express + SQLite + Vanilla JS. Features include a contact form with email notifications, admin dashboard with analytics, and click tracking.

## Features

- ✅ **Full-stack application**: Express backend + vanilla JS frontend
- ✅ **Portfolio content management**: Edit `data/portfolio.json` to customize
- ✅ **Contact form**: Stores messages in SQLite + sends email notifications
- ✅ **Admin dashboard**: Protected endpoint at `/admin` with analytics
- ✅ **Click tracking**: Tracks navigation, links, and interactions
- ✅ **Mobile responsive**: Works great on all devices
- ✅ **Security hardened**: Helmet.js, rate limiting, input validation, honeypot spam protection
- ✅ **Production ready**: Easy deployment to Render, Railway, Vercel, or Heroku

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Gmail account (for email notifications - optional)

### Local Development

1. **Clone and install**:
```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
npm install
```

2. **Create `.env` file** (copy from `.env.example`):
```bash
cp .env.example .env
```

3. **Edit `.env`** with your settings:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
NOTIFICATION_EMAIL=where_you_want_alerts@gmail.com
ADMIN_DASHBOARD_TOKEN=pick_a_long_random_token
```

4. **Start the server**:
```bash
npm start
```

5. **Open your browser**:
```
http://localhost:3000
```

## Project Structure

```
portfolio/
├── server.js                 # Express server + API routes
├── index.html               # Main portfolio page
├── admin.html               # Protected admin dashboard
├── script.js                # Frontend logic + form handling
├── styles.css               # Responsive styling
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── DEPLOYMENT.md            # Deployment guide
├── data/
│   ├── portfolio.json       # Your resume/portfolio content
│   └── messages.db          # Contact form submissions (SQLite)
├── assets/
│   ├── profile.jpg          # Your profile photo
│   └── resume.pdf           # Your resume/CV
└── scripts/
    └── extract-resume.js    # Resume parser utility
```

## Customize Your Portfolio

### 1. Edit your content
Open `data/portfolio.json` and update:
- **about**: Your background story
- **summary**: Headline text on homepage
- **highlights**: Key achievements
- **skills**: Your technical skills
- **projects**: Portfolio projects (with links)
- **experience**: Work history
- **services**: What you offer
- **links**: Email, GitHub, LinkedIn, etc.

### 2. Add your photo
1. Save your photo as `assets/profile.jpg` (or any format)
2. Update `profilePhoto` in `data/portfolio.json` to match the filename
3. Refresh the browser

### 3. Add your resume
1. Save your resume as `assets/resume.pdf`
2. Update `resumePdf` in `data/portfolio.json`
3. The "Download Portfolio PDF" button will appear

## Email Notifications

When someone submits the contact form, you automatically get an email!

### Setup (Takes 2 minutes):
1. **Enable 2-Factor Authentication**: https://myaccount.google.com/security
2. **Create App Password**: https://myaccount.google.com/apppasswords
3. **Copy the 16-character password**
4. **Add to `.env`**: `EMAIL_PASSWORD=your_16_char_password`
5. **Restart server**: `npm start`

See [DEPLOYMENT.md](DEPLOYMENT.md) for more details.

## Admin Dashboard

Access the protected admin dashboard at `/admin` with your admin token.

**Features:**
- View total messages, clicks, events
- List all contact form submissions
- Track user interactions (which links people click)

**Security**: Token-protected, requires strong password.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main portfolio page |
| `/admin` | GET | Admin dashboard (requires token) |
| `/api/portfolio` | GET | Portfolio content (JSON) |
| `/api/messages` | POST | Submit contact form |
| `/api/track` | POST | Track clicks/interactions |
| `/api/admin/stats` | GET | Admin stats (requires token) |
| `/api/admin/messages` | GET | List messages (requires token) |
| `/api/admin/events` | GET | List events (requires token) |

## Deploy to Production

Ready to go live? Choose your platform:

### 🚀 **Render** (Recommended - Free tier)
Easiest deployment, free tier available, auto-deploys from GitHub.
[See detailed guide](DEPLOYMENT.md#option-1-render-free-tier-available)

### 🚂 **Railway** (Great free tier)
$5/month credit, generous free tier, simple setup.
[See detailed guide](DEPLOYMENT.md#option-2-railway-free-tier)

### ⚡ **Vercel** (Fastest)
Ultra-fast, serverless, great for static sites.
[See detailed guide](DEPLOYMENT.md#option-3-vercel)

### 🚀 **Heroku** (Paid - $7/month)
Classic option, but no longer offers free tier.
[See detailed guide](DEPLOYMENT.md#option-4-heroku-paid---starting-7month)

**[→ Full Deployment Guide](DEPLOYMENT.md)**

## Security Features

- ✅ **Helmet.js**: Protects against common web vulnerabilities
- ✅ **Rate limiting**: Max 5 requests per 15 minutes per IP
- ✅ **Input validation**: All form inputs validated
- ✅ **Honeypot**: Hidden spam trap field
- ✅ **CORS enabled**: Configurable cross-origin requests
- ✅ **Environment variables**: No hardcoded secrets

## Database

Currently uses **SQLite** for simplicity. Messages are stored in `data/messages.db`.

**⚠️ Note**: On stateless hosting platforms (Render, Railway, Heroku), the database resets on restarts. For persistent storage, upgrade to:
- Render Postgres ($7/month)
- Railway Postgres (included in $5/month tier)
- MongoDB Atlas (free tier available)

See [DEPLOYMENT.md](DEPLOYMENT.md#database) for more.

## Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Module not found
```bash
npm install
npm start
```

### Email not working
- Check `.env` file exists in project root
- Verify Gmail app password is correct (16 characters)
- Make sure 2-Factor Authentication is enabled on Gmail
- Restart the server after changing `.env`

### Database issues
- Delete `data/messages.db` and restart (fresh database)
- Check file permissions if on Linux/Mac

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Email**: Nodemailer with Gmail SMTP
- **Security**: Helmet.js, express-rate-limit, validator
- **Frontend**: Vanilla JavaScript, responsive CSS
- **Fonts**: Inter, Playfair Display (Google Fonts)
- **Icons**: Font Awesome

## Environment Variables

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com              # Gmail address
EMAIL_PASSWORD=your_16_char_app_password    # Gmail app password (not your actual password!)
NOTIFICATION_EMAIL=alerts@gmail.com         # Where to send alerts

# Admin Security
ADMIN_DASHBOARD_TOKEN=your_strong_token     # At least 32 characters, random
```

## License

MIT License - feel free to use this as a template for your own portfolio!

## Support

- 📧 Email contact form on the site
- 🐙 GitHub Issues
- 📚 Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help

---

**Made with ❤️**
