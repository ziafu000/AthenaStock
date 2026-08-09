# Deployment Guide

## Overview

This guide covers deploying Athena Stock to Vercel and configuring production environment.

---

## Prerequisites

- GitHub/GitLab/Bitbucket repository
- Vercel account (free tier works)
- Domain name (optional)
- Google Cloud Console project (for Calendar/Meet)
- Resend account (for emails)

---

## Environment Variables

Create these in Vercel dashboard or \.env.local\:

\\\ash
# Admin Contact
ADMIN_EMAIL=your-admin@email.com

# Google Calendar/Meet Integration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_REFRESH_TOKEN=1//your-refresh-token

# Email Service (Resend)
RESEND_API_KEY=re_your-api-key
SENDER_EMAIL=Your Name <noreply@yourdomain.com>

# Booking Security
BOOKING_SECRET=random-secure-string-here

# Public URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_RECRUITMENT_FORM_URL=https://forms.google.com/your-form
\\\

---

## Google Calendar Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google Calendar API

### 2. Create OAuth Credentials

1. APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs: \https://developers.google.com/oauthplayground\

### 3. Get Refresh Token

1. Go to [OAuth Playground](https://developers.google.com/oauthplayground)
2. Settings → Use your own OAuth credentials
3. Enter Client ID and Secret
4. Select scope: \https://www.googleapis.com/auth/calendar\
5. Authorize and get refresh token

---

## Resend Setup

1. Sign up at [Resend](https://resend.com)
2. Get API key from dashboard
3. Add and verify your domain
4. Update \SENDER_EMAIL\ with verified domain

**Note:** Resend sandbox mode only sends to verified emails.

---

## Vercel Deployment

### Option 1: GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: \./\
   - Build Command: \
pm run build\
   - Output Directory: \.next\
5. Add environment variables
6. Deploy!

### Option 2: Vercel CLI

\\\ash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
\\\

---

## Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)
4. Update \NEXT_PUBLIC_APP_URL\ environment variable

---

## Build Configuration

Vercel automatically detects Next.js settings. Manual config in \ercel.json\ (optional):

\\\json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"]
}
\\\

---

## Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Google Calendar API working (test booking)
- [ ] Resend domain verified (test email)
- [ ] Custom domain configured
- [ ] Analytics enabled
- [ ] Sitemap accessible at \/sitemap.xml\
- [ ] Robots.txt accessible at \/robots.txt\
- [ ] Dark mode works correctly
- [ ] All content renders properly

---

## Monitoring

### Vercel Dashboard

- Deployment logs
- Function logs
- Analytics
- Speed Insights

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for detailed user behavior

---

## CI/CD

**Automatic Deployments:**
- Push to \main\ → Production
- Push to other branches → Preview

**Manual Deployments:**
\\\ash
vercel --prod
\\\

---

## Troubleshooting

### Build Fails

Check:
- Node version (needs 18+)
- Environment variables set
- No TypeScript errors: \
pm run build\

### Calendar API Not Working

Check:
- Client ID/Secret correct
- Refresh token valid (tokens don't expire)
- Calendar API enabled in Google Cloud Console

### Emails Not Sending

Check:
- Resend API key valid
- Domain verified in Resend
- \SENDER_EMAIL\ uses verified domain

---

## Further Documentation

- [Architecture](./ARCHITECTURE.md)
- [Component API](./COMPONENT-API.md)
- [Content Guide](./CONTENT-GUIDE.md)
- [API Routes](./API-ROUTES.md)
- [Features](./FEATURES.md)
