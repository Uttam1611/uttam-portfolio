# Changelog

## 2.1.0

- New blue-teal palette for both themes; hero portrait re-framed inside its background box.
- Experience page split into Professional internships (prominent), Leadership and Hackathons (compact). Expanders are native `<details>` and work without JavaScript. Old filter explorer removed.
- Skills replaced by a matrix: skills on the Y-axis, internships and projects on the X-axis, dots where applied.
- Analytics: radar chart removed (role evidence meters instead); "Readiness and gaps" replaced by "Strengths by role"; gap text removed from the data model.
- Journey rebuilt as a slide show with date, flag, image and description per milestone; old timeline deleted.
- Photo slideshow moved to the homepage with autoplay (pauses on hover, focus, touch, hidden tab, reduced motion), Previous/Next, thumbnails, keyboard and swipe. Location overlays removed; other people's faces blurred (`scripts/privacy-process.py`, originals in `private-originals/`).
- Tests updated and extended (112 e2e pass, 22 unit). Not deployed.

## 2.0.0 (2026-11-14)

Redesign and expansion; not deployed.

- New editorial design system (Fraunces and DM Sans, ivory/charcoal/sage/dusty blue, warm dark theme)
- Portrait hero, About page and keyboard/touch photo story
- Journey timeline from Class 11, certifications gallery with verification links
- Work page: search, filters, sorting, URL parameters, clusters, ranking labels, grouped small repositories
- Envital added as a discontinued team project; hackathon records added
- Case studies extended; evidence-labelled skills
- Analytics rebuilt with role evidence profile, degree progress, timeline, skill map, composition and gaps
- Docs: audit, QA report, dependencies, project revision guides
- Tests: 22 unit, 110 e2e/a11y

## 1.2.0 (2026-11-13)
- Added the resume PDF, email and languages.
- Contributions for Agni-Pulse, NeuroQ, Pose2Post and CSIR-NPL, and the IBM SkillsBuild salary analysis, taken from the resume.
- NeuroQ status set to In Progress (under construction, repository private).
- New skills from the resume, marked as listed without a linked project.

## 1.1.0 (2026-11-13)
- Added GitHub and LinkedIn links.
- Rewrote Agni-Pulse and Pose2Post from their repositories (github.com/ZephyriumX), including the repository's own limits.
- Added repository links and details for the CSIR-NPL extension.
- Added three repository-backed projects and the skills they support.

## 1.0.0 (2026-11-13)
- Initial build from PRD v1.0: Home, Projects with case studies, Experience, Analytics, Contact, Resume.
- Dark and light themes with persisted switch.
- Analytics dashboard with cross-filtering, derived metrics and table views.
- Unit tests, Playwright end-to-end tests and axe accessibility audit.
