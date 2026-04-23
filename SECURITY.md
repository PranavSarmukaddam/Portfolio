# Security Policy

This document outlines the security measures implemented in this portfolio application.

## Data Protection

### Environment Variables
- All sensitive data (API keys, passwords, tokens) are stored in `.env`
- `.env` is never committed to GitHub (protected by `.gitignore`)
- `.env.example` contains only placeholder values for reference
- Deployment platforms manage secrets securely

### Database
- Messages are stored locally in SQLite (`data/messages.db`)
- Database file is excluded from GitHub
- No personally identifiable information is logged unnecessarily
- Contact form data is validated before storage

## Security Headers & Middleware

### Helmet.js
- **Content-Security-Policy**: Prevents XSS attacks
- **X-Frame-Options**: Blocks clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Strict-Transport-Security**: Enforces HTTPS (on production)
- **X-XSS-Protection**: Additional XSS protection

### CORS
- Cross-origin requests are explicitly configured
- Prevents unauthorized sites from accessing your API

### Rate Limiting
- **5 requests per 15 minutes** per IP address
- Prevents spam and brute-force attacks
- Applied to contact form and API endpoints

## Input Validation

### Contact Form
- **Name**: Required, max 100 characters, no HTML
- **Email**: Required, valid email format
- **Message**: Required, max 5000 characters, sanitized
- **Honeypot field**: Hidden spam trap (catches bots)

### Admin Dashboard
- Token validation on every request
- Session management via localStorage

## Authentication & Authorization

### Admin Dashboard Token
- Required to access `/admin` endpoint
- Stored in `.env` as `ADMIN_DASHBOARD_TOKEN`
- **Recommendation**: Use a strong, random token (32+ characters)
- Can be changed anytime by updating `.env`

### API Endpoints
- `/api/admin/*` endpoints require token authentication
- Token passed as `Authorization` header
- Invalid tokens return 401 Unauthorized

## Best Practices

### Email Security
- **App Passwords**: Uses Gmail app password, not your actual password
- **TLS/SSL**: All email transmission is encrypted
- **Rate Limited**: One email notification per form submission

### Frontend Security
- **No sensitive data in localStorage** (except admin token)
- **Click tracking data** is minimal and anonymous
- **No third-party analytics** that expose user data

### Backend Security
- **No console logging** of sensitive data
- **Error messages** are generic (don't expose system details)
- **SQL Injection**: Protected by SQLite3 parameterized queries
- **NoSQL Injection**: N/A (not using NoSQL)

## Deployment Security

### Production Recommendations
1. **Use HTTPS** - All major platforms provide free SSL/TLS
2. **Environment Variables** - Set securely in platform dashboard (never commit)
3. **Strong Admin Token** - At least 32 random characters
4. **Monitor Logs** - Check for suspicious activity
5. **Regular Updates** - Keep Node.js and dependencies current

### Never Do This
- ❌ Commit `.env` file to GitHub
- ❌ Share your `.env` values publicly
- ❌ Use weak passwords or tokens
- ❌ Store unencrypted sensitive data
- ❌ Allow public access to admin endpoints without auth

## Dependency Security

### Regular Updates
```bash
# Check for vulnerable packages
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Current Dependencies
All dependencies are chosen for:
- **Security**: Regular security updates
- **Maintenance**: Active community and maintainers
- **Minimal**: Only include what's necessary

Key libraries:
- **Express**: Popular, well-maintained
- **Helmet**: Industry-standard security middleware
- **Nodemailer**: Trusted email library
- **SQLite3**: Reliable local database
- **express-rate-limit**: Proven rate limiting

## Incident Response

### If You Suspect a Breach

1. **Immediately rotate credentials**:
   ```bash
   # Change Gmail app password
   # Update ADMIN_DASHBOARD_TOKEN in .env
   # Redeploy to production
   ```

2. **Check logs** for suspicious activity

3. **Review contact submissions** for spam

4. **Monitor email account** for unauthorized access

### Reporting Security Issues

If you find a security vulnerability:
1. **Do NOT** create a public GitHub issue
2. **Email** the maintainer privately
3. Include details and proof of concept
4. Allow time for fix before public disclosure

## GDPR & Privacy Compliance

### Data Collection
- **Contact form**: Name, email, message (with user consent)
- **Click tracking**: Link clicks, user interactions (no personal data)
- **No cookies** used (except localStorage for admin token)
- **No third-party tracking**

### Data Storage
- Messages stored in SQLite (not sent to third parties)
- Tracking data stored locally
- No data sharing or selling

### User Rights
- No mechanism to delete user data automatically (plan to add)
- No user profiling or behavioral analysis
- Transparent about what data is collected

## Testing Security

### Manual Testing
```bash
# Check headers
curl -I http://localhost:3000

# Test rate limiting
for i in {1..10}; do curl http://localhost:3000/api/portfolio; done

# Validate form inputs
# Try XSS: <script>alert('xss')</script>
# Try SQL injection: ' or '1'='1
```

### Automated Testing
Consider adding:
- Dependency scanning (GitHub dependabot)
- OWASP ZAP scanning
- Regular penetration testing

## Security Updates Timeline

| Date | Vulnerability | Status |
|------|---|---|
| 2025-01 | Initial security audit | ✅ Complete |
| Ongoing | Dependency updates | ✅ Monitored |

## Contact

- 📧 For security issues: [your-secure-email]
- 🐙 For bugs: GitHub Issues
- 📚 See: [DEPLOYMENT.md](DEPLOYMENT.md) for platform-specific security

---

**Last Updated**: April 2025  
**Status**: Active & Maintained
