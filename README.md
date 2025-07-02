# SecureLink - Secure URL Shortener

SecureLink is a modern, secure URL shortening service. It provides features like authentication-protected links and email notifications.

## Features

- **Secure Short Links**: Create shortened URLs with optional authentication protection
- **User Authentication**: Secure user registration and login system
- **Access Control**: Control who can access your shortened links
- **Email Notifications**: Get notified when protected links are accessed
- **Dashboard**: User-friendly dashboard to manage all your links

## Tech Stack

### Frontend
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form handling with validation
- **React Toastify** - Toast notifications
- **Zod** - Schema validation

### Backend
- **Hono** - Fast web framework for Cloudflare Workers
- **Better Auth** - Authentication library
- **Drizzle ORM** - Type-safe database ORM
- **Cloudflare D1** - SQLite-compatible database

### Infrastructure
- **Cloudflare Workers** - Serverless runtime
- **Cloudflare D1** - Database
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account
- Wrangler CLI

## Local Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd secure-link
npm install
```

### 2. Install Wrangler CLI (if not already installed)

```bash
npm install -g wrangler
```

### 3. Authenticate with Cloudflare

```bash
wrangler login
```

### 4. Environment Variables

Rename `.env.sample` file in the root directory to `.env` and add the mentioned tokens:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_d1_token
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=base_url_of_your_app
```

### 5. Database Setup

#### Create D1 Database (if not exists)
```bash
wrangler d1 create secure-link-db
```

#### Generate Database Schema
```bash
npm run db:generate
```

#### Run Migrations

For development:
```bash
npm run db:migrate:dev
```

For production:
```bash
npm run db:migrate:prod
```

## Development

### Start Development Server

```bash
npm run dev
```

This will start:
- Vite dev server for the frontend
- Local Cloudflare Workers environment
- Local D1 database

The application will be available at `http://localhost:5173`

### Database Management

#### View Database (Drizzle Studio)

For development database:
```bash
npm run db:studio:dev
```

For production database:
```bash
npm run db:studio:prod
```

#### Create New Migration

After modifying the schema in `worker/db/schema.ts`:

```bash
npm run db:generate
npm run db:migrate:dev
```
