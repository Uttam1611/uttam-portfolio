# Customer-Facing Resolution Agent (ainos-ADR)

**Authorship and honesty notes.** Repository: https://github.com/Uttam1611/ainos-ADR. Commit history shows Uttam as the author. The README states the prototype and documentation were assembled **with AI assistance**. Before an interview, re-read `app.py` end to end so you can explain every rule yourself. If you cannot, say so plainly and describe what you do understand.

## 1. Project overview

A local, dependency-free Python prototype for an airline-disruption assignment (AIONOS Assignment 3). A chat page lets a customer describe a disrupted flight; a deterministic engine decides what the airline may do and what must be escalated, then writes an audit record.

## 2. Problem statement

Customers of three cancelled or delayed flights ask for refunds, rebooking, hotels, upgrades and waivers. The supplied policy limits what an agent may promise. The task: respond helpfully without exceeding authority or inventing facts.

## 3. Why the project was built

To show that a support agent for a rule-bound domain can be safe and auditable without an LLM, and to practise separating decision logic from customer wording.

## 4. System architecture

`message -> identity and intent signals -> supplied customer/flight facts -> policy and authority decisions -> proposed action or escalation -> response + JSONL audit` (README). A single file, `app.py` (227 lines), holds the data pack (`CUSTOMERS`, `FLIGHTS`, `POLICY`), the engine and a `BaseHTTPRequestHandler` web handler.

## 5. End-to-end execution flow

1. Browser posts a message to `Handler` (`app.py:201`).
2. `extract_context()` (`app.py:47`) finds allowlisted names, PNRs and flight numbers; `candidate_from_vague_message()` (`:39`) offers one matching case for confirmation.
3. `decide()` (`:84`) applies keyword intents (`has()`, `:72`) against policy, using `delay_benefits()` (`:75`) for delay-length rules.
4. `finish()` (`:179`) builds the customer reply, proposed (never executed) actions, escalations and policy basis, and appends to `data/audit.jsonl`.

## 6. Technologies and why they were selected

Python 3.10+ standard library only (`http.server`, `json`, `pathlib`): no API keys and nothing to install. A GitHub Actions workflow (`.github/workflows/python-app.yml`) was added on 2026-09-17. Tests use `unittest` according to the README; note that **no `tests/` folder is in the repository's tracked files** [CONFIRM where the tests are].

## 7. Important source files

`app.py` (everything), `README.md` (scope, limitations, demo script), `.github/workflows/python-app.yml`.

## 8. Main functions and modules

`decide`, `extract_context`, `candidate_from_vague_message`, `delay_benefits`, `has`, `finish`, `Handler`. Data constants: `CUSTOMERS`, `FLIGHTS`, `POLICY`.

## 9. Data flow

Message text -> detected identifiers and intents -> lookup in the closed-world data pack -> decision lists (decisions, actions, escalations, policy_basis) -> JSON response -> audit file.

## 10. Model choices and reasoning (where applicable)

No model. This is intentional: rules are inspectable and customer text cannot change them.

## 11. Database design (where applicable)

No database. Audit records go to `data/audit.jsonl`.

## 12. APIs and contracts (where applicable)

A small HTTP handler served locally at `http://127.0.0.1:8000`. [CONFIRM the exact routes by reading `Handler.do_GET` and `do_POST`.]

## 13. Important implementation decisions

- Strict threshold wording: policy says 'more than' 3 or 5 hours, so exactly 3 or 5 hours is not treated as exceeding (README).
- Unknown customers are clarified, never guessed.
- Actions are labelled proposed or simulated; the app never claims a refund, booking or hotel was executed.
- Customer text cannot alter rules (prompt-override safety coverage in tests, per README).

## 14. Challenges and debugging

[CONFIRM] No debugging history is recorded. The commit history is short: ask yourself which edge cases (vague messages, multiple intents) were hardest.

## 15. What was actually implemented

Grounded lookup for three supplied customers; cancellation refund and rebooking; delay benefits; hotel scope; loyalty priority statement; fare-waiver authority; prohibited requests; legal and formal-complaint escalation; alternative-refund-method escalation; multi-intent decisions; audit log.

## 16. What was only planned

Anything needing live seat availability, alternate-flight pricing, payment or hotel systems. The README says the data pack does not supply them.

## 17. Current limitations

Closed world of three customers; keyword matching can miss phrasing; no real backend; no fabricated metrics; AI-assisted build; single-file structure.

## 18. What should be improved

Split `app.py` into modules (data, parsing, policy, server); add typed models; add tests for exact 3 and 5 hour thresholds with clearly synthetic records; consider a hybrid design where an LLM only rephrases a decision already made by the rules.

## 19. Interview questions

- Why not use an LLM here?
- How do you stop a customer overriding the rules?
- What does 'proposed action' mean and why not execute?
- How do you handle an ambiguous customer?
- What did AI assistance do, and what did you verify yourself?
- How would you test the threshold rules?

## 20. Suggested answers based on the actual code

- *No LLM:* the policy is a fixed rule set, so rules give deterministic, auditable answers and cannot be talked out of the rules (README, Architecture).
- *Overrides:* decisions come from `decide()` using the data pack and `POLICY`; message text only supplies identifiers and keyword signals.
- *Proposed vs executed:* no payment, reservation or hotel systems exist in the prototype, so the app can only propose.
- *AI assistance:* state what the README says, then explain only the parts you have personally traced in `app.py`. [CONFIRM what you wrote versus generated.]
