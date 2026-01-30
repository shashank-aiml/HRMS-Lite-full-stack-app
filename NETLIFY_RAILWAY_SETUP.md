# Connect Frontend (Netlify) and Backend (Railway)

Use these **exact values** for your deployment.

---

## Your URLs

| Service  | URL |
|----------|-----|
| **Frontend (Netlify)** | https://silly-cranachan-7ca8e7.netlify.app |
| **Backend (Railway)**  | https://hrms-lite-full-stack-app-production.up.railway.app |

---

## Step 1: Railway (backend) – set CORS

1. Open **[Railway Dashboard](https://railway.app/dashboard)** → your project → **backend** service.
2. Go to **Variables** (or **Settings** → **Variables**).
3. Add or edit:
   - **Variable name:** `CORS_ORIGINS`
   - **Value (copy exactly):**  
     `https://silly-cranachan-7ca8e7.netlify.app`  
     *(no trailing slash, no space)*
4. Save. Railway will redeploy the backend automatically.

---

## Step 2: Netlify (frontend) – set API URL

1. Open **[Netlify Dashboard](https://app.netlify.com)** → your site (**silly-cranachan-7ca8e7**).
2. Go to **Site configuration** → **Environment variables** (or **Build & deploy** → **Environment**).
3. Click **Add a variable** or **Edit**.
4. Add or edit:
   - **Key:** `VITE_API_BASE_URL`
   - **Value (copy exactly):**  
     `https://hrms-lite-full-stack-app-production.up.railway.app`  
     *(no trailing slash, no space)*
   - **Scopes:** check **Production** (and **Deploys** if you use Netlify to build).
5. Click **Save**.
6. **Trigger a new deploy:** go to **Deploys** → **Trigger deploy** → **Deploy site**.  
   *(The new variable is only used after a new build.)*

---

## Step 3: Verify

1. **Backend:** Open in a new tab:  
   [https://hrms-lite-full-stack-app-production.up.railway.app/health](https://hrms-lite-full-stack-app-production.up.railway.app/health)  
   You should see: `{"status":"ok"}`

2. **Frontend:** Open [https://silly-cranachan-7ca8e7.netlify.app/](https://silly-cranachan-7ca8e7.netlify.app/). The app should load and show employees/attendance without "Cannot reach the backend."

3. If it still fails: in Railway add **`CORS_ALLOW_ALL=1`** temporarily, redeploy, and test again. If it works, remove `CORS_ALLOW_ALL` and set `CORS_ORIGINS` again to `https://silly-cranachan-7ca8e7.netlify.app`, then redeploy.

---

## Quick copy-paste

**Railway Variable:**
```
CORS_ORIGINS=https://silly-cranachan-7ca8e7.netlify.app
```

**Netlify Variable:**
```
VITE_API_BASE_URL=https://hrms-lite-full-stack-app-production.up.railway.app
```
