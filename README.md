# Eneba Intern Assignment — Marketplace (Work in Progress)

A full-stack digital gaming marketplace built as an internship assignment.

> **Status:** Work in progress. The marketplace is not production-ready and no real purchases or key fulfillment are enabled.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** PHP REST API, PDO PostgreSQL
- **Database:** Supabase PostgreSQL (products, sellers and offers)
- **Planned authentication:** Supabase Auth

## Current progress

- Eneba-inspired responsive frontend and storefront components
- Initial product listing and product detail UI
- PHP backend with health and products endpoints
- Supabase database schema and test product/seller/offer records
- Backend database connection and HTTPS-independent local development setup

Some frontend components still display **demo content**. Product data is being migrated to PHP API responses; do not assume all features use the database yet.

## Planned features

- Live storefront integration with backend-provided data
- Search, filtering and sorting
- Seller offers on product detail pages
- Registration, login and protected account pages
- Server-validated cart and simulated checkout
- Order history and simulated digital key delivery
- Tests, documentation and security hardening

## Local development

### Requirements

- Node.js and npm
- PHP with `pdo_pgsql` and `pgsql` extensions
- Composer
- A PostgreSQL database (the project uses Supabase)

### Backend

```powershell
cd backend
composer install
Copy-Item .env.example .env
# Edit backend/.env with your own PostgreSQL connection settings.
php -S 127.0.0.1:8000 -t public public/router.php
```

Health check: `http://127.0.0.1:8000/api/health`  
Catalog (initial endpoint): `http://127.0.0.1:8000/api/products`

For database TLS verification, install and configure the appropriate trusted CA certificate for your connection, if required. Do not disable certificate verification.

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:5173`.

> The source files need to be pushed from the developer's local project folder. These instructions describe the intended project layout and may evolve as integration continues.

## Security

- Never commit `backend/.env`, `frontend/.env.local`, credentials, private keys or database certificates.
- Frontend Vite environment variables are **public**; never store server secrets in them.
- Backend-only database credentials and server-side authorization are required.
- The current sample database and UI are for development/testing.
- Checkout and key fulfillment are not ready for real-money use.

## Assignment notes

AI-assisted development is part of this assignment. Keep the required AI usage/conversation documentation for the final submission.

## License / trademarks

Educational project. Eneba and referenced game/product trademarks belong to their respective owners. This project is not affiliated with or endorsed by Eneba.
