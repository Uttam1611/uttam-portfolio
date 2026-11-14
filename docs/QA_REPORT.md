# QA report

Run on 2026-11-14 against the production build (`next build`, `next start`).

## Automated checks

| Check | Result |
|---|---|
| `npm run typecheck` (strict, `noUncheckedIndexedAccess`) | Pass |
| `npm run lint` (ESLint 9, eslint-config-next) | Pass, no warnings |
| `npm test` (Vitest) | 22 of 22 pass: date maths, metrics, degree progress, role evidence framework, skill labels, content integrity |
| `npm run build` | Pass; all routes static |
| `npx playwright test` (desktop 1280 and mobile 390) | 109 passed, 1 skipped |
| `npm run content:check` | Runs; reports 5 open content groups (see `docs/CONTENT_DEPENDENCIES.md`) |
| axe-core (WCAG 2a, 2aa, 21aa) | 0 violations on 10 routes, both themes, desktop and mobile (40 runs) |

The skipped test is the resume-absent fallback, which only applies when no PDF exists.

## Regression tests added

Project filters, search, sort and URL parameters (and restoring from the URL); experience filters; journey filters and the Class 11 start; seven certificates with HTTPS links and issuer filter; photo story by buttons and keyboard; analytics degree progress, role profile, year tabs, timeline detail and skill map; theme on every page (background colour check); Envital honesty (discontinued, Top 5 finalist, no winner wording); mobile navigation.

## Viewport and theme sweep

Ten pages (`/`, `/projects`, `/projects/agni-pulse`, `/projects/envital`, `/journey`, `/experience`, `/certifications`, `/analytics`, `/about`, `/contact`) at 1440, 1280, 768, 390 and 360 pixels in light and dark: no horizontal overflow, no console errors, and `data-theme` matched the stored choice on every page. Full-page screenshots at 1440 and 390 are in `docs/qa-screenshots/` (40 files).

## Defects found and fixed in this pass

| Defect | Fix |
|---|---|
| Header "Get in touch" and Resume buttons showed on phones and caused 22 px overflow at 360 px (the unlayered `.btn` rule beat Tailwind's `hidden`) | Moved `.btn` rules into `@layer components` |
| Contact page overflowed at 360 px (grid child without `min-w-0`) | Added `min-w-0` |
| Radar axis labels clipped | Widened the viewBox |
| Scrollable table regions not keyboard-focusable (axe) | Added `tabIndex`, role and label |
| Practical experience rated "Demonstrated" after two short internships | Capped at "Applied" and documented the rule |
| Mobile-nav test referenced the old "Projects" link | Updated to "Work" |

## Known gaps

- Certification links were not opened against the live issuers. The tests check only that they are HTTPS URLs.
- No real-device touch test of the photo-story swipe; keyboard and button paths are tested, swipe uses standard touch events.
- Colour contrast is covered by axe in both themes; the evidence-ramp colours were chosen from an earlier validated ordinal ramp for the sage hue but were not re-run through the palette validator.

## V2.1 (local run)
typecheck, eslint, 22 unit tests, content check, production build and 111 e2e tests (1 skipped) passed on desktop 1280 and mobile 390; no horizontal overflow at 1440/390 in either theme. Screenshots regenerated. Owner identification in group photos was visual and must be confirmed by Uttam.
