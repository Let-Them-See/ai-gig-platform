# 🚀 GigForge — AI-Powered Gig Marketplace

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_14-000?logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white)

**A production-grade, AI-powered gig marketplace built as a Turborepo monorepo.**  
Connects freelancers with clients using intelligent skill matching, resume parsing, and real-time recommendations.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [API Reference](#-api-reference) · [Dataset](#-dataset)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Match Engine** | Ranks gigs by skill overlap, semantic similarity, location, and salary — gives a weighted 0–100 score |
| 📄 **Resume Parser** | Upload a PDF → extracts skills automatically → shows top 10 AI-recommended jobs |
| 🎯 **Smart Filters** | Filter by category (Web Dev, AI/ML, Cloud, etc.), experience level, work type, and keyword search |
| 👥 **Role-Based Dashboards** | Freelancers see applications/matches; Clients manage gigs/applicants with hire/reject actions |
| 📊 **105-Job Dataset** | Pre-loaded Indian tech gig dataset with categories, experience levels, and INR pricing |
| 🔐 **JWT Authentication** | bcrypt password hashing + access/refresh token rotation |
| 🇮🇳 **INR Currency** | All pricing in Indian Rupees (₹) with `en-IN` locale formatting |
| 🌙 **Dark/Light Mode** | Theme toggle with smooth transitions |
| 📱 **Responsive UI** | Mobile-first design with Tailwind CSS + Framer Motion animations |

---

## 🛠 Tech Stack

### Frontend (`apps/web`)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom design system
- **State:** TanStack React Query (server state) + React Context (auth)
- **Animations:** Framer Motion
- **Charts:** Recharts (pie charts, bar charts)
- **Forms:** React Hook Form

### Backend (`apps/server`)
- **Runtime:** Node.js + Express
- **Auth:** JWT (bcryptjs + jsonwebtoken)
- **Validation:** Zod schemas
- **File Upload:** Multer (PDF resume parsing via `pdf-parse`)

### Database (`packages/db`)
- **ORM:** Prisma
- **Database:** SQLite (zero-config, file-based — `dev.db`)
- **Schema:** 8 models (User, FreelancerProfile, ClientProfile, Gig, Application, MatchHistory, Review, Notification)

### AI Engine (`packages/ai`)
- **Skill Extraction:** NLP-based keyword extraction from resume text
- **Match Scoring:** Multi-factor algorithm (skills 40%, semantic 35%, location 15%, salary 10%)
- **Recommendations:** Ranked gig suggestions based on freelancer profile

### Monorepo
- **Build System:** Turborepo
- **Package Manager:** npm workspaces
- **Shared Packages:** `@gigforge/db`, `@gigforge/ai`, `@gigforge/types`

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 10

### 1. Clone & Install

```bash
git clone https://github.com/Let-Them-See/ai-gig-platform.git
cd ai-gig-platform
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

The `.env` file has sensible defaults for local development:

```env
DATABASE_URL="file:../../packages/db/prisma/dev.db"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Create/sync SQLite tables
```

### 4. Seed the Dataset

```bash
cd apps/server
npx tsx src/seed.ts    # Imports 105 jobs + creates admin & test accounts
cd ../..
```

### 5. Run Development Servers

```bash
# Terminal 1 — Backend (port 4000)
cd apps/server
npx tsx watch src/index.ts

# Terminal 2 — Frontend (port 3000)
cd apps/web
npx next dev --port 3000
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Test Accounts

| Role | Email | Password | Company |
|------|-------|----------|---------|
| Admin (Client) | `vedantkhanna1711@gmail.com` | `123vk123` | vkool |
| Freelancer | `alice@test.com` | `Test12345` | — |

---

## 📁 Project Structure

```
ai-gig-platform/
├── apps/
│   ├── server/                         # Express API Server
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── env.ts              # Environment validation (Zod)
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts         # Register, login, refresh, getMe
│   │   │   │   ├── gig.controller.ts          # CRUD + search/filter gigs
│   │   │   │   ├── application.controller.ts  # Apply, list, update status
│   │   │   │   ├── match.controller.ts        # AI match scores
│   │   │   │   ├── resume.controller.ts       # PDF upload + skill extraction
│   │   │   │   ├── dashboard.controller.ts    # Freelancer/Client dashboards
│   │   │   │   └── payment.controller.ts      # Stripe integration
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts            # User registration, JWT, bcrypt
│   │   │   │   ├── match.service.ts           # AI matching algorithm
│   │   │   │   ├── resume.service.ts          # PDF parse + AI recommendations
│   │   │   │   └── stripe.service.ts          # Payment processing
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts                    # JWT verification middleware
│   │   │   │   ├── validate.ts                # Zod request validation
│   │   │   │   └── errorHandler.ts            # Global error handler
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── gig.routes.ts
│   │   │   │   ├── application.routes.ts
│   │   │   │   ├── match.routes.ts
│   │   │   │   ├── resume.routes.ts
│   │   │   │   ├── dashboard.routes.ts
│   │   │   │   └── payment.routes.ts
│   │   │   ├── utils/
│   │   │   │   ├── apiResponse.ts             # Standardized JSON responses
│   │   │   │   ├── jwt.ts                     # Token generation/verification
│   │   │   │   └── skills.ts                  # JSON ↔ array serialization
│   │   │   ├── seed.ts                        # CSV dataset importer
│   │   │   └── index.ts                       # Express app entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                            # Next.js 14 Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   │   ├── login/page.tsx
│       │   │   │   └── register/page.tsx
│       │   │   ├── (dashboard)/
│       │   │   │   ├── layout.tsx             # Sidebar + topbar layout
│       │   │   │   ├── dashboard/page.tsx     # Role-adaptive dashboard
│       │   │   │   ├── gigs/
│       │   │   │   │   ├── page.tsx           # Browse gigs + filters
│       │   │   │   │   └── [id]/page.tsx      # Gig detail + AI match + apply
│       │   │   │   ├── match/page.tsx         # AI match recommendations
│       │   │   │   ├── resume/page.tsx        # Upload + AI job suggestions
│       │   │   │   ├── applications/page.tsx  # My applications tracker
│       │   │   │   ├── profile/page.tsx       # Edit profile + skills
│       │   │   │   ├── analytics/page.tsx     # Earnings & stats
│       │   │   │   ├── payments/page.tsx      # Payment history
│       │   │   │   ├── messages/page.tsx      # Messaging UI
│       │   │   │   ├── proposals/page.tsx     # Proposals list
│       │   │   │   └── settings/page.tsx      # Account settings
│       │   │   ├── page.tsx                   # Landing page
│       │   │   ├── layout.tsx                 # Root layout + providers
│       │   │   └── globals.css                # Design tokens + utilities
│       │   ├── components/
│       │   │   ├── landing/                   # Hero, Stats, Features, CTA
│       │   │   ├── layout/                    # Sidebar, Topbar, ThemeToggle
│       │   │   ├── providers/                 # AuthProvider, QueryProvider
│       │   │   └── shared/                    # Reusable UI components
│       │   └── lib/
│       │       ├── api.ts                     # API client functions
│       │       └── utils.ts                   # formatCurrency(INR), formatDate
│       ├── package.json
│       ├── tailwind.config.ts
│       └── next.config.ts
│
├── packages/
│   ├── ai/                             # @gigforge/ai — Match Engine
│   │   └── src/
│   │       ├── index.ts                # Exports: extractSkillsFromText, rankGigsForFreelancer
│   │       └── matcher.ts             # Weighted scoring algorithm
│   ├── db/                             # @gigforge/db — Prisma ORM
│   │   └── prisma/
│   │       ├── schema.prisma           # 8 models, SQLite provider
│   │       └── dev.db                  # SQLite database file
│   ├── types/                          # @gigforge/types — Shared TypeScript interfaces
│   ├── config/                         # Shared configuration
│   └── ui/                             # Shared UI components (future)
│
├── tech_gig_jobs_dataset_CLEAN_FINAL_INR.csv   # 105-job source dataset
├── turbo.json                          # Turborepo pipeline config
├── package.json                        # Root workspace config
├── .env.example                        # Environment template
├── docker-compose.yml                  # Docker setup (PostgreSQL)
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE                             # MIT
```

---

## 📊 Dataset

The platform ships with `tech_gig_jobs_dataset_CLEAN_FINAL_INR.csv` containing **105 tech gig jobs** across:

| Field | Examples |
|-------|---------|
| **Categories** | Web Development, AI/ML, Data Analytics, App Development, Cloud Computing, Cybersecurity, Design, Content, DevOps |
| **Job Types** | Gig, Freelance, Part-Time |
| **Experience** | Beginner, Intermediate, Expert |
| **Pay Types** | Per Hour, Per Task, Per Month, Per Project, Per Article |
| **Locations** | Remote, Bangalore, Mumbai, Delhi, Hyderabad |
| **Skills** | React, Python, AWS, Docker, TensorFlow, Flutter, SQL, and 20+ more |

> **Auto-growing**: When any registered client creates a new gig, it's automatically part of the live dataset. No CSV updates needed.

---

## 🔌 API Reference

**Base URL:** `http://localhost:4000/api`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register (email, password, name, role) |
| `POST` | `/auth/login` | Login → access + refresh tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET` | `/auth/me` | Get current user profile |

### Gigs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/gigs` | List gigs (search, skills, category, experienceLevel, isRemote, page) |
| `GET` | `/gigs/:id` | Get gig detail with applications |
| `POST` | `/gigs` | Create gig (auth required, CLIENT role) |
| `PUT` | `/gigs/:id` | Update gig |
| `DELETE` | `/gigs/:id` | Delete gig |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/applications/apply` | Apply to gig (gigId, coverLetter) |
| `GET` | `/applications/my` | My applications (freelancer) |
| `GET` | `/applications/gig/:gigId` | Applications for a gig (client) |
| `PATCH` | `/applications/:id/status` | Update status (SHORTLISTED/HIRED/REJECTED) |

### AI Match
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/match` | Top AI-ranked gigs for freelancer |
| `GET` | `/match/:gigId` | Match score for specific gig |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/resume/upload` | Upload PDF → extract skills → get 10 recommended jobs |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/freelancer` | Stats, applications, match scores |
| `GET` | `/dashboard/client` | Gigs, applicants, hiring rate, top candidates |

---

## 🧪 Running the Seed Script

```bash
cd apps/server
npx tsx src/seed.ts
```

This will:
1. Create admin user → `vedantkhanna1711@gmail.com` / `123vk123` (company: **vkool**)
2. Parse the CSV and create 105 gigs under the admin account
3. Create test freelancer → `alice@test.com` / `Test12345`

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps via Turborepo |
| `npm run build` | Build all apps |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to SQLite |
| `npm run db:studio` | Open Prisma Studio (GUI) |

---

## 📄 License

MIT — See [LICENSE](./LICENSE)
