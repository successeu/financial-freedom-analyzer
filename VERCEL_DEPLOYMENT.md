# 🚀 Deploy Financial Freedom Analyzer to Vercel

## Step-by-Step Deployment Guide

### ✅ Prerequisites

You'll need:
- GitHub account (free at https://github.com)
- Vercel account (free at https://vercel.com)
- Your Anthropic API Key (from https://console.anthropic.com)

---

## 📋 Part 1: Prepare Your Files

Create a new folder on your computer:

```
financial-freedom-analyzer/
├── api/
│   └── server.js          ← Backend code
├── public/
│   └── index.html         ← Frontend form
├── package.json           ← Dependencies
├── vercel.json            ← Vercel config
├── .gitignore             ← Git ignore file
└── README.md              ← Documentation
```

### Files to Create:

1. **Copy these files** into your project folder:
   - `api/server.js` (the serverless function)
   - `public/index.html` (the form)
   - `package.json`
   - `vercel.json`
   - `.gitignore`

2. **Create `public/index.html`** with the Financial Freedom Analyzer HTML form
   - Update the API endpoint to: `https://YOUR-VERCEL-URL.vercel.app/api/submit-form`

---

## 🔑 Part 2: Create GitHub Repository

### Step 1: Go to GitHub
1. Open https://github.com
2. Click "New repository"
3. Name it: `financial-freedom-analyzer`
4. Click "Create repository"

### Step 2: Initialize Git (On Your Computer)

```bash
# Navigate to your project folder
cd financial-freedom-analyzer

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/financial-freedom-analyzer.git

# Push to GitHub
git push -u origin main
```

---

## 🚀 Part 3: Deploy to Vercel

### Step 1: Connect Vercel to GitHub
1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Search for "financial-freedom-analyzer"
5. Click "Import"

### Step 2: Configure Environment Variables
1. In the Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your actual Claude API key (from https://console.anthropic.com)
3. Click "Add"

### Step 3: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for deployment to complete
3. You'll get a URL like: `https://financial-freedom-analyzer.vercel.app`

---

## 🔗 Part 4: Update Your HTML Form

In `public/index.html`, find the form submit function and update:

```javascript
// Old (local):
fetch('http://localhost:3001/api/submit-form', {

// New (Vercel):
fetch('https://financial-freedom-analyzer.vercel.app/api/submit-form', {
```

Or use the `VERCEL_URL` environment variable automatically:

```javascript
const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/submit-form`
  : 'http://localhost:3001/api/submit-form';

fetch(API_URL, {
```

---

## ✅ Testing Your Deployment

### Test 1: Check API Status
Open in browser:
```
https://your-vercel-url.vercel.app/status
```

You should see:
```json
{
  "status": "running",
  "timestamp": "...",
  "message": "Financial Freedom Analyzer API"
}
```

### Test 2: Submit a Test Form
1. Open your Vercel URL
2. Fill out the form with:
   - Email: `june.yoon@juneyoon.com`
   - Monthly Income: `5000`
   - Monthly Expenses: `3200`
   - Current Savings: `15000`
3. Click "Generate Your Plan"
4. Check logs in Vercel dashboard (Functions tab)

### Test 3: Verify in Active Campaign
1. Log into your AC account
2. Go to Contacts
3. Search for the email you submitted
4. You should see the contact created!

---

## 📊 Vercel Dashboard Features

Once deployed, you can:
- **View Logs:** Functions → Logs → Click function name
- **Monitor Performance:** Analytics tab
- **Manage Domains:** Add custom domain
- **Scale Automatically:** Vercel handles traffic spikes
- **Rollback Versions:** Deployments tab

---

## 🔧 Troubleshooting

### "Build failed"
- Check `package.json` exists
- Verify file paths are correct
- Look at Build Logs in Vercel dashboard

### "API returns 500 error"
- Check ANTHROPIC_API_KEY is set in Vercel
- View Function Logs in Vercel dashboard
- Verify API key is valid

### "Contact not created in AC"
- Check AC MCP is still connected in Claude
- Verify API key has AC permissions
- Look at Function Logs for error details

### "CORS error in browser"
- CORS is already enabled in `server.js`
- Make sure you're using the Vercel URL, not localhost

---

## 📈 Next Steps After Deployment

1. **Share the Form:** Give the Vercel URL to users
2. **Monitor Submissions:** Check Vercel logs and AC contacts
3. **Set Up Automations:** Create workflows in AC based on responses
4. **Create Custom Fields:** Map financial data to AC fields
5. **Build Dashboard:** Track submissions and progress

---

## 🎯 Your Live URL

Once deployed, you'll have:

```
Form: https://your-app.vercel.app
API: https://your-app.vercel.app/api/submit-form
Status: https://your-app.vercel.app/status
```

---

## 📞 Need Help?

If you get stuck:
1. Check Vercel build logs
2. Check Vercel function logs
3. Verify environment variables are set
4. Check that all files are in the correct folders

**Good luck! 🚀**
