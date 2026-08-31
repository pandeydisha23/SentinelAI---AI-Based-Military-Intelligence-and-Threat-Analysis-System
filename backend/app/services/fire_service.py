from ultralytics import YOLO
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "yolov8n.pt")

model = YOLO(MODEL_PATH)


def detect_objects(image_path):

    results = model(image_path)

    detections = []

    result = results[0]

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    original_name = os.path.basename(image_path)
    output_name = f"detected_{original_name}"

    output_path = os.path.join(OUTPUT_DIR, output_name)

    result.save(filename=output_path)

    CONFIDENCE_THRESHOLD = 0.50

    for box in result.boxes:

        confidence = float(box.conf)

        if confidence < CONFIDENCE_THRESHOLD:
            continue

        class_id = int(box.cls)
        class_name = model.names[class_id]

        detections.append({
            "object": class_name,
            "confidence": round(confidence, 2)
    })

    return {
    "detections": detections,
    "output_image": f"/outputs/{output_name}"
}