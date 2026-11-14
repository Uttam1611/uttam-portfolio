# Agni-Pulse - interview revision guide

Repo: `Agni` (README title "Agni-Pulse MVP", code at v0.4.0 in `backend/main.py` / `dsp_engine.ALGO_VERSION`). Smartphone PPG/APG vascular-health "wellness" analyser: Flutter + Kotlin Camera2 capture -> FastAPI DSP service -> PostgreSQL.

## Team vs Uttam vs needs confirmation

Git log (5 commits, 2026-10-31 to 2026-11-13): authors `Uttam1611` (4) and `Uttam singh` (1, the merge of PR #1 from `ZephyriumX/development`). Per your note both identities are Uttam. A collaborator exists but is unnamed in git.

| Area | Status |
|---|---|
| Everything in the repo is committed under Uttam's two identities | Verified from git |
| Who wrote which module (DSP vs Flutter vs Kotlin vs DB) | [CONFIRM] - history is squashed ("Initial commit: Agni-Pulse current development version"), so commits cannot attribute modules |
| Who the collaborator is and what they did (the PRD, the clinical idea, the original v0.2 app?) | [CONFIRM] - `docs/PRD_GAP_ANALYSIS.md` mentions a PRD `.docx` and "your screenshots", i.e. the docs were written for a person reviewing the app; origin of the PRD [CONFIRM] |
| Whether you personally wrote the code or directed an AI assistant | [CONFIRM] - the docs read like generated engineering reports; be ready to explain every line you claim |
| Real-device testing | None evidenced. README: "This code has not been compiled" (Flutter) and "never run on a device" |

Rule for the interview: say "I worked on / own X" only for parts you can explain line by line. Everything else: "the project had a collaborator; I can speak to ...".

## 1. Project overview
Agni-Pulse records a fingertip video-PPG signal (red/green channel means from the phone camera with the flash on), sends it to a FastAPI service that band-pass filters it, computes beat-level features (b/a ratio from the second derivative = APG, RMSSD from RR intervals), gates the result with a signal-quality index (SQI), stores scans, and compares a "test" scan (post-meal, post-Vajrasana, caffeine...) against a baseline. Output is a wellness "reaction report" with an Ayurveda-flavoured interpretation. `README.md` states: "Wellness tool, not a medical device."

## 2. Problem statement
Consumer phones can capture PPG, but naive implementations give unreliable features: frame rate varies, auto-exposure saturates the finger image, motion corrupts the signal, and data is lost or exposed. The repo targets: reliable on-phone acquisition with verified timing, a deterministic DSP pipeline with a rejection gate, owner-scoped persistence, and before/after comparison of vascular tone (b/a) and HRV (RMSSD).

## 3. Why the project was built
From `docs/PRD_GAP_ANALYSIS.md`: a PRD defined features F1-F9 (capture, b/a, RMSSD, Vajrasana before/after, glycemic classifier, food diary, interventions). v0.2 had P0 defects (timeouts on `10.0.2.2`, 16/48 fps, "no finger detected", records lost on restart, any caller could read any `user_id`). v0.3/v0.4 are the fixes. Personal/academic motivation beyond that [CONFIRM].

## 4. System architecture
Three tiers (README tree):
- `app/` Flutter UI + `app/packages/ppg_camera` Kotlin plugin (Camera2: `PpgCameraPlugin.kt`, `PpgSession.kt`, `CameraCaps.kt`).
- `backend/` FastAPI (`main.py`), DSP (`dsp_engine.py`), timing policy (`capture_validation.py`), rules (`biofeedback.py`), auth (`auth.py`), storage (`storage.py`), config (`config.py`), migrations runner (`migrate.py`).
- `db/migrations/001_init.sql`, `002_hardening.sql`; `docker-compose.yml` (PostgreSQL + API).
Server is authoritative for timing thresholds; Dart ports the evaluator (`app/lib/capture_validation.dart`) for instant diagnostics; both are checked against the same golden vectors `docs/capture_validation_vectors.json` (`backend/tests/vectors.py`).

## 5. End-to-end execution flow
1. App (`scan_screen.dart`) starts Camera2 session; native code emits per-frame R/G/B ROI means, sensor timestamps, exposure/ISO.
2. `signal_monitor.dart` shows live filtered waveform; finger-detection and exposure control live in Kotlin.
3. App POSTs `/api/v1/scan/process` with `tag`, `context`, `client_scan_id`, `timestamps`, `red`, `green` (`ScanRequest` in `main.py`). Failed uploads go into `pending_queue.dart` and retry.
4. `process_scan` -> `acquisition_check` (timing verdict) -> `resample_uniform` to the measured mean rate -> `_analyse_channel` for red and green -> best by `(sqi.passed, snr_db, template_correlation)`.
5. Row saved by `PostgresStore.save_scan` (transaction, idempotent on `(user_id, client_scan_id)`); baseline scans update `users.baseline_*`.
6. If tag != Baseline and SQI passed, auto-compare against `compare_to` or latest valid Baseline (`_compare`): `percent_change_vascular_tone`, `hrv_ratio`, `compatibility`, `interpret`; stored via `save_comparison`.
7. Response includes metrics, `sqi`, `acquisition`, `capture_status`, `final_status = combine_status(...)`, comparison, disclaimer.

## 6. Technologies and why they were selected
- FastAPI + pydantic: typed request validation (`ScanRequest` validators: finite values, equal lengths, either timestamps or fs). Sync endpoint so FastAPI runs the numpy work in a worker thread (comment in `process_scan`).
- numpy/scipy only in the DSP module ("no I/O, easy to unit-test", module docstring): `sps.butter(..., output="sos")` + `sosfiltfilt` (zero-phase, stable at 0.5 Hz), `sps.find_peaks`.
- PostgreSQL via `psycopg` pool (`PostgresStore`), migrations with checksums; Supabase is only "a PostgreSQL host" - code speaks plain Postgres.
- Flutter + Kotlin Camera2: generic Flutter `camera` stream could not control exposure/frame duration (gap analysis B2).
- Docker compose for local Postgres + API.

## 7. Important source files
`backend/dsp_engine.py` (465 lines), `backend/capture_validation.py` (288), `backend/main.py` (314), `backend/storage.py` (320), `backend/auth.py`, `backend/biofeedback.py`, `backend/config.py`, `backend/migrate.py`, `db/migrations/*.sql`, `docs/PRD_GAP_ANALYSIS.md`, `docs/CAPTURE_VALIDATION.md`, `app/lib/scan_screen.dart` (499), `app/lib/capture_validation.dart`, `app/packages/ppg_camera/.../PpgSession.kt`, tests in `backend/tests/`.

## 8. Main functions and modules
- `preprocess` (NaN interpolation, rejects >2% non-finite, inverts because camera intensity falls when blood volume rises).
- `bandpass` 4th-order Butterworth 0.5-5 Hz; `derivatives` central-difference VPG/APG.
- `detect_systolic_peaks` (min distance 0.33*fs, prominence 0.3*std) ; `_refine_peak` parabolic sub-sample interpolation; `_rr_from_peaks` (300-2000 ms, local-median 30% tolerance, invalid -> NaN); `rmssd` (adjacent valid pairs only, needs >=5 diffs).
- `extract_apg_features` -> b/a (signed, negative), d/a, aging index, beat template; `assess_quality` -> `SQIResult` (variance, SNR, perfusion index, template correlation, artifact fraction).
- `CaptureConfig`, `measure_timing`, `evaluate_timestamps`, `combine_status` (PASS/WARNING/FAIL), `resample_uniform`.
- `biofeedback.compatibility` (100 x RMSSD ratio clamped, "Incompatible" if ratio < 0.7), `interpret` (context gate: low HRV without stiffness -> caffeine/stress; low HRV plus stiffness -> "Metabolic Overload" experimental).
- `auth.make_current_user`, `hash_token`, `RateLimiter`, `_verify_supabase_jwt`.

## 9. Data flow
Camera frame -> native ROI mean (R,G,B) + sensor timestamp -> Dart buffer -> JSON `{timestamps, red, green}` -> pydantic validation -> timing verdict -> linear resample to measured fs -> invert -> trim 2 s settle -> band-pass -> derivatives -> peaks -> RR/RMSSD + APG features -> SQI -> persist (raw signal as JSONB, features/sqi_report JSONB) -> compare vs baseline -> JSON response.

## 10. Model choices and reasoning
There is no ML model. The README and gap analysis say the ML glycemic classifier (F6) is "Missing by design" - no labelled glucometer data. All "models" are DSP + rule thresholds. Many thresholds are flagged ASSUMPTION in code (`TONE_STIFFER_PCT = 10.0`, `HRV_CALMER_RATIO = 1.2`, compatibility score formula). Say this plainly.

## 11. Database design
`001_init.sql`: `users`, `scans`, `interventions` (PRD schema). `002_hardening.sql`: `users.token_hash UNIQUE`; `meals`; scan columns `client_scan_id`, `context_tags`, `meal_id`, `raw_timestamps`, `effective_fs`, `duration_s`, `channel`, `features`, `sqi_report`, `algo_version`, `template`; unique partial index `uq_scans_user_client` (idempotent upload); `comparisons` table; check constraints; RLS enabled on all tables (backend connects directly; app never uses anon key). Raw signals stored as JSONB arrays (simple, but large; see limitations). `migrate.py` applies each file once with checksum.

## 12. APIs and contracts
`GET /health`, `/ready` (DB reachable + migrated), `GET /api/v1/capture-config`; `POST /api/v1/auth/register` (token shown once; optional `X-Registration-Key`, per-IP rate limit); `GET/PATCH /api/v1/me`; `POST /api/v1/scan/process`; `GET /api/v1/scans/{id}`; `POST /api/v1/scan/compare`; `GET /api/v1/reports/{user_id}` (403 if not own); `POST /api/v1/meals`; `GET /api/v1/diary`. Errors: 422 `signal_rejected` with full `acquisition` report; 413 body/samples too large; 503 `storage_unavailable` + Retry-After; generic 500 with request id.

## 13. Important implementation decisions
- Timing is judged on real sensor timestamps, not the nominal fps; the signal is resampled to the *measured* mean rate and never relabelled 60 Hz (`docs/CAPTURE_VALIDATION.md`). Hard 60 fps gate was relaxed in v0.4.0 to PASS >=58 / WARN 55-58 / FAIL <55 plus drops, gaps, jitter, window checks.
- Timing and SQI are separate gates (`combine_status`): good fps never rescues bad signal.
- `percent_change_vascular_tone` uses |baseline| because b/a is negative so + always means stiffer.
- Server refuses to start without `DATABASE_URL` (no silent in-memory fallback); memory store only via explicit env and refused in production (`Settings.validate`).
- Identity from token, never from request body; tokens stored as SHA-256 hash.
- Idempotent uploads via `client_scan_id`; offline queue on the phone.
- Non-finite values sanitised after the real-Postgres tests found `-Infinity` SNR breaking JSON.

## 14. Challenges and debugging
Documented in the gap-analysis table: emulator alias `10.0.2.2` unreachable from a physical phone (timeouts); fps 16 vs 48 on the same phone suggesting software/exposure load (explicitly "not proven without device logs"); finger detection fragile under auto-exposure; lost records; authorization hole; JSON `-Infinity`. Testing design: throw-away PostgreSQL cluster in `backend/tests/pgtemp.py`, golden vectors shared with Dart.

## 15. What was actually implemented
Verified by tests (backend, synthetic signals): DSP pipeline, SQI rejection, timing validation (68 cases in `test_capture_validation.py`), API flow, persistence across restart, outage -> 503, transaction rollback, migrations idempotence, RLS flags, token hashing, JWT HS256 mode, config guards. README claims 51 tests (written for v0.3.0; v0.4.0 added the capture-validation tests so the count differs [CONFIRM by running pytest yourself before quoting a number]). Written but never compiled/run: Flutter app, Kotlin plugin, Dart tests.

## 16. What was only planned
ML sugar-spike/glycemic classifier, LF/HF stream, 30-minute meal reminders, iOS capture, Supabase login UI in Flutter, JWKS path tested, educational wait screen, forced calm-state baseline UI (all in the gap table as Missing/Partial). Never run against a real Supabase project.

## 17. Current limitations
- All accuracy figures ("within 20% of truth", 100% artifact rejection on 5 classes x 20) are on **synthetic** signals; no real human PPG, no reference device.
- Flutter/Kotlin never compiled or run on a phone; real fps, finger thresholds and exposure controller unverified.
- Android only. Clinical thresholds are assumptions; Ayurvedic rules are not clinically validated; not a medical device.
- Raw signals as JSONB; no async processing; rate limiter is in-memory per process; display filter in Dart differs from the server Butterworth.

## 18. What should be improved
Collect real recordings against a reference PPG/ECG and re-tune thresholds; compile and run the app on 2+ phones and log fps/exposure; add Supabase Auth sign-in; run migrations against real Supabase; store signals compressed/binary; add LF/HF only with longer scans; CI running pytest and `flutter analyze`.

## 19. Interview questions
1. Walk me through the pipeline from camera frame to RMSSD.
2. Why invert the signal? Why zero-phase filtering? Why 0.5-5 Hz?
3. What is APG and b/a? Why is it negative here and how did you define "percent change"?
4. Why resample to the measured rate instead of 60 Hz? What does linear interpolation cost?
5. How do you know the DSP is accurate? (trap question)
6. Why separate timing and SQI gates?
7. How is the API secured? How do you stop one user reading another's report?
8. How does idempotent upload work?
9. What was the 10.0.2.2 bug?
10. What is not done / what would you do on real data?
11. Which parts did you build vs your collaborator?

## 20. Suggested answers based on the actual code
- Pipeline: "`process_scan` validates timestamps, resamples to the measured rate, inverts, trims 2 s, 4th-order Butterworth 0.5-5 Hz with `sosfiltfilt`, derives APG by central differences, finds peaks, filters RR (300-2000 ms and 30% of local median), computes RMSSD over adjacent valid pairs and b/a from the APG beat marks, then a SQI decides pass/fail."
- Inversion: "Camera intensity drops when blood volume rises, so I invert so systolic peaks point up. Zero-phase so peak timing is not shifted, which matters for RR."
- b/a: "b is a negative deflection so b/a is negative; I divide by |baseline| so positive change always means stiffer."
- Resampling: "Uniform grid at measured mean rate; it acts as a mild low-pass and across dropped frames it draws straight lines, which is why drops and gaps are limited and reported."
- Accuracy: "Honest answer: only on synthetic signals I generated in `tests/synth.py`. They prove the maths and stability, not clinical validity. No real-subject data or reference device yet."
- Timing vs SQI: "Fps can be perfect with a dead signal, and vice versa. `combine_status` takes the worse."
- Security: "Identity comes from the bearer token (hash stored) or a Supabase JWT, every query filters by `user_id`, report returns 403 for another id, tests in `test_persistence_security.py` and `test_api.py`."
- Idempotency: "Unique partial index on `(user_id, client_scan_id)`; `save_scan` checks first inside a transaction and returns the existing row with `created=False`."
- 10.0.2.2: "Emulator-only alias for the host; on a real phone packets vanish so it times out. Default now depends on device type, URL editable in-app, `adb reverse` for USB."
- Not done: "The Flutter and Kotlin code was never compiled in the build environment; ML classifier, LF/HF, iOS are not built; InfluxDB/AWS IoT/Azure IoT were looked at for time-series storage but not implemented." [CONFIRM where this investigation is documented - not in this repo]
- Collaboration: only state what you can confirm; say the collaborator is not identified in git.
