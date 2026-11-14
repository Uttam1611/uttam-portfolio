# CSIR-NPL Digital Twin extension - interview revision guide

Repo: `csir`. README title "CSIR-NPL Digital Twin: Telemetry Persistence & Uncertainty Extension". An additive layer (PostgreSQL logging + GUM measurement uncertainty) bolted onto a **supplied** FastAPI inference server (`inference_server.py`) for an induction-motor / bearing-fault digital twin.

## Team vs Uttam vs needs confirmation

Git log: exactly **one commit**, by `Uttam singh`, 2026-11-13, "Fix image formatting in README.md". So git cannot attribute any module.

| Area | Status |
|---|---|
| The ONNX ensemble, STFT/Hilbert features, `/predict` core, the edge controller, MQTT, Vercel dashboard, the project report | NOT Uttam's per the repo's own notes: `README_EXTENSION.md` section 0 says the server was "supplied" and the edge/dashboard code was in separate archives not in this repo |
| `uncertainty/` and `storage/` packages, `sql/001_...sql`, the additive edits to `inference_server.py` | This is the extension. `README_EXTENSION.md` is written in first person by the author of the extension ("I unzipped and read both archives", "Per your instruction"), i.e. a dialogue with the requester. Who typed it: [CONFIRM] whether Uttam wrote it himself, directed an AI assistant, or both. The README says to "distinguish ... work personally designed or implemented from ... the wider project team, project lead, mentors or AI-assisted development" |
| DRDO presentation | Not in this repo. It was done together with the project lead; do NOT claim you led it [CONFIRM details of your part] |
| InfluxDB / AWS IoT Core / Azure IoT Hub | Not in the repo (grep finds none). Investigated only, never implemented |
| End-to-end validation | Not done. README "Status": "Prototype / extension. End-to-end validation ... remains to be completed" |
| The three README images (`assets/DT1-4.jpeg`) | Architecture/RUL diagrams; their authorship [CONFIRM] |

Interview rule: say "I extended the supplied inference service with a persistence and uncertainty layer", never "I built the digital twin".

## 1. Project overview
The inference server takes a 1-D vibration window, builds a (17, 769) STFT+envelope feature matrix, runs four ONNX models (CNN, LSTM, Transformer, Hybrid), stacks their outputs into a pickled meta-learner and returns one of four bearing classes (`CLASS_NAMES` default `Ball, Normal, OuterRace, InnerRace`). The extension adds: (a) per-channel Type A / Type B / combined / expanded measurement uncertainty on every call, (b) a PostgreSQL row per inference cycle for later dataset generation, written in a background task, with graceful degradation if the DB is down.

## 2. Problem statement
Predictions were produced but nothing was recorded, so there was no historical dataset for trend analysis or retraining, and no statement of how trustworthy the sensor readings themselves were. Model `confidence` is not measurement uncertainty; the code docstrings keep these separate (`uncertainty/__init__.py`).

## 3. Why the project was built
To meet two extension tasks given by the project side ("Task 1" dataset generation, "Task 2" measurement uncertainty, named in code comments). Organisational context (CSIR-NPL, metrology flavour of GUM) is from the README title; the exact brief and who set it [CONFIRM].

## 4. System architecture
Only the inference service is in this repo.
```
caller --POST /predict--> FastAPI (inference_server.py)
   window -> preprocess_window -> extract_features -> run_inference (4 ONNX + meta-learner)
   readings -> UncertaintyEngine.evaluate (type_a + type_b + combiner)
   InferenceCycleRecord -> BackgroundTasks -> _persist_cycle -> InferenceCycleRepository.insert -> PostgreSQL
```
Packages: `uncertainty/` (pure numbers, no I/O), `storage/` (config, pooled connection, schema, model, repository). Not in repo: `control_panel.py` (Raspberry Pi, MQTT, VFD/DS18B20), `web-dashboard/` (Vercel), `mock-sensors/`. Per `README_EXTENSION.md` the Pi code does not call this server at all as supplied.

## 5. End-to-end execution flow
1. Startup: load 4 ONNX sessions + `meta_learner.pkl` + `feature_config.json` from `./dt_model_artifacts` (raises and exits if missing). Build `UncertaintyEngine`. Try `load_postgres_config` -> `PostgresConnectionManager` -> `ensure_schema` -> `InferenceCycleRepository`; on any exception print a warning and set `cycle_repository = None`.
2. `POST /predict` with `PredictRequest` (`window` plus optional `rpm, current, voltage, frequency, temperature, extra_sensors`).
3. `preprocess_window`: resample from `INFERENCE_SR` (1000 Hz) to `TARGET_SR` (12000 Hz), crop/edge-pad to `SEGMENT_LENGTH` 2048, `extract_features`, add batch axis -> (1,17,769).
4. `run_inference`: each ONNX session -> probs; concatenate (expects 16 values) -> `meta_learner.predict/predict_proba`.
5. Vibration RMS of the raw window; `readings` dict (vibration + whichever optional channels were sent) -> `uncertainty_engine.evaluate`.
6. Build `InferenceCycleRecord`; if repository exists, `background_tasks.add_task(_persist_cycle, record)`.
7. Return `PredictResponse` (class, confidence, probabilities, window_size, resampled_sr, `uncertainty`, `cycle_id`). Exceptions -> HTTP 500.

## 6. Technologies and why they were selected
- FastAPI + pydantic: already the supplied server's framework; extension added optional fields so old callers (window only) still work ("add a door, don't move the walls", README_EXTENSION section 3).
- `BackgroundTasks`: DB write after the response so a slow DB adds no latency to `/predict`.
- psycopg2 `ThreadedConnectionPool`: `/predict` is a sync `def`, run in a worker thread pool, so a thread-safe pool is needed (docstring in `storage/connection.py`).
- JSONB + typed columns: typed for fields you filter on, JSONB (`extra_sensors`, `uncertainty_detail`) so new sensors need no migration.
- python-dotenv (optional import) for credentials via env vars; no hard-coded secrets.
- ONNX Runtime / scipy / numpy: from the supplied server, not Uttam's choice.

## 7. Important source files
`inference_server.py` (396 lines, mixed supplied + additive), `uncertainty/type_a.py` (87), `type_b.py` (101), `combiner.py` (51), `__init__.py` (65, `UncertaintyEngine`); `storage/config.py` (45), `connection.py` (105), `schema.py` (104), `models.py` (51), `repository.py` (91); `sql/001_create_inference_cycles.sql`; `.env.example`; `README.md`, `README_EXTENSION.md`. No tests directory.

## 8. Main functions and modules
- `RollingWindowEstimator.update` (deque of last N readings, lock, returns n, mean, sample std, `s/sqrt(n)`; n<2 gives 0), `MultiChannelTypeAEstimator` (one estimator per channel name).
- `ChannelSpec.standard_uncertainty`: manufacturer accuracy/sqrt(3) (rectangular) or /k (normal); otherwise `resolution/sqrt(12)`. `DEFAULT_CHANNEL_SPECS` for current (0.01 A), voltage (0.1 V), frequency (0.01 Hz), temperature (0.0625 C), vibration (1/4096 g). `load_channel_specs` overlays a JSON file from `UNCERTAINTY_CONFIG_PATH`.
- `combine`: `u_c = sqrt(u_A^2 + u_B^2)`, `U = k*u_c`, k=2 (no Welch-Satterthwaite; docstring says so).
- `UncertaintyEngine.evaluate/as_dict`.
- `PostgresConnectionManager.get_connection`: validates with `SELECT 1`, rebuilds the pool, 3 retries with linear backoff, else `ConnectionError`.
- `InferenceCycleRepository.insert`: explicit commit/rollback, returns False instead of raising; optional gzip of the feature matrix.
- `ensure_schema`: idempotent DDL at startup.
- In the server: `_feature_summary`, `_persist_cycle`, `extract_features`, `preprocess_window`, `run_inference`, `/health`, `/predict`.

## 9. Data flow
Raw window (floats) -> resample -> features (17x769 float32) -> 4 model outputs (16 numbers) -> meta-learner -> class + probabilities. In parallel: window -> RMS -> Type A rolling window (per channel, **process-global**, so it mixes all callers) + Type B spec -> `CombinedUncertainty` -> JSON in response and in `uncertainty_detail`; vibration numbers also into typed columns. Row = telemetry + prediction + uncertainty + feature summary (mean/std/min/max of the matrix) + optional gzipped matrix.

## 10. Model choices and reasoning
Supplied, not chosen by Uttam: four ONNX nets + stacking meta-learner. `/health` returns a hard-coded string "Stacking (95.1%)"; that figure is not computed or verifiable in this repo (artifacts absent) [CONFIRM source, probably the project report]. Uncertainty model choices that are visible and defensible: GUM Type A/B, rectangular distribution for resolution, k=2 coverage.

## 11. Database design
Table `inference_cycles` (`schema.py` and `sql/001_...sql`): `id BIGSERIAL`, `cycle_uuid UUID` (unique index), `recorded_at`, telemetry columns (`rpm, current_a, voltage_v, frequency_hz, temperature_c, vibration_rms_g`), `fault_class TEXT`, `confidence`, `model_probabilities JSONB`, placeholders `ohim, rul_hours, health_score` (always NULL), `type_a/type_b/combined_uncertainty`, `uncertainty_detail JSONB`, `extra_sensors JSONB` (GIN index), `preprocessed_features JSONB`, `feature_matrix_shape SMALLINT[]`, `feature_matrix_bytes BYTEA`, sample-rate and window columns, `created_at`. Indexes on `recorded_at`, `fault_class`. Only insert is implemented; no read/query code.

## 12. APIs and contracts
`GET /health` -> status, model string, classes, rates, `dataset_logging` enabled/disabled. `POST /predict`: request as above (all new fields optional/None), response `PredictResponse` with optional `uncertainty: Dict[str, UncertaintyChannel]` and `cycle_id`. Port 8001 via uvicorn in `__main__`. No auth.

## 13. Important implementation decisions
- Fail-soft DB: startup try/except + `insert` returns bool + background task, so logging can never break inference.
- Optional request fields: backward compatible.
- Typed columns vs JSONB split (above); nullable placeholders instead of inventing a health-score formula.
- Type B defaults documented with provenance in the `type_b.py` docstring: current/voltage/frequency/vibration resolutions come from the project report's register scaling; the DS18B20 0.0625 C is a datasheet default **not** in the supplied files; no accuracy figures invented.
- Feature matrix storage off by default (`DT_STORE_FEATURE_MATRIX`), reasoning in `README_EXTENSION.md` (about 52 KB/row; the "4.5 GB/day" figure is its arithmetic at 1 Hz).
- Explicitly scoped to `inference_server.py` only; `control_panel.py` untouched.

## 14. Challenges and debugging
Recorded in the repo: the supplied code did not match the report (no MPU-6050 code, hard-coded `vibration: 0.0`, Pi never calls the server); model artifacts missing so the server cannot start here; no Postgres server installable in the author's sandbox. Verification claimed in `README_EXTENSION.md` section 5: `py_compile`, a 7-cycle uncertainty simulation, and a no-DB degradation check; those ran in a sandbox, no test files are committed, and I did not re-run them. Uttam's own debugging history is not in git [CONFIRM].

## 15. What was actually implemented
Everything listed in sections 8 and 11, compiled/simulated only per the README. Server, DB, and models were never run together.

## 16. What was only planned
`ohim`, `rul_hours`, `health_score` (columns exist, never populated); wiring `control_panel.py` to `/predict`; Welch-Satterthwaite DOF; real datasheet accuracies; `002_` migrations; InfluxDB, AWS IoT Core, Azure IoT Hub (investigated, not implemented); end-to-end validation with real artifacts and live Postgres.

## 17. Current limitations
- Not validated end to end; no committed tests.
- `cycle_id` is returned even when the row was not persisted (`cycle_repository` None or insert failed), so it is a generated id, not a proof of storage.
- Type A is a rolling window of **successive requests' values across all callers/motors**, and for vibration it is the RMS of each window, which is statistically a different quantity from repeated readings of one measurand.
- Type B depends on placeholder resolutions; unknown channels get 0.
- Uncertainty stored as typed columns only for vibration.
- 1 kHz -> 12 kHz resampling means no new information above 500 Hz.
- Debug `print` calls in the hot path; `extract_features` computes the STFT on `seg`, not the filtered `seg_filt` (filtered only feeds the envelope) - inherited code.
- Failed inserts are only logged; no retry queue. No auth on the API. `.env` loaded at import.

## 18. What should be improved
Add pytest tests for `uncertainty/` and `repository` (mock psycopg2); per-device keys for Type A; a proper outbox/retry for failed writes; return `cycle_id` only after success (or a `persisted` flag); replace print with logging; DB reads/retention policy and partitioning; secrets manager; run against real artifacts and Postgres and record the result.

## 19. Interview questions
1. What exactly did you build versus what was supplied?
2. Why a BackgroundTask for the DB write and what is the trade-off?
3. Explain Type A vs Type B uncertainty and how you combined them.
4. Why `resolution/sqrt(12)`?
5. Why k=2 and what does it assume?
6. Why a mixed typed/JSONB schema?
7. What happens if Postgres is down at startup? Mid-run?
8. Is the model `confidence` an uncertainty? Why not?
9. How would you validate this end to end?
10. What are the flaws of your Type A approach?
11. Why were InfluxDB/AWS/Azure not used?
12. How would you scale writes at 1 Hz per motor?

## 20. Suggested answers based on the actual code
1. "The inference server and models were supplied. I added `uncertainty/`, `storage/`, the SQL schema and optional fields on `/predict`. It was a team project and I presented/worked on it with the project lead [CONFIRM your exact part]."
2. "`/predict` is the dashboard's hot path; `_persist_cycle` runs after the response, so slow DB writes add no latency. Cost: a crash between response and write loses the row, and the returned `cycle_id` does not guarantee persistence."
3. "Type A is `s/sqrt(n)` over a rolling window (`type_a.py`); Type B comes from instrument resolution (`type_b.py`); `combine` does root-sum-of-squares and multiplies by k."
4. "For a value known only to lie within one resolution step, GUM's rectangular assumption gives half-width/sqrt(3) = (res/2)/sqrt(3) = res/sqrt(12)."
5. "k=2 is the conventional ~95% factor for roughly normal output. The docstring says it is not a Welch-Satterthwaite calculation; I would not call it a rigorous 95% interval."
6. "Columns I filter on are typed and indexable; new sensors go into `extra_sensors` JSONB (GIN-indexed) with no migration."
7. "Startup: warning, `cycle_repository=None`, `/health` reports logging disabled, `/predict` still works. Mid-run: `get_connection` retries 3 times, `insert` returns False, a warning is logged, the pool rebuilds on a later call. I did not test this against a live database; the README says it was only checked without Postgres."
8. "No. `confidence` is the meta-learner's max probability. Uncertainty here is about sensor readings; the code keeps them separate."
9. "Place the artifacts, start Postgres, follow the five-step list in `README_EXTENSION.md` section 5, then add automated tests. Not done yet."
10. "The window is shared across callers and mixes successive RMS values; it should be keyed per motor and ideally based on repeated readings of a steady state."
11. "I investigated them as options; the repo contains no code for them, and PostgreSQL was what the extension used."
12. "Batching or a queue, partitioning on `recorded_at`, keeping the raw matrix off, and retention. None of this is implemented."
