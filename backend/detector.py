from ultralytics import YOLO
import cv2
import numpy as np
from pathlib import Path
import uuid

MODEL_PATH = Path(__file__).parent / "models" / "best.pt"
model = YOLO(str(MODEL_PATH))

CONFIDENCE_THRESHOLD = 0.4

# CLASS SWAP: The model's labels are inverted, swap them
CLASS_MAPPING = {
    0: "smoke",  # Model labels this as "Fire" but it's actually smoke
    1: "fire",   # Model labels this as "Smoke" but it's actually fire
}

UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


def detect_fire_smoke(image_path: str):
    """Run YOLOv8 inference on an image and return detection results."""
    results = model(image_path, conf=CONFIDENCE_THRESHOLD, verbose=False)
    result = results[0]

    img = cv2.imread(image_path)
    if img is None:
        return {
            "detected": False,
            "class": "error",
            "confidence": 0.0,
            "annotated_image_url": None,
            "detections": [],
        }

    # DEBUG: dump raw model class map once per call
    print("=" * 50)
    print(f"DEBUG: Model class names: {model.names}")

    detections = []
    if result.boxes is not None and len(result.boxes) > 0:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            conf  = float(box.conf[0])

            class_name = CLASS_MAPPING.get(cls_id, "unknown")

            print(f"DEBUG: Detection -> cls_id={cls_id}, mapped='{class_name}', confidence={conf:.2f}")

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            detections.append({
                "class": class_name,
                "confidence": round(conf, 3),
                "bbox": [x1, y1, x2, y2],
            })

            if class_name == "fire":
                color      = (0, 0, 255)       # red in BGR
                text_color = (255, 255, 255)
            elif class_name == "smoke":
                color      = (180, 180, 180)   # gray in BGR
                text_color = (255, 255, 255)
            else:
                color      = (0, 255, 0)       # green
                text_color = (0, 0, 0)

            cv2.rectangle(img, (x1, y1), (x2, y2), color, 3)

            label = f"{class_name.upper()} {conf:.0%}"
            (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
            cv2.rectangle(img, (x1, y1 - text_h - 10), (x1 + text_w + 10, y1), color, -1)
            cv2.putText(img, label, (x1 + 5, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.7, text_color, 2)

    print("=" * 50)

    if detections:
        fire_detections  = [d for d in detections if d["class"] == "fire"]
        smoke_detections = [d for d in detections if d["class"] == "smoke"]

        if fire_detections:
            fire_detections.sort(key=lambda d: d["confidence"], reverse=True)
            top = fire_detections[0]
        elif smoke_detections:
            smoke_detections.sort(key=lambda d: d["confidence"], reverse=True)
            top = smoke_detections[0]
        else:
            top = detections[0]

        detected_class = top["class"]
        top_confidence = top["confidence"]
        detected = True
    else:
        detected_class = "safe"
        top_confidence = 0.95
        detected = False

    output_filename = f"result_{uuid.uuid4().hex[:8]}.jpg"
    output_path = UPLOADS_DIR / output_filename
    cv2.imwrite(str(output_path), img)

    return {
        "detected": detected,
        "class": detected_class,
        "confidence": top_confidence,
        "annotated_image_url": f"/uploads/{output_filename}",
        "detections": detections,
    }
