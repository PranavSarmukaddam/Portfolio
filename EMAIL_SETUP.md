# Email Notifications Setup Guide

Your portfolio now sends you an email whenever someone submits the contact form!

## Quick Setup (2 minutes)

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Turn on **2-Step Verification** (if not already on)

### Step 2: Create an App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** and **Windows Computer**
3. Google will generate a 16-character password
4. **Copy this password**

### Step 3: Add Password to Your System
Create a `.env` file in the portfolio folder with:

```
EMAIL_USER=sarmukaddam.pranav@gmail.com
EMAIL_PASSWORD=your_16_char_password_here
NOTIFICATION_EMAIL=where_you_want_alerts@gmail.com
```

**Replace `your_16_char_password_here` with the password from Step 2**

### Step 4: Restart the Server
Stop the server (Ctrl+C) and run:
```
npm start
```

✅ Done! You'll now receive emails when someone contacts you.

## How It Works

- Someone fills the contact form
- The form is saved to `data/messages.json` (local storage)
- You receive an email with their message
- You can reply directly from your email

## Troubleshooting

**"Email service not configured" message?**
- Make sure the `.env` file exists in the portfolio folder
- Check the app password is correct (16 characters)
- Restart the server after creating `.env`

**Not receiving emails?**
- Check your Gmail spam folder
- Make sure 2FA is enabled
- Verify the app password is correct

**Security Note:**
- The app password is separate from your main Gmail password
- You can delete it anytime from Google Account settings
- It only works for this app
