# Machine learning notebooks and epiwatch

Repos: `AUS-Weather-Prediction`, `employee-salary-prediction`, `league-match-predictor`, `waste-classifier-tl-ft`, `Summer-analytics-2025`, `epiwatch`. Honest caveats: `employee-salary-prediction` actually predicts whether income exceeds a threshold, despite its name, and its README has unfilled result placeholders; `waste-classifier-tl-ft` README also has placeholders. `epiwatch` runs on **simulated** data only (`simulation/` folder generates users, wearables, environment; `run_pipeline.py` merges; `models/train_lstm.py` trains an LSTM; `detection/` and `dashboard/` consume it). None of this is evidence about real surveillance.

## 1. Project overview

Course and practice notebooks showing standard supervised learning (classification, transfer learning) plus one simulation-based outbreak-detection prototype.

## 2. Problem statement

Predict weather outcomes, income class, match outcomes and waste image classes; detect simulated flu-like outbreaks from wearable-style signals.

## 3. Why the project was built

Course final projects and self-study. [CONFIRM per repo.]

## 4. System architecture

Notebook-centred. For `epiwatch`: `simulation/*` -> `data/*.csv` -> `models/create_sequences.py` -> `models/train_lstm.py` -> `detection/early_warning.py` -> `dashboard/dashboard.py` / `app.py`.

## 5. End-to-end execution flow

epiwatch: run `run_pipeline.py` to generate and merge data, train, then launch the dashboard (`app.py`). [CONFIRM exact commands from README.]

## 6. Technologies and why they were selected

pandas, scikit-learn, Keras/TensorFlow (LSTM, transfer learning), Streamlit or similar dashboards [CONFIRM], simulated data for privacy and speed.

## 7. Important source files

epiwatch: `run_pipeline.py`, `simulation/generate_*.py`, `simulation/merge_data.py`, `models/train_lstm.py`, `models/create_sequences.py`, `detection/detect_flu.py`, `detection/early_warning.py`, `dashboard/*.py`. Other repos: the main notebook in each.

## 8. Main functions and modules

epiwatch: sequence builder, LSTM trainer, early-warning rules, report generator. [CONFIRM names by opening the files.]

## 9. Data flow

epiwatch: simulated users + wearable + environment + symptoms -> merged time series -> sliding windows `X_seq`/`y_seq` -> LSTM -> risk -> dashboard.

## 10. Model choices and reasoning (where applicable)

LSTM for sequences of wearable signals; tabular models for the course notebooks. Be able to explain why simulated labels make any score meaningless for real-world claims.

## 11. Database design (where applicable)

Not applicable.

## 12. APIs and contracts (where applicable)

Not applicable.

## 13. Important implementation decisions

Simulating data to avoid privacy issues; windowed sequences for time series. [CONFIRM other decisions.]

## 14. Challenges and debugging

[CONFIRM] Prepare one example per repo, such as leakage, class imbalance or over-fitting.

## 15. What was actually implemented

Pipelines and notebooks as above. No real-world results.

## 16. What was only planned

Real data integration for epiwatch.

## 17. Current limitations

Simulated data only; README placeholders; naming mismatch in employee-salary-prediction; no deployment; no external validation.

## 18. What should be improved

Fill README results with real, re-run numbers; rename mismatched repos; add train/test leakage checks; document data sources.

## 19. Interview questions

- What does epiwatch actually prove? (Only that the pipeline runs on simulated data.)
- Why windowed sequences and an LSTM?
- What is data leakage and where could it occur here?
- Why does the salary repo's name not match what it predicts?
- How do you evaluate a transfer-learning classifier properly?

## 20. Suggested answers based on the actual code

State the limits first (simulated, practice, course). Then describe the pipeline from the file list. Do not quote any accuracy number unless you have re-run the notebook. [CONFIRM]
