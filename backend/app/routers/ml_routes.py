from fastapi import APIRouter
from pathlib import Path
import json

router = APIRouter()

MODEL_RESULTS_PATH = Path("models/ml_results.json")


@router.get("/performance")
def get_model_performance():

    if not MODEL_RESULTS_PATH.exists():

        return {
            "available": False,
            "message": "ML model evaluation results are not available yet."
        }

    try:

        with open(
            MODEL_RESULTS_PATH,
            "r",
            encoding="utf-8"
        ) as file:

            results = json.load(file)

        return {
            "available": True,
            "results": results
        }

    except Exception as error:

        return {
            "available": False,
            "message": str(error)
        }