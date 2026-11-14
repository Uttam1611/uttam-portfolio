# Tasks

Legend: [x] done and tested, [ ] open, [!] blocked on the owner.

## Build
- [x] Project scaffold, strict TypeScript, ESLint, Vitest, Playwright
- [x] Design tokens for dark and light themes, persisted theme switch with no flash
- [x] Typed content schemas and records (projects, experience, skills, education)
- [x] Metrics library with unit tests (12)
- [x] Home: hero, at a glance, selected projects, experience, skills, contact
- [x] Projects: filters (domain, status), reset, empty state
- [x] Case studies for Agni-Pulse, NeuroQ, Pose2Post, CSIR-NPL Digital Twin
- [x] Experience, education, certifications, achievements, skills by evidence
- [x] Analytics dashboard: KPIs, domain and status bars, technology matrix, timeline, durations, skill evidence, education
- [x] Cross-filtering, chart-to-project navigation, reset, table views, accessible summaries
- [x] Resume route that adapts to whether a file exists
- [x] SEO: metadata, Open Graph image, sitemap, robots, JSON-LD
- [x] 404, error and loading states
- [x] Axe accessibility audit, both themes, desktop and mobile
- [x] Overflow and console-error checks on every route

## Owner input needed (see docs/CONTENT_DEPENDENCIES.md)
- [x] GitHub, LinkedIn and email links
- [x] Resume PDF
- [!] Repository URL for NeuroQ (private for now)
- [x] Contribution write-ups from the resume (Agni-Pulse, NeuroQ, Pose2Post, CSIR-NPL)
- [!] Confirm project statuses and skill evidence levels
- [!] Certification dates and credential URLs
- [!] Optional portrait and approved screenshots

## Deployment
- [!] Push to GitHub (needs owner repository and valid credentials)
- [!] Import in Vercel and deploy
- [!] Set NEXT_PUBLIC_SITE_URL to the final domain
