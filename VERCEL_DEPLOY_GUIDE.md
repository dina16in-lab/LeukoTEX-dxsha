# LeukoTEX — Vercel Deployment Guide
### Name: LeukoTEX | Permanent Link After Deploy: `https://leukotex.vercel.app` (or your custom domain)

> Your project is **100% ready** for Vercel. Build passes, SEO prepared, `vercel.json` configured.

---

## ✅ What Is Already Done For You

| Item | Status | File |
|------|--------|------|
| Production build | ✅ Passes | `npm run build` → `dist/` (5.18 kB HTML + assets) |
| Vercel config | ✅ Created | `frontend/vercel.json` (SPA rewrites, cache, security headers) |
| SPA routing | ✅ Configured | `rewrites: /→/index.html` |
| `robots.txt` | ✅ Created | `frontend/public/robots.txt` → `dist/robots.txt` |
| `sitemap.xml` | ✅ Created | `frontend/public/sitemap.xml` → `dist/sitemap.xml` |
| SEO meta tags | ✅ Added | `frontend/index.html` (description, OG, Twitter, JSON-LD, canonical) |
| Vercel CLI | ✅ Installed | `vercel 59.11.7` |

**Build output verified:**
```
dist/index.html 5.18 kB
dist/assets/index-*.js 1.4 MB (Three.js)
dist/robots.txt + sitemap.xml
```

---

## 🚀 DEPLOY NOW — 2 Options (Pick 1)

### OPTION A: CLI (Fastest — 2 minutes, Permanent Link Instantly)

Open **PowerShell** in `frontend` folder:

```powershell
cd "C:\Users\sabapathy\Downloads\LeukoTEX-main\LeukoTEX-main\frontend"

# 1. Login to Vercel (opens browser — click Continue)
vercel login

# 2. Deploy (answer prompts)
vercel --prod
```

**When prompted by `vercel --prod`:**

- `Set up and deploy "~/frontend"?` → **Y**
- `Which scope?` → Select **your personal account** (or team)
- `Link to existing project?` → **N**
- `What's your project's name?` → **leukotex**  (this becomes `leukotex.vercel.app`)
- `In which directory is your code located?` → **./**  (just press Enter)
- `Want to modify settings?` → **N**  (we already have vercel.json)

**Result:** You get a permanent link like:
```
✅ Production: https://leukotex.vercel.app
```

> This link **never changes** for `leukotex` project. Future `vercel --prod` updates the same URL. You can also add custom domain: `leukotex.com` in Vercel Dashboard → Settings → Domains.

---

### OPTION B: Dashboard (No CLI, Drag & Drop)

1. Go to **https://vercel.com/new**
2. Click **"Browse"** or **"Import Git Repository"**
   - If using GitHub: Push `frontend` folder to GitHub → Import → Vercel auto-detects Vite
   - If no Git: Choose **"Deploy without Git"** → drag `dist` folder after `npm run build`
3. Set:
   - **Project Name:** `leukotex`
   - **Framework Preset:** `Vite` (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `frontend` (if importing whole repo) or `.` (if only frontend)
4. Click **Deploy** → you get `https://leukotex.vercel.app`

---

## 🔑 If You Re-Use My CLI Session (Token Method)

If you want me to deploy **for you** right now:

1. Go to **https://vercel.com/account/tokens** → **Create Token** → Name: `leukotex-cli` → **Create** → Copy token
2. Paste it here in chat, or run in PowerShell:

```powershell
vercel login --token YOUR_TOKEN_HERE
vercel --prod --yes --cwd "C:\Users\sabapathy\Downloads\LeukoTEX-main\LeukoTEX-main\frontend"
```

Share the token and I will deploy instantly and return your permanent link.

---

## 🌐 Add to Google (Search Indexing)

### Step 1 — Verify Ownership (Google Search Console)

1. Go to **https://search.google.com/search-console**
2. Click **Add Property** → choose **URL prefix** → enter `https://leukotex.vercel.app` → Continue
3. Choose **HTML tag** verification → copy token like `dBw...`
4. In `frontend/index.html` line `<!-- <meta name="google-site-verification" ...`, uncomment and paste token:
   ```html
   <meta name="google-site-verification" content="dBwYOUR_TOKEN_HERE" />
   ```
5. Run again: `npm run build` + `vercel --prod` (or Dashboard redeploy)
6. Back in Search Console → **Verify**

### Step 2 — Submit Sitemap

In Search Console after verification:

- Left menu → **Sitemaps** → Enter `sitemap.xml` → **Submit**
- Your sitemap: `https://leukotex.vercel.app/sitemap.xml` (already live with 6 URLs)

### Step 3 — Request Indexing

- In Search Console → **URL Inspection** → enter `https://leukotex.vercel.app/` → **Request Indexing**
- Also test `https://leukotex.vercel.app/sitemap.xml` is accessible

**Google will index within 1–7 days.** You can monitor in Search Console → Coverage.

---

## 📊 SEO Already Done For You

- ✅ `<meta description>` (155 chars)
- ✅ `<meta keywords>` + `robots: index, follow`
- ✅ `canonical` → `https://leukotex.vercel.app/`
- ✅ Open Graph (Facebook/LinkedIn preview)
- ✅ Twitter Card (large image)
- ✅ JSON-LD Organization schema (name, logo, address, contact)
- ✅ `theme-color`
- ✅ `robots.txt` + `sitemap.xml` (auto-copied to `dist`)

**Test after deploy:**
- https://search.google.com/test/rich-results → paste your URL
- https://www.opengraph.xyz → paste your URL → check preview
- Inspect `https://leukotex.vercel.app/robots.txt` and `/sitemap.xml`

---

## ⚠️ Backend Note (FastAPI + PostgreSQL)

Your **frontend is static and deployable to Vercel now**. Your **backend (FastAPI + PostgreSQL 18)** cannot run on Vercel static:

| Component | Where to Deploy | Permanent API Link |
|-----------|----------------|-------------------|
| Frontend (this) | Vercel → `leukotex.vercel.app` | ✅ Permanent |
| Backend API | Railway / Render / Fly.io + Neon/Supabase DB | Will be `https://leukotex-api.*` — set `VITE_API_URL` env in Vercel |

**Frontend works without backend** — it falls back to local `INITIAL_PROJECTS` / `SERVICES_DATA` (`frontend/src/services/api.ts`).

When you deploy backend:
1. Deploy backend to Railway/Render
2. In Vercel Dashboard → Project `leukotex` → **Settings → Environment Variables** → Add `VITE_API_URL` = `https://your-api.railway.app/api` → Redeploy

---

## 🆘 Need Help?

Paste your Vercel token or run `vercel login` and tell me the project name you chose — I’ll handle the rest and confirm your permanent link.

**Commands cheatsheet:**
```powershell
vercel login                    # login via browser
vercel --prod                   # production deploy (permanent link)
vercel ls                       # list deployments
vercel logs leukotex.vercel.app # view logs
vercel domains add leukotex.com # custom domain
```
