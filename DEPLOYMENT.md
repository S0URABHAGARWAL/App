# Deployment Guide: ScaleOn Session Intelligence App

## Quick Start: Deploy to Firebase in 5 Minutes

This guide walks you through deploying the ScaleOn Session Intelligence app to Firebase with all backend services wired up.

---

## Prerequisites

✅ Node.js 18+ and npm installed
✅ Firebase account (free tier is fine)
✅ This GitHub repo cloned locally
✅ Resend or SendGrid account for email
✅ Google Cloud project with Gemini API enabled

---

## Step 1: Create a Firebase Project (2 min)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name it: `scaleon-app` (or your choice)
4. Accept terms → Create Project
5. Wait for initialization to complete

---

## Step 2: Copy Firebase Config (1 min)

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon (</> symbol)
4. Register app as `scaleon-app`
5. Copy the Firebase config object (you'll need it next)

---

## Step 3: Set Up Environment Variables (2 min)

1. Clone this repo locally:
   ```bash
   git clone https://github.com/S0URABHAGARWAL/App.git
   cd App
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` and fill in:
   - Firebase config keys (from Step 2)
   - Gemini API key (from Google Cloud Console)
   - Resend API key (from Resend dashboard)
   - Internal email: `ops@scaleon-consulting.com` (or your email)

---

## Step 4: Install Firebase CLI (1 min)

```bash
npm install -g firebase-tools
```

---

## Step 5: Initialize Firebase Locally (1 min)

```bash
npm install
firebase login
firebase init
```

When prompted:
- Select "Hosting" and "Functions"
- Choose your project from Step 1
- Accept defaults for most questions
- For public directory, enter: `.`

---

## Step 6: Test Locally (2 min)

```bash
firebase emulators:start
```

Open `http://localhost:5000` to test the app locally.

---

## Step 7: Deploy to Production (1 min)

```bash
firebase deploy
```

Your app is now live! Firebase will output your hosting URL:
```
Hosting URL: https://scaleon-app.web.app
```

---

## Step 8: Test Email Workflow (2 min)

1. Open your live app URL
2. Fill in the session form with test data
3. Submit → You should receive:
   - Internal email to `ops@scaleon-consulting.com`
   - Client email to the address provided in the form
4. Check both mailboxes to confirm

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install` in root AND `functions/` folder

### Issue: Firebase authentication fails
**Solution**: Run `firebase login` again, ensure you're logged into correct Google account

### Issue: Emails not sending
**Solution**: Check Resend API key in `.env.local`, verify it's correct in Firebase environment config

### Issue: App loads but no Gemini response
**Solution**: Verify Gemini API is enabled in Google Cloud Console, check API key is correct

---

## Using Firebase Studio (Alternative)

If you prefer a UI-based approach:

1. Go to [Firebase Studio](https://studio.firebase.google.com)
2. Click "Import Project" → select this GitHub repo
3. Firebase Studio will auto-detect your setup
4. Add secrets via Studio UI (no .env files needed)
5. Deploy via one-click button

---

## Production Checklist

- [ ] Environment variables set in Firebase Console (not .env.local)
- [ ] Resend API key secured
- [ ] Gemini API rate limits configured
- [ ] Firestore security rules reviewed
- [ ] CORS settings configured for your domain
- [ ] Error logging enabled
- [ ] Backups configured in Firestore
- [ ] Team invited to Firebase project
- [ ] Custom domain configured (optional)

---

## Next Steps

1. **Add Auth**: Set up Firebase Auth for team login
2. **Analytics**: Enable Google Analytics in Firebase
3. **Monitoring**: Set up Cloud Monitoring for uptime alerts
4. **Database Backups**: Configure automatic Firestore backups
5. **CI/CD**: Set up GitHub Actions for auto-deploy on push

---

## Support

Stuck? Check:
- README.md for architecture overview
- Firebase Docs: https://firebase.google.com/docs
- Resend Docs: https://resend.com/docs
- Google Gemini API: https://ai.google.dev/

**Questions**: File an issue in this GitHub repo or contact ops@scaleon-consulting.com
