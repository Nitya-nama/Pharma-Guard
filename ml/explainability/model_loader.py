from pathlib import Path

import joblib


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models"


class ModelLoader:

    def __init__(self):

        self.model = joblib.load(
            MODEL_DIR / "xgboost.pkl"
        )

        self.preprocessor = joblib.load(
            MODEL_DIR / "preprocessor.pkl"
        )

        self.label_encoder = joblib.load(
            MODEL_DIR / "label_encoder.pkl"
        )


loader = ModelLoader()