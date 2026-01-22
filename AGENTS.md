# AGENTS.md

## Commands
- `npm run dev` - Start development server (port 3000, production database)
- `npm run dev:test` - Start development server (port 3001, test database)
- `npm run build` - Build for production (also typechecks)
- `npm run lint` - Run ESLint
- `npm run seed:test` - Seed test database with sample data

## Testing
- **Framework**: Playwright for E2E testing
- **Test Database**: Separate Supabase project configured in `.env.test.local`
- **Config**: `playwright.config.ts` - uses port 3001, global setup/teardown for seeding
- **Auth Setup**: `tests/auth.setup.ts` - handles login before tests
- **Database Helper**: `tests/helpers/database.ts` - seed and cleanup functions
- **Seed Script**: `scripts/seed-test-db.ts` - populates test DB with sample resources

### Running Tests
```bash
npx playwright test                    # Run all tests
npx playwright test --project=chromium # Run in Chromium only
npx playwright test --ui               # Open UI mode
npx playwright test tests/seed.spec.ts # Run specific test
```

### Test Structure
- `tests/auth.setup.ts` - Authentication setup (runs first)
- `tests/seed.spec.ts` - Seed test for Playwright MCP agents
- `tests/global-setup.ts` - Seeds test data before all tests
- `tests/global-teardown.ts` - Cleans up after all tests

## Architecture
- **Framework**: Next.js 16 with App Router, React 19, TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL) - see `supabase-setup.sql` for schema
- **Styling**: Tailwind CSS 4 with shadcn/ui components (Radix UI primitives)
- **Structure**: `src/app/` (routes/API), `src/components/` (UI), `src/lib/` (utilities, db, auth)
- **API Routes**: REST endpoints in `src/app/api/` for resources, ideas, metadata, auth
- **Path alias**: `@/*` maps to `src/*`

## Code Style
- Use TypeScript with strict types; avoid `any`
- Imports: Use `@/` alias for src imports
- Components: Functional components with React hooks
- Naming: PascalCase for components, camelCase for functions/variables
- Use existing shadcn/ui components from `src/components/ui/`
- Use `cn()` from `@/lib/utils` for conditional class merging
