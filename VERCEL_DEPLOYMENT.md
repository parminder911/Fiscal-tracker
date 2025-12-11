# Vercel Deployment Guide

## Overview
Deploy Fiscal Tracker to Vercel for live hosting with automatic CI/CD.

---

## Prerequisites

- GitHub account with repository: https://github.com/parminder911/Fiscal-tracker
- Vercel account: https://vercel.com
- Code pushed to GitHub main branch

---

## Step 1: Create Vercel Account

1. Visit: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access GitHub
5. Complete signup

---

## Step 2: Import Project

### Option A: From Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Search for: `Fiscal-tracker`
5. Select: `parminder911/Fiscal-tracker`
6. Click "Import"

### Option B: Direct Link

Visit: https://vercel.com/new/git?repository-url=https://github.com/parminder911/Fiscal-tracker

---

## Step 3: Configure Project

### Framework Selection
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Environment Variables

Add environment variables in Vercel:

1. Go to: Project Settings → Environment Variables
2. Add variables:

```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=fiscal-tracker2026
```

**Note:** For hackathon, you can use mock data (no database required)

### Root Directory
- Leave as default (root of repository)

---

## Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. See deployment status
4. Get live URL

**Live URL Format:**
```
https://fiscal-tracker.vercel.app
```

---

## Step 5: Verify Deployment

### Check Live Site

1. Visit: https://fiscal-tracker.vercel.app
2. Verify dashboard loads
3. Test API endpoints:
   ```
   https://fiscal-tracker.vercel.app/api/villages
   https://fiscal-tracker.vercel.app/api/summary
   ```

### Check Deployment Logs

1. Go to: Project → Deployments
2. Click latest deployment
3. View build logs
4. Check for errors

---

## Step 6: Configure Auto-Deployment

Vercel automatically deploys on git push:

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **Vercel detects changes**
   - Starts build automatically
   - Deploys to production

3. **View deployment**
   - Go to: https://vercel.com/dashboard
   - See deployment progress
   - Access live URL

---

## Step 7: Preview Deployments

For pull requests:

1. Create feature branch
   ```bash
   git checkout -b feat/new-feature
   ```

2. Make changes and push
   ```bash
   git push origin feat/new-feature
   ```

3. Create PR on GitHub

4. Vercel creates preview URL
   - Comment on PR with URL
   - Test changes before merge
   - Merge when ready

---

## Step 8: Custom Domain (Optional)

### Add Custom Domain

1. Go to: Project Settings → Domains
2. Click "Add Domain"
3. Enter domain: `fiscal-tracker.in` (example)
4. Configure DNS records
5. Verify domain

### DNS Configuration

For domain registrar:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Step 9: Environment-Specific Configs

### Development Environment

```
DB_HOST=localhost
DB_PORT=5432
```

### Production Environment

```
DB_HOST=prod-database.example.com
DB_PORT=5432
```

Set in Vercel:
1. Settings → Environment Variables
2. Select environment (Production, Preview, Development)
3. Add variable

---

## Step 10: Monitoring & Analytics

### Vercel Analytics

1. Go to: Project → Analytics
2. View:
   - Page load times
   - Web vitals
   - Traffic patterns
   - Error rates

### Logs

1. Go to: Project → Logs
2. View:
   - Build logs
   - Runtime logs
   - Function logs

### Monitoring

1. Go to: Project → Monitoring
2. Set up alerts for:
   - Build failures
   - High error rates
   - Performance degradation

---

## Deployment Configuration File

Create `vercel.json` (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "env": {
    "DB_USER": "@db_user",
    "DB_PASSWORD": "@db_password",
    "DB_HOST": "@db_host",
    "DB_PORT": "@db_port",
    "DB_NAME": "@db_name"
  },
  "functions": {
    "src/app/api/**/*.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

---

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - Dependency conflicts
   - TypeScript errors

**Solution:**
```bash
# Test locally
npm run build

# Fix errors
# Push to GitHub
git push origin main

# Vercel rebuilds automatically
```

### Deployment Stuck

1. Go to: Project → Deployments
2. Click "Redeploy" on latest deployment
3. Wait for build to complete

### Environment Variables Not Working

1. Verify variables in Vercel dashboard
2. Check variable names match code
3. Redeploy after adding variables

```bash
# In Vercel dashboard
Settings → Environment Variables
Add: DB_USER, DB_PASSWORD, etc.

# Then redeploy
```

### Database Connection Issues

For hackathon, use mock data (no database needed):

```javascript
// src/data/mockData.js
export const mockVillages = [...]
```

If using database:
1. Ensure database is accessible from Vercel
2. Add database IP to whitelist
3. Verify connection string in environment variables

---

## Performance Optimization

### Enable Caching

In `next.config.mjs`:

```javascript
export default {
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=120'
          }
        ]
      }
    ]
  }
}
```

### Image Optimization

Vercel automatically optimizes images:
- Converts to modern formats
- Responsive sizing
- Lazy loading

### Edge Functions (Advanced)

Use Vercel Edge Functions for low-latency APIs:

```javascript
// api/edge-function.js
export const config = {
  runtime: 'edge'
}

export default async function handler(request) {
  return new Response('Hello from Edge!')
}
```

---

## CI/CD Pipeline

### Automatic Deployments

1. **Push to main** → Production deployment
2. **Create PR** → Preview deployment
3. **Merge PR** → Production deployment

### Manual Deployment

1. Go to: Project → Deployments
2. Click "Redeploy"
3. Select commit
4. Click "Redeploy"

---

## Rollback

### Revert to Previous Deployment

1. Go to: Project → Deployments
2. Find previous deployment
3. Click "Promote to Production"
4. Confirm rollback

---

## Security

### Environment Variables

Never commit secrets to GitHub:

```bash
# .gitignore
.env.local
.env.*.local
```

Use Vercel's environment variable management:
1. Settings → Environment Variables
2. Add sensitive data
3. Reference in code

### CORS Configuration

If needed, configure CORS in `next.config.mjs`:

```javascript
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  }
}
```

---

## Monitoring Deployments

### Slack Integration (Optional)

1. Go to: Project Settings → Integrations
2. Add Slack
3. Authorize Slack workspace
4. Receive deployment notifications

### Email Notifications

1. Go to: Account Settings → Notifications
2. Enable email alerts for:
   - Deployment failures
   - Build errors
   - Performance issues

---

## Final Checklist

- [x] Vercel account created
- [x] GitHub repository connected
- [x] Project imported to Vercel
- [x] Environment variables configured
- [x] First deployment successful
- [x] Live URL accessible
- [x] API endpoints working
- [x] Auto-deployment enabled
- [x] Monitoring configured
- [x] Ready for hackathon submission

---

## Live URL

```
https://fiscal-tracker.vercel.app
```

---

## Next Steps

1. **Test live application**
   - Visit https://fiscal-tracker.vercel.app
   - Test all features
   - Verify API endpoints

2. **Create demo video**
   - Show dashboard
   - Demonstrate sponsor tech
   - Record API calls

3. **Submit to hackathon**
   - GitHub repository link
   - Live URL
   - Documentation links

---

## Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- Troubleshooting: https://vercel.com/docs/troubleshoot

---

**Last Updated:** December 12, 2025
**Status:** Ready for Production Deployment
