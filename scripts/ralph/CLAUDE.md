# Ralph Agent Instructions

You are an autonomous coding agent working on the AI Learning Hub project.

## Your Task

1. Read the PRD at `prd.json` (in the same directory as this file)
2. Read the progress log at `progress.txt` (check Codebase Patterns section first)
3. Check you're on the correct branch from PRD `branchName`. If not, check it out or create from main.
4. Pick the **highest priority** user story where `passes: false`
5. Implement that single user story
6. Run quality checks: `npm run build` (includes typecheck) and `npm run lint`
7. Update AGENTS.md if you discover reusable patterns (see below)
8. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
9. Update the PRD to set `passes: true` for the completed story
10. Append your progress to `progress.txt`

## Project Context

- **Framework**: Next.js 16 with App Router, React 19, TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL) - see `supabase-setup.sql` for schema
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Structure**: `src/app/` (routes/API), `src/components/` (UI), `src/lib/` (utilities)
- **Path alias**: `@/*` maps to `src/*`

## Progress Report Format

APPEND to progress.txt (never replace, always append):
```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered (e.g., "this codebase uses X for Y")
  - Gotchas encountered (e.g., "don't forget to update Z when changing W")
  - Useful context (e.g., "the evaluation panel is in component X")
---
```

The learnings section is critical - it helps future iterations avoid repeating mistakes and understand the codebase better.

## Consolidate Patterns

If you discover a **reusable pattern** that future iterations should know, add it to the `## Codebase Patterns` section at the TOP of progress.txt (create it if it doesn't exist). This section should consolidate the most important learnings:

```
## Codebase Patterns
- Use `cn()` from `@/lib/utils` for conditional class merging
- All API routes are in `src/app/api/` with REST conventions
- Use shadcn/ui components from `src/components/ui/`
```

Only add patterns that are **general and reusable**, not story-specific details.

## Update AGENTS.md Files

Before committing, check if any edited files have learnings worth preserving in AGENTS.md:

1. **Identify directories with edited files** - Look at which directories you modified
2. **Check for existing AGENTS.md** - The main one is in the project root
3. **Add valuable learnings** - If you discovered something future developers/agents should know:
   - API patterns or conventions specific to that module
   - Gotchas or non-obvious requirements
   - Dependencies between files
   - Testing approaches for that area
   - Configuration or environment requirements

**Examples of good AGENTS.md additions:**
- "When modifying X, also update Y to keep them in sync"
- "This module uses pattern Z for all API calls"
- "Tests require the dev server running on PORT 3000"

**Do NOT add:**
- Story-specific implementation details
- Temporary debugging notes
- Information already in progress.txt

## Quality Requirements

- ALL commits must pass: `npm run build` and `npm run lint`
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns
- Use TypeScript strict types; avoid `any`

## Browser Testing

For any story that changes UI, use the Playwright MCP tools to verify:

1. Navigate to the relevant page
2. Verify the UI changes work as expected
3. Take a screenshot if helpful for the progress log

## Stop Condition

After completing a user story, check if ALL stories have `passes: true`.

If ALL stories are complete and passing, reply with:
<promise>COMPLETE</promise>

If there are still stories with `passes: false`, end your response normally (another iteration will pick up the next story).

## Important

- Work on ONE story per iteration
- Commit frequently
- Keep CI green
- Read the Codebase Patterns section in progress.txt before starting
