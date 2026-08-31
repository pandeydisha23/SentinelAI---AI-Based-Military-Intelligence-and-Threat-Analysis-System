from pydantic import BaseModel


class FirePredictionResponse(BaseModel):
    prediction: str
    confidence: float