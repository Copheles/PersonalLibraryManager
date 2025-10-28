# Personal Library Manager

Fully featured Personal Library Management system with secure authentication and complete book tracking.

## Development Stack

- **Frontend**: React + Next.js 15 + TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT with HTTP-only Cookies

## Features

### Authentication & Security

- User Registration/Login with JWT
- HTTP-only cookie based authentication
- Refresh token rotation
- Protected routes
- Ownership-based access control

### Book Management

- Add, edit, delete books
- Track reading status (Reading/Completed/Wishlist)
- Rate and review books
- Personal library per user
- Book listing with status filters

### Advanced Features

- Redis caching for performance
- Full TypeScript implementation
- Docker containerization
- Responsive Material-UI design
- Global state with Redux Toolkit
- TanStack Query for data fetching

## Installation & Setup

### Prerequisites

- Node.js (v22 or higher)
- Docker and Docker Compose

### Environment Configuration

1. **Backend Environment (.env)**

```bash
DATABASE_URL=mongodb://mongo/personal-library-management
PORT=5000
JWT_TOKEN=e2932gaaga42gaxgeaga,tag@$4ga
NODE_ENV=development
JWT_REFRESH_TOKEN=g323*%E342eagergeragerb
CLIENT_URL=http://localhost:3000
REDIS_HOST=redis://redis:6379
```

2. **Frontend Environment (.env)**

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1
```

### Running the Application

**Start Backend Services (API + MongoDB + Redis):**

```bash
docker compose up --build
```

**To run seeder**

```bash
docker-compose run --rm backend npm run seed
```

**To run frontend**

```bash
cd frontend && npm run dev
```

### Login Info

- go to [localhost:3000/login](localhost:3000/login)
- email: user1@example.com
- password: 123456

