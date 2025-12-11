# Quick Start Guide - Fiscal Tracker

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/parminder911/Fiscal-tracker.git
cd fiscal-tracker

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

### Access Application

```
http://localhost:3000
```

---

## 📊 What You'll See

### Dashboard
- **Summary Cards:** Total allocated, utilized, utilization %, project count
- **Status Overview:** On Track, At Risk, Delayed project counts
- **Village List:** Browse 3 sample villages
- **Project Details:** Budget allocation, utilization %, status badges

### API Endpoints (Test in Browser)

```
http://localhost:3000/api/villages
http://localhost:3000/api/summary
http://localhost:3000/api/districts
```

---

## 🔧 Sponsor Technology Integration

### 1. Cline CLI
- Used to generate API routes and components
- See: `SPONSOR_TECH_INTEGRATION.md`

### 2. Kestra Workflow
- Daily data summarization workflow
- File: `kestra/punjab-funds-summary.yml`
- See: `SPONSOR_TECH_INTEGRATION.md`

### 3. Oumi ML Model
- Project health prediction
- File: `src/ml/train_project_health_model.py`
- API: `POST /api/predict-health`

### 4. Vercel Deployment
- Deploy to: https://vercel.com
- See: `VERCEL_DEPLOYMENT.md`

### 5. CodeRabbit PR Reviews
- Install app: https://github.com/apps/coderabbit
- See: `GITHUB_SETUP.md`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `HACKATHON_README.md` | Complete project overview |
| `SPONSOR_TECH_INTEGRATION.md` | Sponsor tech details |
| `GITHUB_SETUP.md` | GitHub & CodeRabbit setup |
| `VERCEL_DEPLOYMENT.md` | Vercel deployment guide |
| `README_SETUP.md` | Database setup |

---

## 🎯 Next Steps

1. **Run locally:** `npm run dev`
2. **Test dashboard:** http://localhost:3000
3. **Setup GitHub:** Follow `GITHUB_SETUP.md`
4. **Deploy to Vercel:** Follow `VERCEL_DEPLOYMENT.md`
5. **Submit to hackathon:** Include GitHub link + live URL

---

## 📞 Support

- Check documentation files
- Review code comments
- Check GitHub issues

---

**Ready to submit to hackathon!** ✅
