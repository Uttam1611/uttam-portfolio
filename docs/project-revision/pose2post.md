# Pose2Post / Photopost - interview revision guide

Repo: `Photopost` (GitHub `ZephyriumX/Photopost`, MIT). A bundle of four *independent* scripts toward an "idea -> photo -> caption -> post" assistant. Your verified part is the NIMA aesthetic scorer in `nima-aesthetic-photo-scorer/`.

## Team vs Uttam vs needs confirmation

`git log`: 24 commits by Mehul Khanna, 14 by Uttam singh (merge/PR commits included in the count).

| Component | Author per git | Notes |
|---|---|---|
| `nima-aesthetic-photo-scorer/` (data, model, loss, train, eval, infer, tflite, router) | Uttam singh (commits 2025-08-19, 08-25, 08-26, 08-30; "Add trained NIMA models" 08-31) | **Verified Uttam part** |
| `models/` (NIMA weights, `train_log.csv`) | Uttam singh | Files are Git LFS pointers in this clone (`version https://git-lfs.github.com/spec/v1`, ~22 MB each), so I could not inspect weights |
| `pose-recommender-clip-script/script.py` | Mehul Khanna ("Pose Recommender Script v1") | Not yours; talk about it only as teammate context |
| `caption-generation-blip-script/Script.py` | Mehul Khanna | Not yours |
| `song_recommendation/song-recommender-script/` | Mehul Khanna | Not yours |
| `.github/workflows/lint.yml`, CONTRIBUTING, LICENSE, PR template | Mehul Khanna | Not yours |
| `README.md` (467 lines, "Update Readme" 2026-11-12) | Uttam singh | Honest, documents limits; but check it matches code |
| `links.md`, repo creation ("First commit of the project") | Uttam singh | |
| Who designed the overall product idea / team size | [CONFIRM] | |
| Whether a Spotify or frontend/beautification module exists | Not in repo; old `readme.md` lists "Beautification Pipeline", "FastAPI Backend", Spotify - treat as planned [CONFIRM] |

Interview rule: say "I built the NIMA aesthetic scoring module; teammates built the CLIP pose recommender, BLIP captioning and song recommender."

## 1. Project overview
Photopost aims to help a user create a social post: CLIP suggests poses/backgrounds, NIMA ranks multiple shots by aesthetic quality, BLIP captions the winner, a script recommends songs. The repo README itself says these are separate workflows with no unified service.

## 2. Problem statement
Picking the best of many photos and writing a caption is tedious. NIMA module problem: predict a *distribution* of human aesthetic ratings (1-10) for an image so photos can be ranked by mean score (and uncertainty).

## 3. Why the project was built
Team project (reason beyond README [CONFIRM]). For NIMA specifically: the original NIMA paper idea (distribution prediction with EMD loss) on a light MobileNetV2 so it can run via TFLite on-device/FastAPI.

## 4. System architecture
Four scripts, no integration. NIMA internals: `data.py` (AVA-style CSV -> tf.data) -> `model.py` (`build_nima`) -> `train.py` (two-phase) -> `eval.py` / `infer.py` -> `tflite_convert.py` -> `tflite_infer.NIMATFLite` -> `router.py` (`APIRouter(prefix="/nima")`, `POST /nima/rate`, also a standalone `app = FastAPI(...)`).

## 5. End-to-end execution flow (NIMA)
1. `train.sh` runs `python -m nima-aesthetic-photo-scorer.train --ava_csv ... --epochs 15 --batch_size 64 --backbone MobileNetV2 --val_split 0.2`.
2. `make_datasets` reads CSV (col 0 = image id, next 10 cols = vote counts 1..10), turns counts into probability distributions (`counts_to_dist`), drops missing files, splits last 20% as validation (deterministic, no shuffle before split).
3. Phase 1: freeze backbone, Adam 1e-3, `freeze_backbone_epochs=3`. Phase 2: unfreeze last 30 layers, Adam 1e-4. Callbacks: `ModelCheckpoint` (best val_loss), `EarlyStopping(patience=5)`, `ReduceLROnPlateau`, `CSVLogger`, `TerminateOnNaN`, `BackupAndRestore`.
4. Saves `.keras`, `.h5`, SavedModel (`_export_savedmodel`).
5. Optional `tflite_convert.convert` (optional quantisation) -> `nima.tflite`.
6. At serving: `POST /nima/rate` with multiple files -> per-image mean and std -> sorted descending by mean.

## 6. Technologies and why they were selected
TensorFlow/Keras (NIMA reference implementations are Keras; `keras.applications.MobileNetV2` pretrained on ImageNet); MobileNetV2 chosen as light backbone (EfficientNetB0 branch also coded in `build_nima`); TFLite for small inference; FastAPI for the router; pandas/numpy for CSV; scipy for SRCC/PLCC in `eval.py`. Teammates' parts: PyTorch/transformers CLIP & BLIP, OpenRouter LLM, SerpAPI, KeyBERT.

## 7. Important source files
`nima-aesthetic-photo-scorer/model.py` (33 lines), `loss.py` (13), `data.py` (101), `train.py` (192), `eval.py` (53), `infer.py` (57), `tflite_convert.py`, `tflite_infer.py`, `router.py` (85), `utils.py` (`dist_to_mos`), `train.sh`, `models/train_log.csv`, `README.md` "Implementation Notes and Limitations".

## 8. Main functions and modules
- `build_nima(input_shape=(224,224,3), backbone_name, dropout=0.25)`: backbone -> `GlobalAveragePooling2D` -> `Dropout` -> `Dense(10)` -> `Softmax(name="score_dist")`; returns `(model, base)` so the backbone can be frozen/unfrozen.
- `emd_loss(y_true, y_pred)`: cumulative sums along the 10 bins, squared difference summed per sample, mean over batch (squared EMD, **no square root**, so it is not exactly the paper's r=2 root form; say "squared EMD").
- `counts_to_dist`, `_build_tf_dataset` (`decode_jpeg`, resize, `mobilenet_v2.preprocess_input`, `ignore_errors()` for corrupt JPEGs), `make_datasets(limit=...)`.
- `predict_score` (infer), `evaluate` (SRCC, PLCC, mean EMD), `NIMATFLite.predict_dist/predict_mos`, `rate_images`, `_get_interpreter` singleton.
- `dist_to_mos(p)` returns (mean, std) with scores 1..10.

## 9. Data flow
CSV counts -> normalised 10-bin distribution targets -> JPEG decode -> 224x224 -> MobileNetV2 preprocessing -> network -> softmax distribution -> mean = sum(i * p_i), std = sqrt(sum p_i (i-mean)^2) -> sorted list `{"ranked": [{filename, mean, std}]}`.

## 10. Model choices and reasoning
- Predict a distribution, not one number: human ratings are subjective; std carries disagreement; EMD respects ordering of bins (cross-entropy treats 3 vs 9 like 3 vs 4).
- Transfer learning: freeze backbone first so random head gradients do not wreck pretrained features, then fine-tune last 30 layers at 10x lower LR.
- `--loss kl` option exists (`KLDivergence`) but default EMD.
- Evidence in `models/train_log.csv` (12 rows: 3 head epochs then 9 fine-tune): val_loss 0.0955 -> 0.0947 (head), best 0.0777 at fine-tune epoch 3, then rises to ~0.0897 while train loss falls to 0.0218: clear overfitting after ~epoch 3 of fine-tuning; LR halved at epochs 6 and 8. This is a *loss*, not an SRCC/PLCC. **I found no SRCC/PLCC results anywhere in the repo - do not quote any.**
- Whether the shipped weights were trained on the full AVA set or a subset/dummy set: first commit says "Basic nima model training with dummy dataset"; later ones do not say [CONFIRM].

## 11. Database design
Not applicable (no database in the repo).

## 12. APIs and contracts
`POST /nima/rate`, multipart `files: List[UploadFile]`, response `{"ranked": [{"filename": str, "mean": float, "std": float}]}` sorted by mean desc; invalid image files are silently skipped (`continue`); missing `nima.tflite` -> HTTP 500 with message. The router expects `nima-aesthetic-photo-scorer/models/nima.tflite`, which is **not in the repo** (README confirms).

## 13. Important implementation decisions
Return backbone from `build_nima` for clean freezing; pure-tf input pipeline with `ignore_errors`; deterministic validation split taken from the end of the CSV; dedicated `--limit/--steps_per_epoch` flags for quick iteration; `BackupAndRestore` for resumable training; save in several formats because Keras 2/3 differ (`model.export` vs `tf.saved_model.save`); TFLite singleton to avoid reloading.

## 14. Challenges and debugging
Visible from code/history: Keras version differences handled with try/except (mixed precision import, SavedModel export); the hyphenated folder name is not a valid Python package so relative imports fail (README notes it; commit "Removed nima photo scorer folder" by Mehul then re-added); corrupt images in AVA (hence `ignore_errors`); overfitting seen in the log. Training environment/GPU [CONFIRM].

## 15. What was actually implemented
Full train/eval/infer/TFLite-convert code and a router; trained weight files (LFS) and a training log. No tests, no CI beyond flake8 lint (`lint.yml`, by Mehul).

## 16. What was only planned
Integration of CLIP + NIMA + BLIP + song recommender into one backend; "Beautification Pipeline"; Spotify integration (old `readme.md` lists them; no code). `nima.tflite` artifact not committed.

## 17. Current limitations
- `eval.py` loops one image at a time (slow), builds paths as `f"{images_dir}/{row[img_col]}"` without `.jpg` handling that `data.py` has, so it can fail on bare ids; it `max` default 500.
- `infer.py` loads `.h5` or checkpoint dir but not `.keras`; `build_nima()` is rebuilt on checkpoint path.
- Validation split is the tail of the CSV, not random/stratified.
- Overfits; no augmentation; no reported SRCC/PLCC.
- Router fixed model path; swallowing bad files silently; no auth or size limits.
- Aesthetic score is an average opinion bias of AVA (photography-contest images), may not match social-media taste.

## 18. What should be improved
Report SRCC/PLCC on the AVA test split; add augmentation and early-stop on the right epoch; random split; fix the package name; commit or generate `nima.tflite` in CI; unit tests for `emd_loss` and `dist_to_mos`; batch evaluation; add file size/type validation in the router; integrate the other modules behind one FastAPI app.

## 19. Interview questions
1. What is NIMA and why predict a distribution?
2. Explain EMD loss and why it suits ordinal ratings. How does yours differ from the paper?
3. Why freeze the backbone first?
4. What does your training log show?
5. How do you convert to TFLite, and what changes (quantisation)?
6. How would you evaluate it properly? What metrics?
7. Why MobileNetV2?
8. What did your teammate build and how did you integrate?
9. What are the limitations of using AVA scores for social-media photos?
10. How does the `/nima/rate` endpoint handle errors?

## 20. Suggested answers based on the actual code
- NIMA: "A MobileNetV2 with a 10-way softmax head predicting the histogram of 1-10 human ratings. Mean of the histogram is the score; std shows disagreement. `utils.dist_to_mos` and `NIMATFLite.predict_mos` compute them."
- EMD: "In `loss.py` I take cumulative sums of both distributions and average the squared CDF differences per sample, so mistakes far from the true bin cost more than near ones. I didn't take the square root as in the paper's r=2 form, so I'd call it squared EMD."
- Freezing: "`train.py` trains the head for 3 epochs at 1e-3 with the backbone frozen, then unfreezes the last 30 layers at 1e-4."
- Log: "val_loss improved from about 0.095 to about 0.078 in fine-tuning, then rose to about 0.09 while train loss kept dropping, so it overfit; I should have trusted the best-val checkpoint, which `ModelCheckpoint` saves." Do not claim an SRCC.
- TFLite: "`tflite_convert.convert` loads the Keras model and uses `TFLiteConverter`, optional `Optimize.DEFAULT` and a representative dataset generator; the router loads it with `tf.lite.Interpreter`." The produced `.tflite` is not committed.
- Evaluation: "`eval.py` computes SRCC, PLCC and mean EMD on a CSV; I haven't got recorded numbers in the repo." [CONFIRM if you have run it]
- Team: "Mehul wrote CLIP pose recommender, BLIP captioning and song recommender; the repo README says they are independent, so end-to-end integration was not completed."
- Dataset: be explicit about which data the committed weights saw [CONFIRM].
