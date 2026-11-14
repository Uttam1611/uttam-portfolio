# Decisions

1. **Stack**: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, Framer Motion, Lucide, as the PRD specifies. Pages are statically generated.
2. **Charts are hand-built HTML and SVG, not Recharts.** The PRD allows "another approach". Bars are buttons, so they are keyboard and touch accessible, tooltips are CSS, and no chart library ships to the browser. Every chart has a "View as table" alternative.
3. **No categorical colour on charts.** Domain, status and duration bars use one accent and are identified by their labels. Skill evidence is ordinal, so it uses a single-hue ramp, validated with the dataviz palette checker for both surfaces.
4. **No radar chart.** The PRD allows one only with defensible values. No such values exist.
5. **Skill taxonomy**: the six categories requested for this build. The PRD's eight analytics categories fold into them (Statistics and Data Science into Data Science and Analytics, Machine Learning and Deep Learning together, Backend and Data Engineering together).
6. **Four evidence levels** (demonstrated, working knowledge, currently learning, research exposure) extend the PRD's three. Research exposure is kept apart from learning so that investigated technologies are never read as implemented. "Currently learning" is empty because nothing is recorded.
7. **Statuses are deliberately conservative.** Agni-Pulse is Working Prototype because the PRD mentions a running MVP. The other three are Research / Experimental until the owner confirms more. No project is marked Completed.
8. **Repository-backed projects added.** Customer Support Ticket Agent, Aircraft Damage and BLIP, and the Airline Disruption Resolution Agent have public repositories with substantive READMEs, so they are published. They are not featured on Home, which keeps the four PRD projects. Statuses reflect what each README states. Code and tests were read but never executed here. The repository for Agni-Pulse contradicted the PRD in one respect (no machine-learning classifier is built), so the repository wins and the page was corrected.
9. **Programmers' Club is a Leadership record**, shown beside but separate from the three internships. KPI "Internships" counts only internships.
10. **Durations use inclusive calendar months** and overlapping internships are counted once in totals. All "to date" values use `site.lastUpdated`, so builds are reproducible.
11. **Technology counting rule**: once per project that lists it. Domain chart offers a primary-domain mode and an all-labels mode, and filters follow the selected mode so bar counts and filtered lists always agree.
12. **No contact form.** The PRD marks complex backends and visitor data collection out of scope. Contact is by email and LinkedIn.
13. **Owner assets are detected on disk.** `public/resume/Uttam-Singh-Resume.pdf` and `public/images/portrait.jpg` switch on the resume download and portrait with no code change.
14. **Hero visual is a synthetic pulse waveform**, captioned as illustrative, because no approved portrait was supplied. It relates to Agni-Pulse and is not presented as data.
15. **Typography**: Schibsted Grotesk (self-hosted via Fontsource, no third-party font requests) with IBM Plex Mono for technology chips only.
16. **Brand icons** (GitHub, LinkedIn) are inline SVG because lucide-react v1 no longer ships brand marks.
18. **Resume-sourced claims** are kept to the resume's wording. Unmeasured claims in it ("improved compensation analysis accuracy", "ML" in the Agni-Pulse bullet) are left out because the site shows no figure for them and the Agni-Pulse repository says no ML classifier is built. Skills that appear only on the resume are classed as working knowledge with a note that no project is linked.
17. **Playwright is pinned to 1.63.0** to match the browsers preinstalled in the build environment.

## 19. Role evidence profile instead of a suitability score (2026-11-14)
Ordinal levels with published rules (`src/lib/roles.ts`); no percentages. Internships and credentials cap at "applied".

## 20. Skill labels derived from linked records (2026-11-14)
Used in projects, Applied during internship, Academic exposure, Currently learning. Computed by `skillEvidenceLabel`, never typed by hand.

## 21. Fonts: Fraunces and DM Sans (2026-11-14)
Replace Schibsted Grotesk and IBM Plex Mono for an editorial tone. Added `@fontsource-variable/fraunces` and `@fontsource-variable/dm-sans`.

## 22. Hackathon wording (2026-11-14)
Technicia is Top 10 and Hack with UP is Top 5 finalist until verified; neither is described as a win.
