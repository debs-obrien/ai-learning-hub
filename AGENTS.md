# AGENTS.md

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (also typechecks)
- `npm run lint` - Run ESLint

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
