# NeuroQ (private repository)

**You cannot inspect this repository from here** (private, under construction, to be published soon). Everything code-level is marked **[CONFIRM - repo private, cannot inspect]**. Below is a concept-level revision plan built from the facts you gave: hybrid quantum-classical intracranial hemorrhage detection on CT, DICOM ingestion, Hounsfield conversion, CT windowing, exam-level metadata validation, patient-level leakage-safe splits, CNN features, a hybrid classifier and benchmarking; dataset context 25K+ exams and 874K+ images (this is dataset scale, **not** model performance). Your part: the data pipeline.

## 1. Project overview

Hybrid quantum-classical machine learning for intracranial hemorrhage detection on CT scans. Your verified part: the data pipeline. [CONFIRM details from the repo once opened.]

## 2. Problem statement

Detect hemorrhage in head CT exams from large public-scale data, and test whether a quantum component adds anything over a classical baseline.

## 3. Why the project was built

Association with Smart India Hackathon 2026 (outcome not recorded). [CONFIRM what was submitted and when.]

## 4. System architecture

[CONFIRM - repo private, cannot inspect] Expected shape from your description: DICOM ingest -> Hounsfield conversion -> windowing -> exam-level validation -> patient-level split -> CNN feature extractor -> hybrid quantum-classical head -> benchmark against classical.

## 5. End-to-end execution flow

[CONFIRM] Trace one exam from file to batch by opening the loader.

## 6. Technologies and why they were selected

Concepts to revise: DICOM metadata and pixel data; rescale slope/intercept to Hounsfield units; window centre and width (brain, subdural, bone); why splits must be by patient; CNN feature extraction; variational quantum circuits (encoding, ansatz, measurement) and why hybrid heads are small.

## 7. Important source files

[CONFIRM - repo private, cannot inspect]

## 8. Main functions and modules

[CONFIRM - repo private, cannot inspect] List every function in the pipeline and write one sentence on each.

## 9. Data flow

DICOM series -> HU array -> windowed channels -> tensors -> CNN features -> classifier. Leakage control: patient ID decides the split.

## 10. Model choices and reasoning (where applicable)

[CONFIRM] Be ready to defend: why a CNN backbone, why a hybrid head, how many qubits, and what the classical baseline was.

## 11. Database design (where applicable)

Not applicable.

## 12. APIs and contracts (where applicable)

Not applicable.

## 13. Important implementation decisions

Documented approach: split by patient, not image; validate metadata at exam level before modelling.

## 14. Challenges and debugging

[CONFIRM] Prepare real examples: inconsistent DICOM tags, missing slices, slope/intercept errors.

## 15. What was actually implemented

Data pipeline (yours). Model results: none recorded. [CONFIRM what else exists.]

## 16. What was only planned

[CONFIRM] Published release, full benchmark.

## 17. Current limitations

Under construction; no published results; quantum advantage is unproven and should not be claimed.

## 18. What should be improved

Publish with a clear README, a reproducible split file, and baselines.

## 19. Interview questions

- What is a Hounsfield unit and why convert?
- What is CT windowing?
- What is patient-level leakage and how did you prevent it?
- Why hybrid quantum-classical, and what would show it helps?
- What does 25K exams / 874K images tell you about the model? (Nothing about performance.)
- Which part did you build?

## 20. Suggested answers based on the actual code

- *HU:* raw pixel values are scanner units that must be rescaled using the DICOM slope and intercept so tissue densities are comparable.
- *Leakage:* images from one patient are highly correlated, so a random image split inflates scores; a patient split prevents it.
- *Dataset size:* it describes the data, not accuracy. Say no performance number exists yet.
- Everything repo-specific: answer only after reading your code. [CONFIRM]
