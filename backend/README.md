Development notes

If Atlas is unreachable from your network (outbound port 27017 blocked), you can run a local MongoDB via Docker and the app will automatically fall back to it.

Steps:

1. Start local MongoDB (requires Docker Desktop):

```bash
cd ai-gig-platform/backend
npm run start-local-db
```

2. Verify local DB is running:

```bash
npm run test-db
```

3. Start the backend (from workspace root):

```bash
npm --prefix "ai-gig-platform/backend" run dev
```

Notes:
- The code in `config/db.js` attempts to connect to `MONGO_URI` first, then to `LOCAL_MONGO_URI` or `mongodb://localhost:27017/ai_gig_platform`.
- Alternatively, enable Atlas Data API if you cannot run Docker; that requires code changes to use HTTP requests instead of Mongoose.

### New Features / Configuration

This backend has been extended to a production-grade AI marketplace architecture. Key points:

- **Embedding-based semantic matching** using Google Gemini's `embedding-001` model. Add `GEMINI_API_KEY` to your `.env`.
- Gigs and user resumes now cache embedding vectors in the database; they are computed automatically on creation/upload.
- **Application lifecycle** with `/applications` routes and `Application` model.
- **User interactions** logged via `/interactions` for behavioral personalization.
- **Skill gap intelligence** endpoint at `GET /api/v1/gigs/:id/skill-gap`.
- **Recruiter dashboard analytics** now include skill distribution, salary, location, top demanded skills, and conversion rates.
- **Security improvements**: input validation (express-validator), rate limiting, Helmet, HTTP-only cookies for tokens, refresh token logic, and input sanitization.
- **Personalization layer** adjusts match scores based on past applies/views.
- **Service layer & versioning**: controllers are thin, logic resides in `services/`; API is versioned under `/api/v1`.
- Additional middleware: centralized error handler, logging via morgan, and env-based config.

Environment variables used by the application (in addition to existing ones):

```
JWT_SECRET=...
REFRESH_SECRET=...            # optional; defaults to JWT_SECRET
ACCESS_EXPIRES=15m            # access token lifetime
REFRESH_EXPIRES=7d            # refresh token lifetime
GEMINI_API_KEY=...            # Google Gemini API key for embeddings
CORS_ORIGIN=http://localhost:5173  # adjust for frontend
```

Be sure to run `npm install` to pick up new dependencies such as `axios`, `express-rate-limit`, `express-mongo-sanitize`, and others introduced.

