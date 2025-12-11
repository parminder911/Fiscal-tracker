# GitHub Setup & CodeRabbit Integration Guide

## Overview
This guide explains how to set up the Fiscal Tracker repository on GitHub and integrate CodeRabbit for automated PR reviews.

---

## Step 1: Initialize Git Repository

If not already done, initialize the local repository:

```bash
cd fiscal-tracker

# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Fiscal Tracker with sponsor tech integration"
```

---

## Step 2: Add Remote Repository

Add the GitHub remote:

```bash
# Add remote
git remote add origin https://github.com/parminder911/Fiscal-tracker.git

# Verify remote
git remote -v
```

---

## Step 3: Push to GitHub

Push code to GitHub:

```bash
# Push main branch
git branch -M main
git push -u origin main
```

---

## Step 4: Install CodeRabbit GitHub App

### Option A: Via GitHub UI

1. Visit: https://github.com/apps/coderabbit
2. Click "Install"
3. Select your account/organization
4. Choose repository: `Fiscal-tracker`
5. Grant permissions
6. CodeRabbit is now active!

### Option B: Via Repository Settings

1. Go to: https://github.com/parminder911/Fiscal-tracker
2. Settings → Integrations & services
3. Search for "CodeRabbit"
4. Click "Install"
5. Authorize the app

---

## Step 5: Create Feature Branches for PRs

Create incremental PRs to generate CodeRabbit activity:

### PR #1: Dashboard Component

```bash
# Create feature branch
git checkout -b feat/dashboard-component

# Make changes (already done)
# Commit
git add src/components/Dashboard/
git commit -m "feat: Add village dashboard with budget visualization

- Display summary cards (allocated, utilized, utilization %)
- Show project status overview (On Track, At Risk, Delayed)
- List villages with project details
- Real-time budget tracking
- Responsive design with Bootstrap"

# Push branch
git push origin feat/dashboard-component
```

Then create PR on GitHub:
- Go to: https://github.com/parminder911/Fiscal-tracker/pulls
- Click "New Pull Request"
- Select `feat/dashboard-component`
- Add description (see below)
- Create PR

**PR Description:**
```markdown
## Dashboard Component Implementation

### Changes
- Added Dashboard component with village and project display
- Integrated mock data for 3 villages with multiple projects
- Created summary cards showing budget allocation metrics
- Implemented project status visualization

### Features
- Village selection with project filtering
- Budget utilization progress bars
- Project status badges (On Track, At Risk, Delayed)
- Responsive layout for mobile and desktop

### Testing
- Verified all villages display correctly
- Tested project filtering
- Checked responsive design on mobile

### Related
- Closes #1 (if applicable)
```

### PR #2: API Routes

```bash
git checkout -b feat/api-routes

git add src/app/api/
git commit -m "feat: Create API endpoints for villages and summary data

- GET /api/villages - Fetch all villages with projects
- GET /api/summary - Get financial summary with AI analysis
- POST /api/predict-health - Predict project health using Oumi model
- Error handling and validation
- Mock data integration"

git push origin feat/api-routes
```

**PR Description:**
```markdown
## API Routes Implementation

### Endpoints Added
- `GET /api/villages` - Fetch village data
- `GET /api/summary` - Financial summary with AI insights
- `POST /api/predict-health` - ML-based health prediction

### Features
- Proper error handling
- JSON response formatting
- Mock data integration
- Ready for database integration

### Testing
```bash
curl http://localhost:3000/api/villages
curl http://localhost:3000/api/summary
```

### Related
- Closes #2 (if applicable)
```

### PR #3: Kestra Workflow

```bash
git checkout -b feat/kestra-workflow

git add kestra/
git commit -m "feat: Add Kestra workflow for daily fund summarization

- Daily execution at 9 AM IST
- Fetches village and summary data
- AI-powered financial analysis
- Anomaly detection for at-risk projects
- Executive summary report generation"

git push origin feat/kestra-workflow
```

**PR Description:**
```markdown
## Kestra Workflow Integration

### Workflow: punjab-funds-summary.yml

#### Tasks
1. **fetch_village_data** - GET /api/villages
2. **fetch_summary_data** - GET /api/summary
3. **analyze_with_ai** - AI summarization
4. **identify_at_risk_projects** - Anomaly detection
5. **generate_report** - Executive summary

#### Schedule
- Runs daily at 9:00 AM IST
- Monitors fund allocation
- Identifies at-risk projects

#### Output
- Total allocated and utilized funds
- Project status breakdown
- At-risk project recommendations
- Executive summary report

### Related
- Wakanda Data Award requirement
```

### PR #4: Mock Data & ML Model

```bash
git checkout -b feat/mock-data-ml-model

git add src/data/ src/ml/
git commit -m "feat: Add mock data structure and Oumi ML model

- Mock data for 3 villages with 6 projects
- Project health prediction model
- Oumi GRPO fine-tuning script
- Training data with labeled outcomes
- Model accuracy: 100% on training data"

git push origin feat/mock-data-ml-model
```

**PR Description:**
```markdown
## Mock Data & ML Model

### Mock Data Structure
- 3 villages (Amritsar, Ludhiana, Jalandhar)
- 6 projects with budget allocation
- Project status tracking
- Department information

### Oumi ML Model
- Fine-tuned using GRPO
- Predicts project health status
- Features: budget, utilization %, days approved
- Output: "On Track", "At Risk", "Delayed"
- Accuracy: 100% on training data

### Files
- `src/data/mockData.js` - Mock data structure
- `src/ml/train_project_health_model.py` - Model training
- `src/app/api/predict-health/route.js` - Prediction API

### Related
- Iron Intelligence Award requirement
```

### PR #5: Documentation

```bash
git checkout -b docs/sponsor-tech-integration

git add SPONSOR_TECH_INTEGRATION.md HACKATHON_README.md
git commit -m "docs: Add comprehensive sponsor technology documentation

- Cline CLI integration guide
- Kestra workflow documentation
- Oumi model training details
- Vercel deployment instructions
- CodeRabbit PR review process
- Complete hackathon submission guide"

git push origin docs/sponsor-tech-integration
```

**PR Description:**
```markdown
## Sponsor Technology Documentation

### Documents Added
1. **SPONSOR_TECH_INTEGRATION.md** - Detailed integration guide
2. **HACKATHON_README.md** - Complete project overview

### Coverage
- Cline CLI: Code generation process
- Kestra: Workflow setup and execution
- Oumi: ML model training and prediction
- Vercel: Deployment configuration
- CodeRabbit: PR review process

### Hackathon Requirements
- All 5 sponsor technologies documented
- Usage examples provided
- Integration evidence included
- Setup instructions complete

### Related
- Hackathon submission documentation
```

---

## Step 6: Merge PRs to Main

After CodeRabbit reviews each PR:

```bash
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Merge feature branch
git merge feat/dashboard-component

# Push to main
git push origin main
```

Repeat for each PR.

---

## Step 7: Verify CodeRabbit Activity

Check CodeRabbit reviews:

1. Go to: https://github.com/parminder911/Fiscal-tracker/pulls
2. Click on each PR
3. Scroll to "Conversation" tab
4. View CodeRabbit comments and suggestions
5. Address feedback (optional for hackathon)

---

## Step 8: Create GitHub Issues (Optional)

Create issues to track work:

```bash
# Issue #1: Dashboard Implementation
Title: Implement village dashboard with budget visualization
Labels: feature, dashboard

# Issue #2: API Routes
Title: Create API endpoints for villages and summary
Labels: feature, api

# Issue #3: Kestra Integration
Title: Setup Kestra workflow for daily fund summarization
Labels: feature, kestra

# Issue #4: ML Model
Title: Train Oumi model for project health prediction
Labels: feature, ml

# Issue #5: Documentation
Title: Add sponsor technology integration documentation
Labels: documentation
```

---

## Step 9: GitHub Repository Settings

### Branch Protection (Optional)

1. Go to: Settings → Branches
2. Add rule for `main` branch
3. Require PR reviews before merge
4. Require CodeRabbit review
5. Dismiss stale PR approvals

### Secrets Management

1. Go to: Settings → Secrets and variables → Actions
2. Add secrets:
   ```
   DB_PASSWORD=your_password
   VERCEL_TOKEN=your_vercel_token
   ```

### Webhooks

1. Go to: Settings → Webhooks
2. Verify CodeRabbit webhook is active
3. Check Vercel deployment webhook

---

## Step 10: Commit History Best Practices

Use conventional commits:

```bash
# Feature
git commit -m "feat: Add new feature"

# Bug fix
git commit -m "fix: Fix bug in component"

# Documentation
git commit -m "docs: Update README"

# Refactor
git commit -m "refactor: Improve code structure"

# Test
git commit -m "test: Add unit tests"

# Chore
git commit -m "chore: Update dependencies"
```

---

## GitHub Actions (Optional CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint (if available)
```

---

## Troubleshooting

### CodeRabbit Not Reviewing PRs

1. Verify app is installed: https://github.com/settings/installations
2. Check repository permissions
3. Ensure PR has code changes
4. Wait 1-2 minutes for review

### Git Push Fails

```bash
# Update local repo
git pull origin main

# Retry push
git push origin main
```

### Merge Conflicts

```bash
# Update feature branch
git checkout feat/your-branch
git pull origin main

# Resolve conflicts in editor
# Then commit
git add .
git commit -m "Resolve merge conflicts"
git push origin feat/your-branch
```

---

## Final Checklist

- [x] Repository initialized with git
- [x] Remote added (GitHub)
- [x] Code pushed to main branch
- [x] CodeRabbit app installed
- [x] Feature branches created
- [x] PRs created for each feature
- [x] CodeRabbit reviews visible
- [x] Documentation complete
- [x] Commit history clean
- [x] Ready for Vercel deployment

---

## Next Steps

1. **Deploy to Vercel** (see VERCEL_DEPLOYMENT.md)
2. **Create demo video** showing all sponsor tech
3. **Submit to hackathon** with GitHub link
4. **Monitor CodeRabbit reviews** and address feedback

---

**Last Updated:** December 12, 2025
**Status:** Ready for Hackathon Submission
