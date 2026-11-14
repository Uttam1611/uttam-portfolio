# Aircraft damage classification and BLIP captioning

**Authorship needs confirmation.** The repository (https://github.com/Uttam1611/Aircraft-Damage-Detection-and-BLIP-Captioning) has one commit by Uttam ('Initial commit - Full project code', 2026-03-28), but its README's clone URL points to `buildwithmehul/...`, another GitHub account. It says the work is 'my Final Project' for the IBM course *Introduction to Deep Learning & Neural Networks with Keras*. Decide with your collaborator who wrote the notebook before you describe it as yours. The README's accuracy figures (> 81% test) were **not re-run**.

## 1. Project overview

A Jupyter notebook with two parts: a VGG16 transfer-learning classifier that separates aircraft damage into crack versus dent, and a BLIP image-captioning demo.

## 2. Problem statement

Classify the type of damage in aircraft images (crack or dent) and generate captions for unseen images.

## 3. Why the project was built

Final project of an IBM Keras course (README). Also exercises computer vision and vision-language models together.

## 4. System architecture

Single notebook `Damage_Detection_and_BLIP_Captioning.ipynb` (75 cells). `download_dataset.py` downloads and extracts a course-hosted tar file into `aircraft_damage_dataset_v1/{train,valid,test}/{crack,dent}`.

## 5. End-to-end execution flow

Download dataset -> build `ImageDataGenerator` pipelines -> build VGG16-based model -> train with callbacks -> evaluate on the test generator -> plot results -> load BLIP and caption images.

## 6. Technologies and why they were selected

TensorFlow/Keras (VGG16, `ImageDataGenerator`, callbacks); PyTorch + `transformers` for BLIP; matplotlib. Pinned in notebook install cells (tensorflow 2.17.1, transformers 4.38.2).

## 7. Important source files

`Damage_Detection_and_BLIP_Captioning.ipynb`, `download_dataset.py`, `requirements.txt`, `README.md`.

## 8. Main functions and modules

Notebook cells only: generators (`train_datagen`, `valid_datagen`, `test_datagen`), model build, `callbacks` list, training call, plotting, BLIP processor and model.

## 9. Data flow

Images (224x224, rescaled) -> augmentation on train only -> VGG16 convolutional base -> dense head -> sigmoid probability -> class. Captioning path: image -> BLIP processor -> generated text.

## 10. Model choices and reasoning (where applicable)

VGG16 pretrained on ImageNet with the base frozen, then the last 8 layers unfrozen at learning rate 1e-5 (fine-tuning cell). Head: Dense 512, Dropout 0.3, Dense 512, Dropout 0.3, Dense 1 sigmoid, binary cross-entropy. Reasoning: a small dataset favours transfer learning; a low rate protects pretrained weights. Callbacks: `EarlyStopping` (patience 5, restore best), `ReduceLROnPlateau`, `ModelCheckpoint` on `val_accuracy`. Augmentation: rotation, shifts, shear, zoom, flip, brightness.

## 11. Database design (where applicable)

Not applicable.

## 12. APIs and contracts (where applicable)

Not applicable.

## 13. Important implementation decisions

Binary labels via `class_mode='binary'`; validation and test generators use `shuffle=False` so predictions align with labels; fixed seed 42.

## 14. Challenges and debugging

The notebook contains an early model with a softmax head that is later replaced by the sigmoid model. Explain which cells produce the reported result. Run the notebook yourself to confirm the reported accuracy. [CONFIRM]

## 15. What was actually implemented

Classifier, training with callbacks, evaluation, BLIP captioning (README, notebook).

## 16. What was only planned

Nothing documented as planned.

## 17. Current limitations

Crack versus dent only (not damaged versus normal); overall accuracy only, no per-class metrics; one dataset; BLIP judged qualitatively; one example caption may not match its image; notebook-only, not a service.

## 18. What should be improved

Per-class precision and recall and a confusion matrix; clean the notebook so only the final model remains; add a small inference script; evaluate captions with a defined method.

## 19. Interview questions

- Why freeze the base first?
- What does fine-tuning the last 8 layers change?
- Why is accuracy alone not enough?
- Why `shuffle=False` for evaluation?
- What is BLIP and how does it differ from your classifier?
- Who built this and what was your part?

## 20. Suggested answers based on the actual code

- Answer from the notebook cells above. For results, quote the README as 'reported' and say you would re-run before relying on it.
- For the authorship question, answer only after you have confirmed it with your collaborator. [CONFIRM]
