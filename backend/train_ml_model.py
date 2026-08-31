import os
import json
import joblib
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

from app.database import SessionLocal
from app.services.threat_ml_service import (
    get_training_data,
    FEATURE_NAMES,
    MODEL_DIR,
    MODEL_PATH,
    ENCODER_PATH
)


RESULTS_PATH = os.path.join(
    "models",
    "ml_results.json"
)


def evaluate_model():

    db = SessionLocal()

    try:

        X, y = get_training_data(db)

    finally:

        db.close()

    if len(X) < 10:

        raise ValueError(
            "At least 10 labelled missions are required."
        )

    unique_classes, class_counts = np.unique(
        y,
        return_counts=True
    )

    print("\n========================================")
    print("THREAT CLASS DISTRIBUTION")
    print("========================================")

    for class_name, count in zip(
        unique_classes,
        class_counts
    ):
        print(f"{class_name}: {count}")

    print(f"TOTAL: {len(y)}")

    if np.min(class_counts) < 2:

        raise ValueError(
            "Each threat class must contain at least "
            "2 missions for stratified evaluation."
        )

    label_encoder = LabelEncoder()

    y_encoded = label_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.25,
        random_state=42,
        stratify=y_encoded
    )

    print("\n========================================")
    print("TRAIN / TEST SPLIT")
    print("========================================")

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples : {len(X_test)}")

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

    class_names = label_encoder.classes_

    matrix = confusion_matrix(
        y_test,
        y_pred,
        labels=np.arange(
            len(class_names)
        )
    )

    report = classification_report(
        y_test,
        y_pred,
        labels=np.arange(
            len(class_names)
        ),
        target_names=class_names,
        output_dict=True,
        zero_division=0
    )

    print("\n========================================")
    print("MODEL EVALUATION")
    print("========================================")

    print(
        f"Accuracy  : {accuracy * 100:.2f}%"
    )

    print(
        f"Precision : {precision * 100:.2f}%"
    )

    print(
        f"Recall    : {recall * 100:.2f}%"
    )

    print(
        f"F1 Score  : {f1 * 100:.2f}%"
    )

    print("\n========================================")
    print("CLASSIFICATION REPORT")
    print("========================================")

    print(
        classification_report(
            y_test,
            y_pred,
            labels=np.arange(
                len(class_names)
            ),
            target_names=class_names,
            zero_division=0
        )
    )

    print("========================================")
    print("CONFUSION MATRIX")
    print("========================================")

    print(matrix)

    print("\n========================================")
    print("FEATURE IMPORTANCE")
    print("========================================")

    feature_importance = {}

    for feature, importance in zip(
        FEATURE_NAMES,
        model.feature_importances_
    ):

        feature_importance[feature] = round(
            float(importance),
            6
        )

        print(
            f"{feature}: "
            f"{importance:.4f}"
        )

    os.makedirs(
        "models",
        exist_ok=True
    )

    evaluation_results = {

        "available": True,

        "model": "RandomForestClassifier",

        "samples": int(len(X)),

        "training_samples": int(
            len(X_train)
        ),

        "testing_samples": int(
            len(X_test)
        ),

        "classes": class_names.tolist(),

        "class_distribution": {
            class_name: int(count)
            for class_name, count in zip(
                unique_classes,
                class_counts
            )
        },

        "metrics": {

            "accuracy": round(
                float(accuracy),
                4
            ),

            "precision": round(
                float(precision),
                4
            ),

            "recall": round(
                float(recall),
                4
            ),

            "f1_score": round(
                float(f1),
                4
            )
        },

        "confusion_matrix": matrix.tolist(),

        "classification_report": report,

        "feature_importance":
            feature_importance,

        "features": FEATURE_NAMES
    }

    with open(
        RESULTS_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            evaluation_results,
            file,
            indent=4
        )

    print("\n========================================")
    print("EVALUATION RESULTS SAVED")
    print("========================================")

    print(
        f"Saved to: {RESULTS_PATH}"
    )

    X_full = X
    y_full = y_encoded

    final_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=8,
        random_state=42,
        class_weight="balanced"
    )

    final_model.fit(
        X_full,
        y_full
    )

    joblib.dump(
        final_model,
        MODEL_PATH
    )

    joblib.dump(
        label_encoder,
        ENCODER_PATH
    )

    print("\n========================================")
    print("FINAL MODEL SAVED")
    print("========================================")

    print(
        f"Model   : {MODEL_PATH}"
    )

    print(
        f"Encoder : {ENCODER_PATH}"
    )

    return evaluation_results


if __name__ == "__main__":

    try:

        evaluate_model()

        print("\n========================================")
        print("THREAT ML MODEL EVALUATION COMPLETE")
        print("========================================")

    except Exception as error:

        print("\n========================================")
        print("THREAT ML MODEL EVALUATION FAILED")
        print("========================================")

        print(error)