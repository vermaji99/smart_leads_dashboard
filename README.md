# Smart Leads Dashboard 🚀

A professional, production-grade MERN stack CRM dashboard for efficient lead management and analytics. Built with a focus on modern UI/UX, performance, and security.

## ✨ Features

- **Authentication & Authorization**: Secure JWT-based auth with Role-Based Access Control (RBAC).
- **Lead Management**: Complete CRUD for leads with advanced filtering, search, and pagination.
- **Advanced Analytics**: Real-time data visualization using Recharts with theme-aware styling.
- **Enterprise UI**: Premium SaaS aesthetic with consistent status coloring and a fully responsive layout.
- **Dark Mode**: High-contrast, accessibility-compliant dark theme using a deep-blue palette.
- **CSV Export**: Admin-only feature to export lead data for external analysis.
- **Clean Architecture**: Organized codebase following Controller-Service-Repository patterns.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS v4, TanStack Query, Zustand, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Zod.
- **DevOps**: Docker, multi-stage builds, Render (Backend), Vercel/Render (Frontend).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vermaji99/smart_leads_dashboard.git
   cd smart_leads_dashboard
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   cp .env.example .env
   # Update .env with your MongoDB URI and JWT Secrets
   npm install
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   cp .env.example .env
   # Update .env with your Backend API URL
   npm install
   npm run dev
   ```

## 🌍 Deployment

### Backend (Render)
1. Use the provided `Dockerfile` for multi-stage building.
2. Set environment variables in Render: `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `FRONTEND_URL`.

### Frontend (Vercel/Render Static Site)
1. Build command: `npm run build`.
2. Publish directory: `dist`.
3. **Crucial**: Set rewrite rules for SPA routing (`/*` -> `/index.html`) to avoid 404 errors on direct navigation.

## 🔒 Security

- **CORS**: Dynamic origin whitelist for production and development.
- **Helmet**: Secure HTTP headers.
- **Rate Limiting**: Protection against brute-force attacks in production.
- **Validation**: Strict schema validation using Zod.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
