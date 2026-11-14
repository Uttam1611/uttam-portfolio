# Development rules

1. `PRD.md` is the source of truth. Do not invent personal information, achievements, metrics, results or technical experience.
2. Missing information becomes an entry in `docs/CONTENT_DEPENDENCIES.md` and a visible "not added yet" state. Never a placeholder value.
3. Content lives in `src/content/*.ts`. Components never hold facts. Dashboard numbers come from `src/lib/metrics.ts` only.
4. Distinguish evidence levels: demonstrated, working knowledge, currently learning, research exposure. Investigating a technology is not implementing it.
5. Dataset scale is never presented as model performance. Unmeasured results show as unavailable.
6. No skill percentages, activity counters, fake GitHub stats or unattributed team work.
7. Dependencies are added only with a recorded reason in `DECISIONS.md`.
8. A task is complete only when tested. Run before every commit: `npm run typecheck && npm run lint && npm test && npm run build && npx playwright test`.
9. Do not publish, change repository visibility, buy domains or take account-authorised actions without the owner's explicit approval.
10. No secrets in the frontend. The site has no backend and needs no environment variables.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
