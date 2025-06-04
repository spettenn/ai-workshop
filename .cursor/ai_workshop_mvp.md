# Soccer World Cup Betting App – One‑Day AI Implementation Plan (MVP)

## 1. Purpose

Deliver a working internal web app that lets employees predict match scores, see real-time leaderboards, and interact socially — built almost entirely with AI assistance within a single 8-hour workshop.

## 2. Constraints & Assumptions

- **Time-box:** 1 working day (≈ 5 h coding + breaks).
- **Team:** 3 developers + AI assistance (pair-programming).
- **Environment:** Node 18+, npm, VS Code, Local PostgreSQL.
- **Users:** ≤ 100 concurrent (office pool).
- **Tournament Data:** FIFA World Cup 2026 group stage sample; mock data for local development.

## 3. Final Tech Stack (Updated)

| Layer             | Choice                                               | Rationale                                       |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------- |
| **Frontend**      | Vite + next.js + TypeScript, Tailwind CSS, shadcn/ui | Fast scaffold, minimal config, ready components |
| **Realtime**      | Socket.io client                                     | Push live scores & leaderboard                  |
| **Backend**       | Express + TypeScript, Socket.io server               | Familiar, quick, integrates with React          |
| **DB**            | PostgreSQL (Local) using Prisma ORM                  | Simple relational schema, migrations            |
| **Auth**          | JWT w/ bcrypt (Supabase-ready)                       | Lightweight, scalable                           |
| **Data Provider** | Mock data (API-Football ready)                       | Fast development, easy to switch                |
| **Deployment**    | Local development only                               | Workshop focus                                  |

## 4. Actual Repository Structure (Implemented)

```
/ (git root)
├─ client/             # React app (Segment 4)
│  ├─ src/
│  │  ├─ components/   # MatchCard, LeaderboardTable, ...
│  │  ├─ pages/        # Login, Dashboard, Matches, Leaderboard
│  │  └─ hooks/
│  └─ vite.config.ts
├─ server/             # ✅ COMPLETED
│  ├─ src/
│  │  ├─ routes/       # ✅ auth.ts (register, login, me)
│  │  ├─ middleware/   # ✅ auth.ts (JWT authentication)
│  │  ├─ utils/        # ✅ jwt.ts (token generation/verification)
│  │  ├─ types/        # ✅ auth.ts (TypeScript interfaces)
│  │  └─ index.ts      # ✅ Express + Socket.io server
│  ├─ prisma/          # ✅ COMPLETED
│  │  ├─ schema.prisma # ✅ User, Match, Prediction, Comment models
│  │  └─ seed.ts       # ✅ Mock data seeding
│  ├─ package.json     # ✅ Dependencies installed
│  └─ tsconfig.json    # ✅ TypeScript configuration
├─ package.json        # ✅ Monorepo workspace setup
├─ README.md           # ✅ Complete setup instructions
├─ .gitignore          # ✅ Comprehensive ignore rules
└─ env.example         # ✅ Environment template
```

## 5. Environment Variables (server/.env) ✅ CONFIGURED

```
DATABASE_URL="postgresql://aleksanderspetalen@localhost:5432/soccer_betting_db"
JWT_SECRET="super-secret-jwt-key-for-workshop-2024"
PORT=3001
NODE_ENV=development
CLIENT_ORIGIN="http://localhost:5173"
FOOTBALL_API_KEY="your-api-football-key-here"
FOOTBALL_API_URL="https://v3.football.api-sports.io"
```

## 6. Implementation Progress - Segmented Approach

### ✅ **Segment 1: Project Structure & Database** (COMPLETED)

- [x] **Initialize monorepo structure** - Root package.json with workspaces
- [x] **Create Prisma schema** - User, Match, Prediction, Comment models
- [x] **Environment configuration** - Local PostgreSQL setup
- [x] **Install dependencies** - Express, Prisma, JWT, bcrypt, Socket.io
- [x] **Database setup** - PostgreSQL running, tables created, seeded with mock data

**✅ Test Results:**

- Database: 4 tables created (users, matches, predictions, comments)
- Mock data: 3 demo users, 5 World Cup matches, sample predictions
- Commands working: `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`

### ✅ **Segment 2: User Authentication** (COMPLETED)

- [x] **User model & registration** - Complete user registration with validation
- [x] **JWT token generation/verification** - 7-day tokens, secure verification
- [x] **Basic auth routes** - `/register`, `/login`, `/me` endpoints
- [x] **Authentication middleware** - Protected routes, token validation
- [x] **Security features** - Password hashing, input validation, CORS

**✅ Test Results:**

- Server running on http://localhost:3001
- Registration: Creates user + returns JWT token
- Login: Validates credentials + returns JWT token
- Protected routes: Requires valid Bearer token
- Database integration: New users saved to PostgreSQL

**🔗 API Endpoints Working:**

```bash
POST /api/auth/register  # Register new user
POST /api/auth/login     # Login user
GET  /api/auth/me        # Get current user (protected)
GET  /health             # Server health check
```

### 🔄 **Segment 3: Match Management** (NEXT)

- [ ] **Match CRUD endpoints** - Create, read, update, delete matches
- [ ] **Match status management** - SCHEDULED, LIVE, FINISHED states
- [ ] **Mock match data service** - Simulate API-Football responses
- [ ] **Match filtering & querying** - By status, date, round
- [ ] **Real-time match updates** - Socket.io events for score changes

**📋 Planned Endpoints:**

```bash
GET    /api/matches           # List all matches
GET    /api/matches/:id       # Get specific match
POST   /api/matches           # Create match (admin)
PUT    /api/matches/:id       # Update match scores
DELETE /api/matches/:id       # Delete match (admin)
```

### 🔄 **Segment 4: Frontend Setup** (AFTER SEGMENT 3)

- [ ] **Vite + React + TypeScript setup** - Modern build tooling
- [ ] **Tailwind + shadcn/ui configuration** - Styling framework
- [ ] **Auth context & protected routes** - Client-side authentication
- [ ] **Login/register pages** - User interface for authentication
- [ ] **Match display components** - Show matches and predictions

### 🔄 **Segment 5: Prediction System** (FUTURE)

- [ ] **Prediction CRUD endpoints** - Submit and manage predictions
- [ ] **Points calculation system** - Scoring algorithm implementation
- [ ] **Leaderboard generation** - Rank users by points
- [ ] **Prediction deadlines** - Lock predictions before kickoff

### 🔄 **Segment 6: Real-time Features** (FUTURE)

- [ ] **Socket.io integration** - Live score updates
- [ ] **Real-time leaderboard** - Live ranking updates
- [ ] **Match comments system** - Social interaction features

## 7. Development Commands (Working)

```bash
# Database Management ✅
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed with mock data
npm run db:studio      # Open Prisma Studio

# Development ✅
npm run dev:server     # Start backend server (port 3001)
npm run dev:client     # Start frontend (when ready)
npm run dev           # Start both simultaneously

# Build
npm run build         # Build both
npm run build:server  # Server only
npm run build:client  # Client only
```

## 8. Database Schema (Implemented)

### Users ✅

```sql
- id (String, CUID)
- email (String, unique)
- name (String)
- department (String, optional)
- password (String, bcrypt hashed)
- createdAt, updatedAt (DateTime)
```

### Matches ✅

```sql
- id (String, CUID)
- apiId (Int, optional, unique)
- homeTeam, awayTeam (String)
- kickoffTime (DateTime)
- status (String: SCHEDULED, LIVE, FINISHED)
- homeScore, awayScore (Int, optional)
- round, venue (String, optional)
- createdAt, updatedAt (DateTime)
```

### Predictions ✅

```sql
- id (String, CUID)
- userId, matchId (String, foreign keys)
- homeGoals, awayGoals (Int)
- points (Int, default 0)
- createdAt, updatedAt (DateTime)
- Unique constraint: (userId, matchId)
```

### Comments ✅

```sql
- id (String, CUID)
- content (String)
- userId, matchId (String, foreign keys)
- createdAt, updatedAt (DateTime)
```

## 9. Supabase Migration Path (Future)

The current setup is designed for easy migration:

1. **Database**: Prisma schema is PostgreSQL-compatible ✅
2. **Auth**: JWT structure matches Supabase auth ✅
3. **Real-time**: Socket.io can be replaced with Supabase real-time
4. **Storage**: Ready for Supabase storage integration

## 10. Next Steps

**Immediate (Segment 3):**

- Implement match management endpoints
- Add match status transitions
- Create mock data service for matches
- Test match CRUD operations

**After Segment 3:**

- Frontend React application
- Authentication UI components
- Match display and prediction forms
- Real-time updates integration

---

**🎯 Current Status:** Segments 1 & 2 complete, ready for Segment 3
**⏱️ Time Spent:** ~2 hours (Database + Auth)
**🚀 Next Goal:** Match Management System

Built with ❤️ during AI Workshop 2024
