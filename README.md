# Eneba Intern Assignment — Digital Marketplace

A full-stack digital gaming marketplace built as an internship assignment. The project includes a React storefront, PHP REST API, Supabase authentication and PostgreSQL-backed marketplace data.

## Project links

| Resource | Link |
|---|---|
| **Live demo** | [https://eneba-intern-assignment.vercel.app/](https://eneba-intern-assignment.vercel.app/) |
| **GitHub source code** | [KA-MIS/Eneba-Intern-Assignment](https://github.com/KA-MIS/Eneba-Intern-Assignment) |
| **AI development history** | [ChatGPT conversation — prompts and responses](https://chatgpt.com/share/6af7b9e8-73ac-83ed-b707-73414066df36) |

## Reviewer demo account

A pre-created Supabase Auth account is available for reviewers, so registration and email verification are not required.

- **Login email:** `test@gmail.com`
- **Password:** provided privately with the assignment submission (not stored in this repository)

Open the [live demo](https://eneba-intern-assignment.vercel.app/), select **Sign in**, and use the reviewer credentials. The account can be used to explore the demo checkout flow with demo wallet funds.

## Overview

The application is designed as a digital marketplace for games and gift cards. It provides a responsive storefront and supporting account and checkout flows.

### Implemented functionality

- **Homepage:** promotional banners and product sections populated through API requests, plus category and recently viewed sections.
- **Store/catalog:** product browsing with search, filtering, sorting and pagination.
- **Search:** product search, including partial-title and typo-tolerant matching in the backend search implementation.
- **Product details:** product information, seller offers and offer selection.
- **Shopping cart:** add and manage selected seller offers.
- **Checkout:** authenticated demo checkout with server-side order processing and validation. This is a simulation; no real-money payment processing is enabled.
- **Authentication:** Supabase registration, login, session handling and protected account routes.
- **Account area:** account overview and order-related pages.
- **Responsive UI:** custom marketplace styling for desktop and mobile layouts.

> Some homepage elements, such as category navigation and recently viewed products, are assembled on the frontend. Recently viewed items are stored locally in the visitor's browser.

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | PHP REST API |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Database access | PDO |
| Routing | React Router |

## Local development

### Prerequisites

- Node.js and npm
- PHP with the `pdo_pgsql` extension
- Composer
- A Supabase project with the required database schema and environment settings

### 1. Clone the repository

```bash
git clone https://github.com/KA-MIS/Eneba-Intern-Assignment.git
cd Eneba-Intern-Assignment
```

### 2. Configure the backend

```bash
cd backend
composer install
```

Copy the example environment file and add your own database connection settings:

```powershell
Copy-Item .env.example .env
```

Start the PHP development server:

```bash
php -S 127.0.0.1:8000 -t public public/router.php
```

The API health endpoint is available at:

```
http://127.0.0.1:8000/api/health
```

### 3. Configure the frontend

In a separate terminal:

```bash
cd frontend
npm install
```

Create the local environment file:

```powershell
Copy-Item .env.example .env.local
```

Set `VITE_API_URL` to the URL of your PHP API. Configure the Supabase URL and publishable/anon key using the variable names expected by `frontend/src/lib/supabaseClient.ts`.

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production build

From the `frontend` directory:

```bash
npm run build
```

## Security notes

- Never commit `.env` files, credentials, private keys or database certificates.
- Frontend Vite environment variables are public. Never put server-side secrets in them.
- Keep database credentials on the backend.
- Validate and authorize sensitive operations on the server.
- Checkout is a demo flow and must not be used to process real payments.
- Use HTTPS and correctly configured production environment variables when deploying.

## AI-assisted development

AI tools were used during development as a coding and learning aid. The shared conversation below documents prompts and responses:

- [Open the ChatGPT development conversation](https://chatgpt.com/share/6af7b9e8-73ac-83ed-b707-73414066df36)

The conversation link should be checked before submission to ensure that the evaluators can access it and that it covers the development work being submitted. If additional development conversations were used, include those separately.

## Project status

The live demo and source code are provided above for review. This is an internship assignment/demo project, not a production payment platform. Demo checkout and order flows do not represent real financial transactions.
