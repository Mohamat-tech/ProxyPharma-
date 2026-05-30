# 🚀 Guide de Déploiement ProxyPharma

## Render (Backend) + Vercel (Frontend)

-----

## 1. BACKEND — Render.com

### 1.1 Préparer le backend

Créer le fichier `backend/render.yaml` :

```yaml
services:
  - type: web
    name: proxypharma-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: proxypharma-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: REDIS_URL
        fromService:
          name: proxypharma-redis
          type: redis
          property: connectionString
      - key: APP_ENV
        value: production
      - key: FRONTEND_URL
        value: https://proxypharma.vercel.app

databases:
  - name: proxypharma-db
    databaseName: proxypharma
    user: proxy
```

### 1.2 Étapes sur Render.com

1. Va sur **render.com** → créer un compte
1. Clique **New** → **Web Service**
1. Connecte ton repo GitHub **Mohamat-tech/ProxyPharma**
1. Configure :
- **Name** : `proxypharma-backend`
- **Root Directory** : `backend`
- **Runtime** : `Python 3.11`
- **Build Command** : `pip install -r requirements.txt`
- **Start Command** : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
1. Clique **Create Web Service**

### 1.3 Base de données PostgreSQL sur Render

1. **New** → **PostgreSQL**
1. **Name** : `proxypharma-db`
1. **Plan** : Free
1. Copie l’**Internal Database URL**
1. Ajoute-la comme variable d’environnement `DATABASE_URL`

### 1.4 Redis sur Render

1. **New** → **Redis**
1. **Name** : `proxypharma-redis`
1. **Plan** : Free
1. Copie l’**Internal Redis URL**
1. Ajoute-la comme variable `REDIS_URL`

### 1.5 Variables d’environnement sur Render

Dans **Environment** de ton Web Service, ajoute :

|Variable              |Valeur                          |
|----------------------|--------------------------------|
|`DATABASE_URL`        |URL PostgreSQL Render           |
|`REDIS_URL`           |URL Redis Render                |
|`SECRET_KEY`          |Clé secrète longue et aléatoire |
|`APP_ENV`             |`production`                    |
|`FRONTEND_URL`        |`https://proxypharma.vercel.app`|
|`S3_ENDPOINT`         |URL Cloudflare R2               |
|`S3_BUCKET`           |`proxypharma-ordonnances`       |
|`S3_ACCESS_KEY_ID`    |Clé R2                          |
|`S3_SECRET_ACCESS_KEY`|Secret R2                       |
|`ORANGE_MONEY_API_KEY`|Clé Orange Money                |
|`MTN_MOMO_API_KEY`    |Clé MTN MoMo                    |
|`TWILIO_ACCOUNT_SID`  |SID Twilio                      |
|`TWILIO_AUTH_TOKEN`   |Token Twilio                    |
|`TWILIO_PHONE`        |Numéro Twilio                   |

-----

## 2. FRONTEND — Vercel

### 2.1 Préparer le frontend

Créer `frontend/next.config.js` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
```

Créer `frontend/package.json` :

```json
{
  "name": "proxypharma-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

### 2.2 Étapes sur Vercel

1. Va sur **vercel.com** → créer un compte
1. Clique **Add New** → **Project**
1. Importe le repo **Mohamat-tech/ProxyPharma**
1. Configure :
- **Framework Preset** : `Next.js`
- **Root Directory** : `frontend`
1. Ajoute la variable d’environnement :
- `NEXT_PUBLIC_API_URL` = URL de ton backend Render
  ex: `https://proxypharma-backend.onrender.com/api/v1`
1. Clique **Deploy**

-----

## 3. CLOUDFLARE R2 (Stockage ordonnances)

1. Va sur **cloudflare.com** → **R2**
1. Crée un bucket : `proxypharma-ordonnances`
1. Active le chiffrement AES-256
1. Crée une **API Token** avec permissions `Object Read & Write`
1. Copie :
- `S3_ENDPOINT` : `https://<account-id>.r2.cloudflarestorage.com`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

-----

## 4. GITHUB SECRETS (CI/CD)

Dans ton repo GitHub → **Settings** → **Secrets and variables** → **Actions** :

|Secret          |Description   |
|----------------|--------------|
|`RENDER_API_KEY`|Clé API Render|
|`VERCEL_TOKEN`  |Token Vercel  |
|`DATABASE_URL`  |URL PostgreSQL|
|`SECRET_KEY`    |Clé JWT       |

-----

## 5. CI/CD — GitHub Actions

Créer `.github/workflows/ci.yml` :

```yaml
name: CI/CD ProxyPharma

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run tests
        run: |
          cd backend
          pytest tests/test_api.py -v

  deploy-backend:
    needs: test-backend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
            https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys

  deploy-frontend:
    needs: test-backend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

-----

## 6. URLs FINALES

Une fois déployé :

|Service     |URL                                              |
|------------|-------------------------------------------------|
|Frontend    |`https://proxypharma.vercel.app`                 |
|Backend API |`https://proxypharma-backend.onrender.com`       |
|API Docs    |`https://proxypharma-backend.onrender.com/docs`  |
|Health Check|`https://proxypharma-backend.onrender.com/health`|

-----

## 7. CHECKLIST DÉPLOIEMENT

- [ ] Backend déployé sur Render
- [ ] PostgreSQL créé sur Render
- [ ] Redis créé sur Render
- [ ] Variables d’environnement configurées
- [ ] Frontend déployé sur Vercel
- [ ] `NEXT_PUBLIC_API_URL` pointant vers Render
- [ ] Bucket R2 créé et chiffré
- [ ] Secrets GitHub configurés
- [ ] CI/CD GitHub Actions actif
- [ ] Health check `/health` répond ✅
