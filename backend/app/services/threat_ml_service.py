import os
import re
import joblib
import numpy as np

from sqlalchemy.orm import Session
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

try:
    import shap
except ImportError:
    shap = None


MODEL_DIR = "ml_models"
MODEL_PATH = os.path.join(
    MODEL_DIR,
    "threat_classifier.joblib"
)

ENCODER_PATH = os.path.join(
    MODEL_DIR,
    "threat_label_encoder.joblib"
)


FEATURE_NAMES = [
    "threat_score",
    "ai_confidence",
    "object_count",
    "average_detection_confidence",
    "maximum_detection_confidence",
    "priority_score"
]


PRIORITY_MAP = {
    "LOW": 0.25,
    "MEDIUM": 0.50,
    "HIGH": 0.75,
    "CRITICAL": 1.00,

    "ROUTINE": 0.25,
    "MONITOR": 0.50,
    "HIGH ALERT": 0.75,
    "EMERGENCY": 1.00,

    "URGENT": 1.00,
    "STANDBY": 0.00,
    "UNKNOWN": 0.00
}


def parse_detected_objects(value):
    if not value:
        return []

    text = str(value)

    matches = re.findall(
        r"\((\d+)%\)",
        text
    )

    confidences = [
        int(match) / 100
        for match in matches
    ]

    object_names = [
        item.split("(")[0].strip()
        for item in text.split(",")
        if item.strip()
    ]

    return object_names, confidences


def mission_to_features(mission):
    object_data = parse_detected_objects(
        mission.detected_objects
    )

    if isinstance(object_data, tuple):
        objects, confidences = object_data
    else:
        objects = []
        confidences = []

    object_count = len(objects)

    if confidences:
        average_confidence = float(
            np.mean(confidences)
        )

        maximum_confidence = float(
            np.max(confidences)
        )
    else:
        average_confidence = 0.0
        maximum_confidence = 0.0

    priority = str(
        mission.priority or "UNKNOWN"
    ).upper()

    priority_score = PRIORITY_MAP.get(
        priority,
        0.0
    )

    return [
        float(mission.threat_score or 0),
        float(mission.confidence or 0) / 100,
        float(object_count),
        average_confidence,
        maximum_confidence,
        priority_score
    ]


def get_training_data(db: Session):
    from app.models import Mission

    missions = (
        db.query(Mission)
        .filter(
            Mission.threat_level.isnot(None)
        )
        .all()
    )

    X = []
    y = []

    for mission in missions:

        threat_level = str(
            mission.threat_level or ""
        ).strip().upper()

        if threat_level not in {
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL"
        }:
            continue

        X.append(
            mission_to_features(mission)
        )

        y.append(threat_level)

    return np.array(X), np.array(y)

def train_threat_model(db: Session):
    os.makedirs(
        MODEL_DIR,
        exist_ok=True
    )

    X, y = get_training_data(db)

    if len(X) < 10:
        raise ValueError(
            "At least 10 labelled missions are required "
            "to evaluate the threat ML model."
        )

    label_encoder = LabelEncoder()

    y_encoded = label_encoder.fit_transform(y)

    if len(label_encoder.classes_) < 2:
        raise ValueError(
            "The training data must contain at least "
            "two different threat levels."
        )

    class_counts = np.bincount(y_encoded)

    if np.min(class_counts) < 2:
        raise ValueError(
            "Each threat class must contain at least "
            "2 missions for stratified evaluation."
        )

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.20,
        random_state=42,
        stratify=y_encoded
    )

    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=8,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(
        X_train,
        y_train
    )

    y_pred = model.predict(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        y_pred
    )

    precision = precision_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    matrix = confusion_matrix(
        y_test,
        y_pred
    )

    report = classification_report(
        y_test,
        y_pred,
        target_names=label_encoder.classes_,
        output_dict=True,
        zero_division=0
    )

    joblib.dump(
        model,
        MODEL_PATH
    )

    joblib.dump(
        label_encoder,
        ENCODER_PATH
    )

    results = {
        "available": True,
        "model": "Random Forest Classifier",
        "algorithm": "RandomForestClassifier",
        "samples": int(len(X)),
        "training_samples": int(len(X_train)),
        "testing_samples": int(len(X_test)),
        "features": FEATURE_NAMES,
        "classes": label_encoder.classes_.tolist(),
        "metrics": {
            "accuracy": round(float(accuracy) * 100, 2),
            "precision": round(float(precision) * 100, 2),
            "recall": round(float(recall) * 100, 2),
            "f1_score": round(float(f1) * 100, 2)
        },
        "confusion_matrix": matrix.tolist(),
        "classification_report": report
    }

    results_path = os.path.join(
        "models",
        "ml_results.json"
    )

    os.makedirs(
        "models",
        exist_ok=True
    )

    with open(
        results_path,
        "w",
        encoding="utf-8"
    ) as file:

        import json

        json.dump(
            results,
            file,
            indent=4
        )

    return results


def load_model():
    if not os.path.exists(MODEL_PATH):
        return None, None

    if not os.path.exists(ENCODER_PATH):
        return None, None

    model = joblib.load(
        MODEL_PATH
    )

    label_encoder = joblib.load(
        ENCODER_PATH
    )

    return model, label_encoder


def explain_mission(mission):
    model, label_encoder = load_model()

    if model is None:
        raise ValueError(
            "Threat ML model has not been trained yet."
        )

    features = mission_to_features(
        mission
    )

    X = np.array(
        [features],
        dtype=float
    )

    probabilities = model.predict_proba(
        X
    )[0]

    prediction_index = int(
        np.argmax(probabilities)
    )

    prediction = label_encoder.inverse_transform(
        [prediction_index]
    )[0]

    model_confidence = float(
        probabilities[prediction_index]
    ) * 100

    contributions = []

    if shap is not None:

        explainer = shap.TreeExplainer(
            model
        )

        shap_values = explainer.shap_values(
            X
        )

        if isinstance(shap_values, list):

            class_index = prediction_index

            values = np.asarray(
                shap_values[class_index]
            )

        else:

            values = np.asarray(
                shap_values
            )

            if values.ndim == 3:
                values = values[
                    0,
                    :,
                    prediction_index
                ]

        values = np.asarray(
            values
        ).reshape(-1)

        for index, value in enumerate(values):

            contributions.append({
                "feature": FEATURE_NAMES[index],
                "value": round(
                    float(features[index]),
                    4
                ),
                "impact": round(
                    float(value),
                    6
                )
            })

        contributions.sort(
            key=lambda item: abs(
                item["impact"]
            ),
            reverse=True
        )

    return {
        "prediction": prediction,
        "confidence": round(
            model_confidence,
            2
        ),
        "features": {
            FEATURE_NAMES[index]:
                round(
                    float(features[index]),
                    4
                )
            for index in range(
                len(FEATURE_NAMES)
            )
        },
        "contributions": contributions,
        "model": "RandomForest + SHAP"
    }

if __name__ == "__main__":
    from app.database import SessionLocal
    import json

    db = SessionLocal()

    try:
        results = train_threat_model(db)

        print("\n" + "=" * 60)
        print("ML MODEL TRAINING AND EVALUATION")
        print("=" * 60)

        print(json.dumps(results, indent=4))

        print("\nML evaluation completed successfully.")
        print("Results saved to: models/ml_results.json")

    except Exception as error:
        print("\nML TRAINING ERROR:")
        print(error)

    finally:
        db.close()