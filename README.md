# 🛒 ECOM-PRO -- E-Commerce MERN

> Complete MERN E‑Commerce Application  
> Backend + Store frontend + Admin panel (React + Vite)

---

## 🚀 Overview

A full-stack MERN e-commerce project:
- Backend: Node.js + Express API (user auth, products, cart, orders, payments)
- Store frontend: React (or legacy frontend folder)
- Admin panel: React + Vite (newly added) for content & order management
- Database: MongoDB (or PostgreSQL option)

This repository is a monorepo with separate folders:
- backend/       — API server
- frontend/      — customer storefront
- admin/         — admin panel (React + Vite)
- .github/workflows/ci.yml — CI that runs tests for frontend and backend and merges dev → main on push to dev

---

## ⚡ Updated Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Server | Express |
| Database | MongoDB / Mongoose (Postgres option) |
| Store Frontend | React (Create React App / Vite) |
| Admin Panel | React + Vite |
| Auth | JWT + bcrypt |
| Payments | Stripe / Razorpay / PayPal |
| CI | GitHub Actions (runs on push to dev, tests and merges dev → main) |
| Docs | Swagger / OpenAPI |

---

## 🔐 Key Features

- JWT-based authentication and role-based access (admin/customer)
- Product CRUD, categories, filtering, pagination
- Cart, wishlist, checkout and order management
- Admin panel for product, order and user management (React + Vite)
- Payment gateway integrations
- API documentation (Swagger) and Postman collection (planned)

---

## 📁 Repository structure

Example:
- backend/
  - package.json
  - src/
- frontend/
  - package.json
  - src/
- .github/
  - workflows/ci.yml
- README.md

---

## 🚀 Local development

Backend:
- cd backend
- npm i
- npm run dev

Store frontend:
- cd frontend
- npm i
- npm run dev

Tests:
- cd backend && npm test
- cd frontend && npm test
- cd admin && npm test

---

## 📖 Roadmap

- Complete orders & payments implementation (Q4 2025)
- API docs (Swagger) & Postman collection
- Docker compose for local dev
- Deployment scripts and examples
- End-to-end tests & performance tuning

---

## 🤝 Contributing

- Fork → branch from dev → open PR targeting dev
- CI validates tests; maintainers merge dev → main (CI also handles merge if enabled)

---

⭐ Star the repo for updates. Contact project maintainer for access or questions.  