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
| **Frontend**      | Vite + Next.js + TypeScript, Tailwind CSS, shadcn/ui | Fast scaffold, minimal config, ready components |
| **Realtime**      | Socket.io client                                     | Push live scores & leaderboard                  |
| **Backend**       | Express + TypeScript, Socket.io server               | Familiar, quick, integrates with React          |
| **DB**            | PostgreSQL (Local) using Prisma ORM                  | Simple relational schema, migrations            |
| **Auth**          | JWT w/ bcrypt (Supabase-ready)                       | Lightweight, scalable                           |
| **Data Provider** | Mock data (API-Football ready)                       | Fast development, easy to switch                |
| **Deployment**    | Local development only                               | Workshop focus                                  |

## 4. Actual Repository Structure (Implemented)

```
/ (git root)
├─ client/             # Next.js app (Segment 4)
│  ├─ src/
│  │  ├─ components/   # MatchCard, LeaderboardTable, ...
│  │  ├─ pages/        # Login, Dashboard, Matches, Leaderboard
│  │  └─ hooks/
│  └─ next.config.js
├─ server/             # ✅ COMPLETED
│  ├─ src/
│  │  ├─ routes/       # ✅ auth.ts, matches.ts (CRUD endpoints)
│  │  ├─ middleware/   # ✅ auth.ts (JWT authentication)
│  │  ├─ utils/        # ✅ jwt.ts, mockData.ts, liveUpdates.ts
│  │  ├─ types/        # ✅ auth.ts, match.ts (TypeScript interfaces)
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
CLIENT_ORIGIN="http://localhost:3000"
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

### ✅ **Segment 3: Match Management** (COMPLETED)

- [x] **Match CRUD endpoints** - Create, read, update, delete matches
- [x] **Match status management** - SCHEDULED, LIVE, FINISHED states
- [x] **Mock match data service** - Simulate API-Football responses
- [x] **Match filtering & querying** - By status, date, round, team name
- [x] **Real-time match updates** - Socket.io events for score changes
- [x] **Live score simulation** - Automatic updates for local development

**✅ Test Results:**

- Database matches: 6 matches (5 seeded + 1 created via API)
- Mock matches: 8 additional World Cup fixtures for local development
- Filtering: Status, round, team name, date range filtering works
- Pagination: Page/limit parameters working correctly
- Protected routes: JWT authentication required for CUD operations
- Real-time events: Socket.io match updates working
- API simulation: API-Football response structure implemented

**🔗 Match API Endpoints Working:**

```bash
# Public endpoints
GET    /api/matches              # Database matches with filtering
GET    /api/matches/mock         # Mock matches for local dev
GET    /api/matches/:id          # Specific match (DB + mock fallback)
GET    /api/matches/api-football/simulate  # API-Football simulation

# Protected endpoints (require JWT)
POST   /api/matches              # Create new match
PUT    /api/matches/:id          # Update match scores/status
DELETE /api/matches/:id          # Delete match
```

### ✅ **Segment 4: Frontend Setup** (COMPLETED)

- [x] **Next.js + TypeScript setup** - Modern React framework with SSR
- [x] **Tailwind + shadcn/ui configuration** - Styling framework + component library
- [x] **Install shadcn/ui components** - Button, Card, Input, Form, Dialog, Sonner, Table, Badge
- [x] **Auth context & protected routes** - Client-side authentication with localStorage
- [x] **Login/register pages** - Beautiful UI with form validation and error handling
- [x] **Match display components** - Real-time match cards with live updates
- [x] **Socket.io integration** - Real-time notifications and match updates
- [x] **API service layer** - Axios-based service with interceptors and error handling

**✅ Test Results:**

- Frontend: Next.js running on http://localhost:3000
- Authentication: Login/register forms with validation working
- Real-time: Socket.io connected and receiving live updates
- UI Components: shadcn/ui components styled and functional
- API Integration: All backend endpoints accessible from frontend
- CORS: Fixed to support both Next.js (3000) and Vite (5173) ports
- Demo accounts: alice@company.com / password123, bob@company.com / password123

**🎨 UI Features Implemented:**

- Beautiful gradient backgrounds for auth pages
- Responsive match cards with live indicators
- Real-time connection status indicator
- Toast notifications for all user actions
- Loading states and error handling
- Modern card-based dashboard layout
- Statistics cards showing match counts by status

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

**Immediate (Segment 4):**

- Set up Next.js with TypeScript and Tailwind CSS
- Install and configure shadcn/ui component library
- Create authentication context and protected routes
- Build login/register pages with form validation
- Implement match display components

**After Segment 4:**

- Prediction submission system
- Points calculation and leaderboard
- Real-time updates integration
- Social features (comments)

---

**🎯 Current Status:** Segments 1, 2, 3 & 4 complete, ready for Segment 5
**⏱️ Time Spent:** ~4 hours (Database + Auth + Match Management + Frontend)
**🚀 Next Goal:** Prediction System with Points Calculation

Built with ❤️ during AI Workshop 2024
