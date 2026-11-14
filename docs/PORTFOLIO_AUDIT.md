# Portfolio audit

Date: 2026-11-14. Baseline: v1.2.0 (commit `bd4f604`). Baseline checks passed (typecheck, lint, 12 unit, 73 e2e, axe).

## Findings on the previous site

- Visual: grotesque sans plus mono labels, blue-grey dark theme: functional but generic; hero used an abstract pulse illustration instead of the owner.
- Structure: Home, Projects, Experience, Analytics, Contact only. No story, no certificates gallery, no photo evidence, no About page.
- Content: two certificates with null dates; hackathons recorded only as achievements; Envital absent; small repositories ignored.
- Analytics: filtering dashboard of counts. No degree progress, no role view, no milestone timeline, and skills carried abstract evidence levels instead of plain labels.
- Honesty gaps: Class 11 and school-project details unknown; Agni and Pose2Post collaborative status not labelled on cards.

## Repository findings (both GitHub accounts, read only)

| Repository | Maturity | Authorship (git) | Handling |
|---|---|---|---|
| Agni (ZephyriumX) | Strong, tests reported, many documented limitations | Uttam plus collaborator | Case study, team project, measured results synthetic-only |
| Photopost (ZephyriumX) | Research prototype | 24 commits by another contributor, 14 by Uttam (NIMA module) | Case study, only NIMA claimed |
| CSIR-NPL-Digital-Twin-Extension | Extension of supplied server | One Uttam commit | Case study; investigated technologies not claimed |
| customer-support-ticket-agent | Strong, tests, RAG | Uttam | Case study |
| Aircraft-Damage-Detection-and-BLIP-Captioning | Notebook | One initial commit; README points to another account | Case study with authorship to confirm |
| ainos-ADR | Prototype, AI-assisted | Uttam | Case study with disclosure |
| epiwatch | Simulation only | Uttam | Grouped, not a case study |
| Django repositories (8) | Practice; PostgreSQL in settings; README/settings mismatch in one | Uttam | Grouped cluster |
| ML notebooks (5), tools (3) | Course / utility; README placeholders in two | Mixed | Grouped |
| NeuroQ | Private, under construction | n/a | Case study; no repo link |
| Envital | Discontinued, repo inaccessible | n/a | Case study, discontinued |

## What changed

Design: Fraunces serif headings with DM Sans body; ivory, charcoal, sage and dusty blue with a restrained ochre; warm near-black dark theme. Real portrait hero. New routes: `/journey`, `/certifications`, `/about`. Work page gained search, theme/maturity/assessment filters, sorting, URL parameters, qualitative labels and grouped small repositories. Case studies gained decisions, status, concepts exercised, future work and visual evidence. Experience gained working filters and hackathons. Skills use four evidence labels derived from linked records. Analytics rebuilt: degree progress, role evidence profile, milestone timeline with year tabs, skill development map, domain-by-maturity composition, evidence mix, readiness and gaps.

## Decisions

- Role profile is an ordinal evidence profile (insufficient, exposure, applied, demonstrated) with published rules, never a percentage.
- Projects and experiences count toward a role only with a documented individual contribution and an explicit role tag.
- Hackathon results are placements, never wins. Hack with UP stays "Top 5 finalist" until verified.
- Degree progress is calendar time over four years, computed in the browser with a build-date fallback.
- Open items are tracked in `docs/CONTENT_DEPENDENCIES.md`.
