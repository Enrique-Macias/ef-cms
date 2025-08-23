# EF CMS - Content Management System

A modern, secure content management system built with Next.js, Express.js, and PostgreSQL.

## Features

- **User Management**: Admin and Editor roles with secure authentication
- **Content Management**: Events, News, and Testimonials with image support
- **Security**: JWT authentication, rate limiting, audit logging, CSRF protection
- **Image Handling**: Cloudinary integration for optimized image storage
- **Email System**: Automated emails for user management and password reset
- **Audit Trail**: Comprehensive logging of all user actions

## Tech Stack

### Frontend
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- React 19

### Backend
- Express.js
- Prisma ORM
- PostgreSQL (Railway)
- JWT Authentication
- Rate Limiting
- Helmet Security

### Services
- Cloudinary (Image Storage)
- Nodemailer (Email Service)
- bcryptjs (Password Hashing)

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (Railway)
- Cloudinary account
- SMTP email service

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ef-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # JWT Secrets
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Email (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@yourdomain.com
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

## Development

### Running the application

**Frontend only (Next.js):**
```bash
npm run dev
```

**Backend only (Express API):**
```bash
npm run dev:api
```

**Both frontend and backend:**
```bash
npm run dev:full
```

### Database management

```bash
# Open Prisma Studio
npm run db:studio

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate
```

## Project Structure

```
ef-cms/
├── src/
│   ├── app/                 # Next.js frontend pages
│   ├── api/                 # Express.js backend API
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── server.ts        # Express server
│   ├── lib/                 # Shared utilities
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── prisma.ts        # Prisma client
│   │   ├── cloudinary.ts    # Cloudinary configuration
│   │   ├── email.ts         # Email service
│   │   └── audit.ts         # Audit logging
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Content Management (Coming Soon)
- Events CRUD operations
- News CRUD operations
- Testimonials CRUD operations
- Image upload and management
- User management (Admin only)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet**: Security headers and middleware
- **CORS**: Configurable cross-origin resource sharing
- **Audit Logging**: Complete audit trail of all actions
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Zod schema validation

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT access tokens | Yes |
| `JWT_REFRESH_SECRET` | Secret for JWT refresh tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `SMTP_HOST` | SMTP server host | Yes |
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASS` | SMTP password | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No (defaults to localhost:3000) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
