# 🏥 ProxyPharma

> **Votre santé, à proximité** — Application web de recherche et livraison de médicaments certifiés à Douala et Yaoundé, Cameroun.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-MVP-orange)

-----

## 📋 Présentation

ProxyPharma est une plateforme d’intermédiation permettant aux habitants de **Douala** et **Yaoundé** de :

- 🔍 Rechercher des médicaments certifiés CPNN
- 🏥 Localiser les pharmacies agréées DPML
- 💊 Comparer les prix entre officines
- 🚴 Se faire livrer à domicile en **30 à 60 minutes**
- 💳 Payer via **Orange Money** ou **MTN MoMo**
- 📄 Téléverser leurs ordonnances ONMC

-----

## 🏗️ Architecture

```
ProxyPharma/
├── frontend/          # Next.js 14 + TailwindCSS (PWA)
├── backend/           # FastAPI + PostgreSQL + Redis
├── docs/              # Documentation légale & conformité
└── docker-compose.yml # Déploiement local
```

-----

## 🛠️ Stack technique

|Composant           |Technologie                    |
|--------------------|-------------------------------|
|Frontend            |Next.js 14 + TailwindCSS       |
|Backend             |FastAPI (Python 3.11)          |
|Base de données     |PostgreSQL 15                  |
|Cache               |Redis 7                        |
|Stockage ordonnances|Cloudflare R2 (chiffré AES-256)|
|Paiement            |Orange Money API + MTN MoMo API|
|Notifications       |Twilio SMS + Firebase FCM      |
|Déploiement         |Render.com + Vercel            |

-----

## 🚀 Démarrage rapide

### Prérequis

- Docker + Docker Compose
- Node.js 18+
- Python 3.11+

### Installation

```bash
# Cloner le repo
git clone https://github.com/Mohamat-tech/ProxyPharma.git
cd ProxyPharma

# Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos valeurs

# Lancer avec Docker
docker-compose up --build
```

### Accès

|Service          |URL                         |
|-----------------|----------------------------|
|Frontend         |<http://localhost:3000>     |
|Backend API      |<http://localhost:8000>     |
|Documentation API|<http://localhost:8000/docs>|

-----

## 📱 Pages Frontend

|Page              |Description                             |
|------------------|----------------------------------------|
|`/`               |Accueil — recherche + pharmacies proches|
|`/auth`           |Connexion / Inscription                 |
|`/map`            |Carte interactive des pharmacies        |
|`/medicament/[id]`|Fiche médicament détaillée              |
|`/commande`       |Tunnel de commande 3 étapes             |
|`/livraison/[id]` |Suivi livraison en temps réel           |

-----

## ⚙️ API Endpoints

### Auth

```
POST   /api/v1/auth/register     Inscription
POST   /api/v1/auth/login        Connexion
GET    /api/v1/auth/me           Profil utilisateur
PUT    /api/v1/auth/me           Modifier profil
DELETE /api/v1/auth/me           Supprimer compte (RGPD)
```

### Médicaments

```
GET    /api/v1/medicines/search        Recherche full-text
GET    /api/v1/medicines/{id}          Fiche médicament
GET    /api/v1/medicines/{id}/stocks   Stocks par pharmacie
```

### Pharmacies

```
GET    /api/v1/pharmacies/                    Liste + filtres
GET    /api/v1/pharmacies/{id}                Détail pharmacie
GET    /api/v1/pharmacies/{id}/stock          Stock pharmacie
GET    /api/v1/pharmacies/nearest/with-stock  Plus proche avec stock
```

### Commandes

```
POST   /api/v1/orders/                  Créer une commande
GET    /api/v1/orders/my                Mes commandes
GET    /api/v1/orders/{id}              Détail commande
POST   /api/v1/orders/{id}/confirm-otp  Confirmer réception OTP
POST   /api/v1/orders/{id}/cancel       Annuler commande
```

### Ordonnances

```
POST   /api/v1/ordonnances/             Téléverser ordonnance
GET    /api/v1/ordonnances/my           Mes ordonnances
POST   /api/v1/ordonnances/{id}/verify  Vérifier (Admin)
DELETE /api/v1/ordonnances/{id}         Supprimer (RGPD)
```

-----

## 🔐 Sécurité & Conformité

|Mesure             |Détail                                |
|-------------------|--------------------------------------|
|Authentification   |JWT (HS256)                           |
|Chiffrement transit|HTTPS TLS 1.3                         |
|Chiffrement repos  |AES-256 (ordonnances)                 |
|Protection données |Loi N°2024/017 — Privacy by Design    |
|Ordonnances        |Conformité décision ONMC juillet 2024 |
|Pharmacies         |Certifiées DPML + inscrites ONPC      |
|Médicaments        |Catalogue CPNN — AMM valide uniquement|
|DPO                |Désigné avant le 23 juin 2026         |

-----

## 📊 Modèle économique

|Source              |Mécanisme                 |
|--------------------|--------------------------|
|Commission          |2–5% par commande         |
|Abonnement pharmacie|Forfait mensuel           |
|Livraison premium   |Supplément express        |
|Données B2B         |Rapports marché anonymisés|

-----

## 🗓️ Planning MVP

|Phase  |Contenu                         |Durée |
|-------|--------------------------------|------|
|Phase 0|Cadrage juridique DPML/ONPC     |1 mois|
|Phase 1|MVP Douala — 20 pharmacies      |3 mois|
|Phase 2|Extension Yaoundé               |2 mois|
|Phase 3|Croissance — 10 000 utilisateurs|3 mois|

-----

## ⚠️ Conformité réglementaire

- [ ] Consultation DPML avant lancement
- [ ] Partenariat ONPC — onboarding pharmacies
- [ ] Contact ONMC — vérification ordonnances
- [ ] Déclaration ANTIC plateforme en ligne
- [ ] Mise en conformité Loi N°2024/017 **(avant 23 juin 2026)**
- [ ] Désignation DPO **(avant 23 juin 2026)**

-----

## 👤 Équipe

**ProxyPharma Team** — Université de Yaoundé I
INF 232 EC2 — Mai 2026

-----

## 📄 Licence

MIT © 2026 ProxyPharma Team
