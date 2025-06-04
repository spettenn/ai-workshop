# Soccer World Cup Betting App - AI Workshop MVP

A full-stack betting application for office World Cup predictions, built with modern web technologies and designed for scalability.

## 🏗️ Architecture

- **Frontend**: Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express + TypeScript + Socket.io
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT tokens (ready for Supabase migration)

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- PostgreSQL (local installation)
- npm/pnpm

### 1. Database Setup

Install PostgreSQL locally:

```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb soccer_betting_db

# Create user (optional)
psql -d soccer_betting_db -c "CREATE USER soccer_user WITH PASSWORD 'soccer_pass';"
psql -d soccer_betting_db -c "GRANT ALL PRIVILEGES ON DATABASE soccer_betting_db TO soccer_user;"
```

### 2. Environment Setup

```bash
# Copy environment file
cp env.example server/.env

# Edit server/.env with your database credentials
DATABASE_URL="postgresql://soccer_user:soccer_pass@localhost:5432/soccer_betting_db"
JWT_SECRET="your-super-secret-jwt-key"
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies (when ready)
cd ../client && npm install
```

### 4. Database Migration & Seed

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with mock data
npm run db:seed
```

### 5. Development

```bash
# Start both server and client
npm run dev

# Or individually:
npm run dev:server  # http://localhost:3001
npm run dev:client  # http://localhost:5173
```

## 📋 Implementation Segments

### ✅ Segment 1: Project Structure & Database
- [x] Initialize monorepo structure
- [x] Create Prisma schema (User, Match, Prediction, Comment)
- [x] Environment configuration
- [x] Install dependencies

### 🔄 Segment 2: User Authentication
- [ ] User model & registration
- [ ] JWT token generation/verification
- [ ] Basic auth routes (/register, /login)

### 🔄 Segment 3: Match Management
- [ ] Match model in Prisma
- [ ] API-Football integration (or mock data)
- [ ] Basic match CRUD endpoints

### 🔄 Segment 4: Frontend Setup
- [ ] Vite + React + TypeScript setup
- [ ] Tailwind + shadcn/ui configuration
- [ ] Auth context & protected routes
- [ ] Login/register pages

## 🗄️ Database Schema

### Users
- `id`, `email`, `name`, `department`, `password`
- Relations: predictions, comments

### Matches
- `id`, `homeTeam`, `awayTeam`, `kickoffTime`, `status`, `scores`
- Relations: predictions, comments

### Predictions
- `id`, `userId`, `matchId`, `homeGoals`, `awayGoals`, `points`
- Unique constraint: (userId, matchId)

### Comments
- `id`, `content`, `userId`, `matchId`, `createdAt`

## 🛠️ Development Commands

```bash
# Database
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed with mock data
npm run db:studio      # Open Prisma Studio

# Development
npm run dev           # Start both server & client
npm run dev:server    # Server only
npm run dev:client    # Client only

# Build
npm run build         # Build both
npm run build:server  # Server only
npm run build:client  # Client only
```

## 🔄 Migration to Supabase

The current setup is designed for easy migration to Supabase:

1. **Database**: Prisma schema is PostgreSQL-compatible
2. **Auth**: JWT structure matches Supabase auth
3. **Real-time**: Socket.io can be replaced with Supabase real-time
4. **Storage**: Ready for Supabase storage integration

## 📝 Mock Data

The seed file includes:
- 3 demo users (password: `password123`)
- 5 World Cup matches (mix of scheduled/finished)
- Sample predictions with points

## 🎯 Next Steps

After completing all segments:
- Add real-time leaderboard updates
- Implement match commenting system
- Add email notifications
- Deploy to production (Vercel + Railway/Fly.io)

---

Built with ❤️ during AI Workshop 2024
