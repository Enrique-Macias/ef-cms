# Frontend Structure & Architecture

## 🏗️ **Project Architecture**

This CMS project uses a **monorepo structure** with separate frontend and backend services:

```
ef-cms/
├── src/
│   ├── app/                 # Next.js 15 Frontend (Admin Dashboard)
│   │   ├── login/          # Authentication pages
│   │   ├── dashboard/      # Main admin interface
│   │   ├── users/          # User management
│   │   ├── news/           # News management
│   │   ├── events/         # Events management
│   │   └── testimonials/   # Testimonials management
│   ├── api/                 # Express.js Backend API
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   └── middleware/     # Auth, validation, etc.
│   └── components/          # Reusable UI components
├── prisma/                  # Database schema & migrations
└── package.json             # Single package.json for both
```

## 🚀 **How It Works**

### **1. Frontend (Next.js 15)**
- **Port**: 3000
- **Purpose**: Admin dashboard interface
- **Features**: 
  - User authentication
  - Content management (CRUD operations)
  - User management
  - Dashboard with analytics

### **2. Backend (Express.js)**
- **Port**: 3001
- **Purpose**: API server and business logic
- **Features**:
  - RESTful API endpoints
  - Authentication & authorization
  - Database operations via Prisma
  - File uploads (Cloudinary)
  - Email services

### **3. API Communication**
- Frontend makes API calls to `/api/*` routes
- Next.js API routes proxy requests to Express backend
- Backend processes requests and returns responses
- JWT tokens handle authentication

## 📱 **Frontend Pages Structure**

```
/login                    # Authentication
/dashboard               # Main dashboard (overview)
/dashboard/users         # User management
/dashboard/news          # News articles management
/dashboard/events        # Events management
/dashboard/testimonials  # Testimonials management
/dashboard/settings      # System settings
```

## 🎨 **UI Components**

### **Dashboard Components**
- `Sidebar`: Navigation menu with all sections
- `Header`: Top bar with search and user menu
- `DashboardPage`: Overview with stats and recent activity

### **Shared Components**
- `Button`: Reusable button component
- `Input`: Form input fields
- `Modal`: Popup dialogs
- `Table`: Data tables for listings

## 🔐 **Authentication Flow**

1. **Login**: User enters credentials
2. **API Call**: Frontend calls `/api/auth/login`
3. **Token Storage**: JWT access token stored in localStorage
4. **Protected Routes**: Dashboard requires valid token
5. **API Requests**: Token sent in Authorization header

## 🚀 **Development Commands**

```bash
# Frontend only
npm run dev

# Backend only  
npm run dev:api

# Both frontend and backend
npm run dev:full
```

## 🌐 **Environment Variables**

```env
# Frontend
BACKEND_URL=http://localhost:3001

# Backend
FRONTEND_URL=http://localhost:3000
DATABASE_URL=your-railway-postgresql-url
JWT_SECRET=your-jwt-secret
# ... other backend variables
```

## 📊 **Data Flow**

```
User Action → Frontend Component → API Route → Express Backend → Database
     ↑                                                              ↓
Response ← Frontend Component ← API Route ← Express Backend ← Database
```
