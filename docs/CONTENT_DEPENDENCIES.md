# Content dependencies

Nothing below has been invented. Each item shows as "not added yet" or "to be confirmed" on the site until supplied. Run `npm run content:check` for the live list. Updated 2026-11-14.

## Needed from you

| # | Item | Where it goes | Why it matters |
|---|---|---|---|
| 1 | School name and Class 11 dates | `src/content/journey.ts` (`class-11-cs`) | The journey says only "Class 11". |
| 2 | School project name, school, date, and details of the accompanying educator paper (title, where published, your role) | `journey.ts` (`school-project`, status `to-confirm`) | The entry is deliberately vague. The `School-project` repo is a Class 12 Tkinter app and is **not** assumed to be this project. |
| 3 | Exact dates and context of other early milestones | `journey.ts` | Only verifiable dates are shown. |
| 4 | Envital: repository access (private? another account?), what it measured, your individual contribution, why it was discontinued | `projects.ts` (`envital`) | No code could be inspected, so no technical claim is made. |
| 5 | Hack with Uttar Pradesh: confirm fifth place | `education.ts`, `journey.ts`, `experience.ts` | Shown as "Top 5 finalist" until verified. |
| 6 | IIT hackathon photo (`iitr-hackathon.jpeg`): which IIT event, date, your role | `photos.ts` | Caption is deliberately generic. |
| 7 | Certificate photo (`certificate_ncu.png`): confirm it is the JavaJamboree Ideathon, and the ideathon date | `photos.ts`, `journey.ts` | Caption says "probably". |
| 8 | Consent from people shown in group photos (Mohali, Lucknow, IIT, certificate, DRDO) | `photos.ts` | Faces of other people are published. Remove any photo you do not have consent for. |
| 9 | DRDO photos carry a GPS and timestamp overlay with an exact street location | `public/images/personal/drdo1.jpeg`, `drdo2.jpeg` | Crop the overlay out before publishing if you prefer. The July 2026 date was read from the overlay. |
| 10 | Microsoft photo: what the event was and when | `photos.ts` | Caption says only "A visit to a Microsoft office". |
| 11 | Larger original of `dt-machine.jpg` (347 by 491 pixels) | `public/images/personal/` | It looks soft at larger sizes. |
| 12 | Agni-Pulse: collaborator name(s) and your share; has the Android app ever been compiled and run? | `projects.ts` | Needed to describe the team honestly. |
| 13 | Pose2Post: collaborator's modules, repository cleanup status | `projects.ts` | You said you will clean the repo. Re-check afterwards. |
| 14 | Aircraft damage / BLIP: authorship. The README clone URL points to `buildwithmehul`; the repo has one initial commit by you | `projects.ts` | Individual contribution is deliberately empty until confirmed. |
| 15 | CSIR-NPL: whether the 3-member data team you led sits under CSIR-NPL, and permission to show DRDO and team photos | `experience.ts` | Placement was unconfirmed in the resume. |
| 16 | NeuroQ: repository URL after the planned publication, your pipeline contribution details, SIH 2026 outcome | `projects.ts`, `education.ts` | Private for now. |
| 17 | Final status for unfinished repositories | `projects.ts` | Statuses are conservative. |
| 18 | Measured results that do not yet exist | `evaluation.measured` | Empty is fine. Dataset size is never shown as performance. |
| 19 | Your reflections on "what I learned" per project | `projects.ts` `learned` | The pages currently list concepts exercised, not your reflections. |
| 20 | Certificate extra skills listed on each verification page | `education.ts` | Only the skills you supplied are shown. |
| 21 | Phone number on the resume PDF | `public/resume/Uttam-Singh-Resume.pdf` | The PDF is public once deployed. Replace it if you do not want your phone number public. |
| 22 | Approved project screenshots | `public/projects/<slug>/` | None are published. |
| 23 | Awards and publications | `education.ts` | None recorded. |
| 24 | Currently-learning skills | `skills.ts` | None recorded. |

## Verification still to do

Certification links were taken from your list. They need to be opened once by you (some Coursera and Credly pages may require a signed-in or non-bot browser). The Playwright suite checks only that each link is a well-formed HTTPS URL.

## Added from GitHub (Nov 2026)

Repositories inspected by reading READMEs, files and git history. Code was not run. Case studies: Agni, Photopost, CSIR-NPL-Digital-Twin-Extension, customer-support-ticket-agent, Aircraft-Damage-Detection-and-BLIP-Captioning, ainos-ADR. Grouped on the Work page: ML notebooks, the Django cluster, small tools and epiwatch.
