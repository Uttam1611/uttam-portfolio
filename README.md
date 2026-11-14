# Uttam Singh, portfolio

Personal portfolio and analytics site. Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide. Fully static, no backend, no secrets, no environment variables required.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

## Checks

```bash
npm run typecheck
npm run lint
npm test                 # unit tests for metrics and content integrity
npx playwright test      # routes, links, filters, themes, mobile nav, axe accessibility
npm run content:check    # lists content the owner still needs to supply
```

## Structure

```
src/content/    all facts: site, projects, experience, skills, education (typed)
src/lib/        dates and metrics (every dashboard number is computed here)
src/components/ UI, charts, analytics dashboard
src/app/        routes: /, /projects, /projects/[slug], /experience, /analytics, /contact, /resume
tests/          unit (Vitest) and e2e (Playwright)
```

## Updating content

- **Add a project**: add one record to `src/content/projects.ts`. Cards, filters, case study, sitemap and analytics update automatically.
- **Add experience, skills, certifications**: edit the matching file in `src/content/`.
- **Resume**: put the PDF at `public/resume/Uttam-Singh-Resume.pdf`. The download buttons and `/resume` switch on at the next build.
- **Portrait**: put it at `public/images/portrait.jpg`.
- **Links**: set `links` in `src/content/site.ts`.
- **Review date**: update `lastUpdated` in `site.ts`.

See `docs/CONTENT_DEPENDENCIES.md` for everything still needed and `DECISIONS.md` for the reasoning behind the design and data choices.

## Deploying to Vercel (needs your account)

1. Create an empty GitHub repository and push this code to it.
2. In Vercel choose Add New Project, import the repository, keep the detected Next.js settings.
3. Add `NEXT_PUBLIC_SITE_URL` with the final URL (for canonical links, sitemap and Open Graph).
4. Deploy, then run the Playwright suite against the production URL by setting `baseURL`.
5. Optional: add a custom domain in Vercel project settings.
