# Contributing to GigForge

Thank you for your interest in contributing to GigForge! 🚀

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ai-gig-platform.git`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp .env.example .env`
5. Start the dev server: `npm run dev`

## Branch Naming Convention

- `feat/` — New features (e.g., `feat/ai-matching-v2`)
- `fix/` — Bug fixes (e.g., `fix/proposal-submission-error`)
- `chore/` — Maintenance tasks (e.g., `chore/update-dependencies`)
- `docs/` — Documentation changes (e.g., `docs/api-reference`)
- `refactor/` — Code refactoring (e.g., `refactor/payment-service`)

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(gigs): add AI-powered skill matching
fix(payments): resolve escrow release timing issue
docs(readme): update local dev instructions
```

## Pull Request Process

1. Create a feature branch from `dev`
2. Make your changes with clear, atomic commits
3. Ensure all checks pass:
   - `npm run typecheck` — No TypeScript errors
   - `npm run lint` — No linting errors
   - `npm run test` — All tests pass
4. Update `.env.example` if you add new environment variables
5. Add a Prisma migration if you change the database schema
6. Submit a PR to `dev` using the PR template
7. Request review from at least one team member

## Code Standards

- **TypeScript** — Never use `any`, use proper types or `unknown`
- **Components** — Keep under 200 lines, extract sub-components
- **Styling** — Only Tailwind utility classes, no inline styles
- **Validation** — Every API endpoint uses Zod schema validation
- **Error handling** — Use `AppError` class, never expose internal errors
- **API keys** — Never hardcode, always use `process.env`

## Questions?

Open a discussion or reach out to the team. Happy coding! 💜
