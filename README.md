# Smart Leads Dashboard - Enterprise MERN CRM

A production-grade Lead Management Dashboard built with the MERN stack using enterprise-level architecture, clean code principles, and a professional SaaS UI.

## 🚀 Tech Stack

### Frontend
- **React.js & TypeScript**: Type-safe component development.
- **TailwindCSS**: Utility-first CSS for a modern, responsive UI.
- **Zustand**: Lightweight and scalable state management.
- **TanStack Query (React Query)**: Powerful data fetching and caching.
- **React Hook Form + Zod**: Robust form handling and validation.
- **Framer Motion**: Smooth animations and transitions.
- **Recharts**: Interactive data visualizations.
- **Lucide Icons**: Consistent and professional iconography.

### Backend
- **Node.js & Express.js**: High-performance API server.
- **TypeScript**: Enhanced developer experience and type safety.
- **MongoDB & Mongoose**: Flexible and scalable NoSQL database.
- **JWT (Access + Refresh Tokens)**: Secure authentication flow with token rotation.
- **Security Middleware**: Helmet, CORS, Rate Limiting, Cookie-parser.
- **Layered Architecture**: Controllers -> Middleware -> Models -> Utils.

### DevOps
- **Docker & Docker Compose**: Containerized environment for easy deployment.
- **Centralized Error Handling**: Standardized API responses and error management.

## ✨ Key Features

- **Enterprise Auth**: Secure login/register with JWT and password hashing using bcrypt.
- **RBAC (Role-Based Access Control)**: 
  - **Admin**: Full access, including lead deletion and CSV export.
  - **Sales User**: View, create, and edit leads.
- **Advanced Leads Management**: Full CRUD operations with fields for Company, Phone, Source, and Status.
- **Intelligent Filtering & Search**: 
  - Filter by Status (New, Contacted, Qualified, Lost).
  - Filter by Source (Website, Instagram, Referral).
  - Search by Name, Email, or Company.
  - Sort by Latest, Oldest, or Alphabetical.
  - Combined multi-filter support.
- **Backend Pagination**: Mandatory 10 records per page with metadata in response.
- **Debounced Search**: Optimized performance for real-time search.
- **Analytics Dashboard**: Real-time stats with MongoDB aggregation and interactive charts.
- **CSV Export**: Export filtered lead data for offline analysis (Admin only).
- **Dark Mode Support**: High-visibility dark theme with persistence.
- **Responsive UI**: Clean, professional design optimized for all devices.

## 🛠️ Installation & Setup

### Using Docker (Recommended)
1. Clone the repository.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Access the frontend at `http://localhost` and backend at `https://smart-leads-dashboard-backend-suxv.onrender.com`.

### Local Development Setup

#### Backend
1. Navigate to the `backend` folder: `cd backend`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Start the development server: `npm run dev`.

#### Frontend
1. Navigate to the `frontend` folder: `cd frontend`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

### Vercel Deployment Steps (Frontend)
1. **Import Project**: Link your GitHub repo in Vercel.
2. **Configure Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
3. **Environment Variables**:
   - `VITE_API_URL`: `https://smart-leads-dashboard-backend-suxv.onrender.com/api/v1`
4. **Deploy**: Click deploy and Vercel will handle the rest.

## 📖 API Documentation

### Auth Routes
- `POST /api/v1/auth/register` - Register a new user.
- `POST /api/v1/auth/login` - Login user and receive tokens.
- `POST /api/v1/auth/logout` - Logout and clear tokens.

### Lead Routes (Protected)
- `GET /api/v1/leads` - Get all leads (with pagination, filter, search, sort).
- `GET /api/v1/leads/:id` - Get a single lead's details.
- `POST /api/v1/leads` - Create a new lead.
- `PUT /api/v1/leads/:id` - Update an existing lead.
- `DELETE /api/v1/leads/:id` - Delete a lead (Admin only).

### Analytics Routes (Protected)
- `GET /api/v1/analytics/stats` - Get dashboard statistics.

## 📂 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/      # Database connection
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Auth, error handling
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API route definitions
│   │   └── utils/       # Helpers (ApiResponse, ApiError)
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── layouts/     # Page wrappers
│   │   ├── pages/       # Route views
│   │   ├── services/    # API calls (Axios)
│   │   └── store/       # State management (Zustand)
```

## ✅ Evaluation Criteria Addressed
- **TypeScript**: Used throughout the project (interfaces, types, enums).
- **Clean Architecture**: Separation of concerns in both frontend and backend.
- **Security**: Password hashing, JWT, RBAC, and security headers.
- **UX**: Loading states, empty states, error handling, and dark mode.
- **Performance**: Debounced search and backend pagination.
- **Scalability**: Layered backend structure and reusable frontend components.


## 📂 Project Structure

### Backend
```text
backend/src/
├── config/         # Database and app configurations
├── controllers/    # Request handling logic
├── middleware/     # Auth, Error, Security, Logging
├── models/         # Mongoose schemas and types
├── routes/         # API endpoint definitions (v1)
├── services/       # Business logic layer
├── utils/          # Helpers (ApiError, ApiResponse, asyncHandler)
└── index.ts        # App entry point
```

### Frontend
```text
frontend/src/
├── app/            # Global providers
├── components/     # UI, Forms, Modals, Tables
├── features/       # Feature-specific logic
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts (Sidebar, Navbar)
├── pages/          # Main application views
├── services/       # API services (Axios instance)
├── store/          # Zustand state stores
└── types/          # Global TypeScript interfaces
```

## 🔒 API Documentation

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | POST | Create a new user | Public |
| `/api/v1/auth/login` | POST | User login | Public |
| `/api/v1/leads` | GET | Fetch paginated leads | Private |
| `/api/v1/leads` | POST | Create a lead | Private |
| `/api/v1/analytics/stats` | GET | Dashboard analytics | Admin Only |

## 👤 Role Permissions

- **Admin**: Full access to CRUD, Analytics, and CSV Export.
- **Sales User**: Can View, Create, and Edit leads. Cannot delete leads or access Analytics.

---
Built with ❤️ by [Your Name]
