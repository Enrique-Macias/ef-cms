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

## 🔗 **External API Integrations**

### **Avatar Placeholder API**
- **URL**: [https://avatar-placeholder.iran.liara.run/](https://avatar-placeholder.iran.liara.run/)
- **Purpose**: Generate user avatars from names
- **Usage**: 
  ```typescript
  // Generate avatar for user "John Doe"
  const avatarUrl = `https://avatar.iran.liara.run/username?username=John+Doe&background=f4d9b2&color=FF9800&size=128`
  ```
- **Features**:
  - Customizable background colors
  - Font color options
  - Size control (32-1024px)
  - Bold/uppercase options
  - PNG/JPG format support

### **DeepL API**
- **Purpose**: Professional translation services (ES ↔ EN)
- **Use Cases**:
  - Auto-translate content between Spanish and English
  - Maintain bilingual content consistency
  - Real-time translation in admin interface
- **Integration**: Backend service for content translation

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

# External APIs
DEEPL_API_KEY=your-deepl-api-key
AVATAR_API_BASE_URL=https://avatar.iran.liara.run

# ... other backend variables
```

## 📊 **Data Flow**

```
User Action → Frontend Component → API Route → Express Backend → Database
     ↑                                                              ↓
Response ← Frontend Component ← API Route ← Express Backend ← Database
```

## 🔧 **Key Benefits of This Structure**

1. **Separation of Concerns**: Frontend and backend are independent
2. **Scalability**: Can deploy frontend and backend separately
3. **Development Experience**: Single repository, easy to manage
4. **Type Safety**: Shared TypeScript types between services
5. **Flexibility**: Can easily switch to separate repos later

## 🚀 **Next Steps**

1. **Create Content Management Pages**: News, Events, Testimonials CRUD
2. **Add User Management**: Create, edit, delete users
3. **Implement File Uploads**: Image management for content
4. **Add Analytics**: Dashboard charts and metrics
5. **Responsive Design**: Mobile-friendly interface
6. **Testing**: Unit and integration tests
