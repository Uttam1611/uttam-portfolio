"""Prepare photos for publication: blur everyone except the owner and remove location overlays.

Originals live in private-originals/ (not served). Processed copies are written to public/images/personal/.
Boxes are [x, y, width, height] in original pixel coordinates, found with a Haar face detector and checked by eye.
"keep" lists the person who is the site owner and must stay clear. Change this file and re-run if one is wrong:
    python3 scripts/privacy-process.py
Requires: opencv-python (cv2), numpy.
"""
import cv2, numpy as np, os

SRC = os.path.join(os.path.dirname(__file__), "..", "private-originals")
DST = os.path.join(os.path.dirname(__file__), "..", "public", "images", "personal")

# file -> (blur boxes, extra manual regions, crop_bottom_to_y or None)
CONFIG = {
    "cu-mohali-hackathon.png": ([[670, 519, 72, 72], [236, 553, 75, 75]], [], None),  # owner: middle (473,535)
    "hackathon-dress.png": ([[670, 519, 72, 72], [236, 553, 75, 75]], [], None),      # owner: middle (473,535)
    "certificate_ncu.png": ([[853, 174, 72, 72], [345, 212, 58, 58], [680, 210, 63, 63]], [], None),  # owner: (492,145)
    "drdo1.jpeg": ([[794, 251, 67, 67], [382, 254, 80, 80], [1005, 271, 64, 64], [586, 292, 79, 79]], [], 595),  # owner: (1191,172)
    "drdo2.jpeg": ([[584, 712, 46, 46], [541, 756, 33, 33], [348, 760, 34, 34], [282, 774, 38, 38], [187, 780, 34, 34]], [], 1265),  # owner: (684,668)
    "iitr-hackathon.jpeg": ([[b[0], b[1], b[2], b[3]] for b in [[1083,457,46,46],[834,478,48,48],[1002,484,51,51],[914,496,48,48],[649,471,52,52],[519,474,56,56],[752,487,46,46],[806,725,54,54],[887,728,54,54],[702,721,63,63],[1017,735,62,62]]], [], None),  # owner: (382,420)
    "cu-lucknow.jpeg": ([], [[250, 70, 300, 280], [0, 90, 1000, 310]], None),  # owner: right (1129,113)
}

def blur_region(img, x, y, w, h, grow=1.7, strength=0.9):
    cx, cy = x + w / 2, y + h / 2 - h * 0.08
    rw, rh = w * grow / 2, h * grow * 1.1 / 2
    x0, x1 = int(max(0, cx - rw)), int(min(img.shape[1], cx + rw))
    y0, y1 = int(max(0, cy - rh)), int(min(img.shape[0], cy + rh))
    roi = img[y0:y1, x0:x1]
    k = int(max(15, (x1 - x0) * strength)) | 1
    small = cv2.resize(roi, (max(3, (x1 - x0) // 14), max(3, (y1 - y0) // 14)), interpolation=cv2.INTER_AREA)
    blurred = cv2.GaussianBlur(cv2.resize(small, (x1 - x0, y1 - y0), interpolation=cv2.INTER_LINEAR), (k, k), 0)
    mask = np.zeros(roi.shape[:2], np.float32)
    cv2.ellipse(mask, ((x1 - x0) // 2, (y1 - y0) // 2), ((x1 - x0) // 2 - 1, (y1 - y0) // 2 - 1), 0, 0, 360, 1, -1)
    mask = cv2.GaussianBlur(mask, (21, 21), 0)[..., None]
    img[y0:y1, x0:x1] = (blurred * mask + roi * (1 - mask)).astype(np.uint8)

def blur_rect(img, x, y, w, h):
    """Feathered blur of a rectangular region (used for out-of-focus crowds)."""
    roi = img[y:y + h, x:x + w]
    small = cv2.resize(roi, (max(3, w // 18), max(3, h // 18)), interpolation=cv2.INTER_AREA)
    blurred = cv2.GaussianBlur(cv2.resize(small, (w, h), interpolation=cv2.INTER_LINEAR), (61, 61), 0)
    mask = np.zeros((h, w), np.float32)
    mask[int(h*0.08):int(h*0.92), int(w*0.04):int(w*0.96)] = 1
    mask = cv2.GaussianBlur(mask, (61, 61), 0)[..., None]
    img[y:y + h, x:x + w] = (blurred * mask + roi * (1 - mask)).astype(np.uint8)

for name, (boxes, rects, crop) in CONFIG.items():
    img = cv2.imread(os.path.join(SRC, name))
    for (x, y, w, h) in boxes:
        blur_region(img, x, y, w, h)
    for (x, y, w, h) in rects:
        blur_rect(img, x, y, w, h)
    if crop:
        img = img[:crop]
    out = os.path.join(DST, name)
    cv2.imwrite(out, img, [cv2.IMWRITE_JPEG_QUALITY, 90] if name.lower().endswith(("jpg", "jpeg")) else [])
    print(name, img.shape[:2])
