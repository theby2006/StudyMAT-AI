# StudyMate AI Frontend - Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Setup Steps

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   - Create `.env` file (copy from `.env.example`)
   - Set `VITE_API_URL=http://localhost:3000` (or your backend URL)
   ```bash
   VITE_API_URL=http://localhost:3000
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   - App runs on `http://localhost:5173`
   - Hot-reload enabled for live development

4. **Build for production**
   ```bash
   npm run build
   ```
   - Creates optimized bundle in `dist/` folder
   - Includes minified CSS and JS
   - Includes `_redirects` for SPA routing

5. **Preview production build locally**
   ```bash
   npm run preview
   ```
   - Test the bundled app before deployment
   - Runs on `http://localhost:4173`

---

## Deployment to Netlify

### Option A: Drag & Drop (Quickest)

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Drag dist/ folder to Netlify**
   - Go to https://app.netlify.com
   - Create new site: "Add new site" → "Deploy manually"
   - Drag the `dist/` folder to the drop zone
   - Netlify will deploy and assign a URL

3. **Set environment variables**
   - Go to Site settings → Build & deploy → Environment
   - Add variable: `VITE_API_URL = https://your-backend-url.onrender.com`
   - This env var is available during build-time for Vite

4. **Test the deployed site**
   - Verify all routes work (SPA routing via `_redirects`)
   - Test auth flow (register, login, logout)
   - Test API calls reach the backend

---

### Option B: GitHub Auto-Deploy (Recommended for Teams)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Frontend ready for deployment"
   git push origin main
   ```

2. **Connect GitHub to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Authorize GitHub
   - Select repository: `THEBIKAN/StudyMAT-AI`
   - Configure:
     - **Branch to deploy**: main
     - **Build command**: `npm run build`
     - **Publish directory**: frontend/dist
     - **Environment variables**: 
       - `VITE_API_URL = https://your-backend-url.onrender.com`

3. **Deploy**
   - Netlify auto-deploys when you push to main branch
   - Check Deploys tab for status

---

## Build Output

The `dist/` folder contains:

```
dist/
├── index.html          # Entry point (SPA shell)
├── _redirects          # Netlify routing rules (/* → /index.html)
└── assets/
    ├── index-[hash].css    # Bundled & minified Tailwind CSS
    └── index-[hash].js     # Bundled & minified React + dependencies
```

**Size**: ~186 kB total (index.js), ~2.7 kB (index.css) after gzip

---

## Production Checklist

- [ ] `.env` file configured with correct `VITE_API_URL`
- [ ] `npm run build` completes without errors
- [ ] `npm run preview` works and routes are functional
- [ ] SPA routing verified (refresh page → stays on current route)
- [ ] Auth flow tested (register → login → dashboard → logout)
- [ ] API calls reach backend (check Network tab in DevTools)
- [ ] Netlify environment variables set
- [ ] `_redirects` file deployed (Netlify handles SPA routing)
- [ ] Site responds on custom domain (if applicable)
- [ ] HTTPS enabled (Netlify auto-enables)

---

## Troubleshooting

### Build errors
- **"Cannot find module"**: Run `npm install`
- **"Unexpected token"**: Ensure Node.js v16+ is installed (`node --version`)
- **CSS not loading**: Check `tailwind.config.js` content paths

### Deployment issues
- **Routes not working**: Verify `_redirects` file is in dist/ (check Netlify Deploy preview)
- **API calls failing**: Check `VITE_API_URL` env var is set correctly on Netlify
- **CORS errors**: Backend must include frontend URL in `Access-Control-Allow-Origin`
- **Blank page**: Check browser console for errors (DevTools → Console tab)

### Environment variables on Netlify
- Vite only injects env vars that start with `VITE_`
- Changes require redeploy: Go to Netlify → Deploys → "Trigger deploy" (pick last commit)

---

## Backend Integration

Ensure backend is deployed and has:
- CORS configured to allow frontend URL
- `/api/auth/login` endpoint
- `/api/auth/register` endpoint
- `/api/notes` CRUD endpoints
- `/api/ai/*` endpoints for summarize, flashcards, quiz
- `/api/progress` endpoints

Backend example: https://studymate-backend.onrender.com

---

## Performance Notes

- **Bundle size**: Reasonable for production (186 kB JS, 2.7 kB CSS gzipped)
- **Recommendation**: Monitor bundle size as new features are added
- **Code-splitting**: Vite automatically splits vendor code; no manual config needed
- **Caching**: Static assets cached via Netlify (set expires header if needed)

---

## Next Steps

1. Deploy backend (if not already done)
2. Get backend URL (e.g., `https://studymate-backend.onrender.com`)
3. Build frontend: `npm run build`
4. Deploy to Netlify with backend URL as `VITE_API_URL`
5. Test all features in production

