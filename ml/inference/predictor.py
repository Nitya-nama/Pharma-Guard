from pathlib import Path

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models"


class PharmaGuardPredictor:

    def __init__(self):

        self.model = joblib.load(
            MODEL_DIR / "xgboost.pkl"
        )

        self.preprocessor = joblib.load(
            MODEL_DIR / "preprocessor.pkl"
        )

        self.encoder = joblib.load(
            MODEL_DIR / "label_encoder.pkl"
        )

    def predict(self, patient):

        df = pd.DataFrame([patient])

        X = self.preprocessor.transform(df)

        prediction = self.model.predict(X)[0]

        probabilities = self.model.predict_proba(X)[0]

        risk = self.encoder.inverse_transform(
            [prediction]
        )[0]

        probability_dict = {}

        for label, probability in zip(

            self.encoder.classes_,

            probabilities

        ):

            probability_dict[label] = round(

                float(probability),

                4

            )

        confidence = max(

            probability_dict.values()

        )

        return {

            "risk_level": risk,

            "confidence": confidence,

            "probabilities": probability_dict

        }


predictor = PharmaGuardPredictor()

if __name__ == "__main__":

    sample = {

        "age": 67,
        "gender": "Male",
        "ethnicity": "Asian",
        "height_cm": 170,
        "weight_kg": 82,
        "bmi": 28.4,
        "smoking_status": "Former",
        "alcohol_consumption": "Occasional",
        "physical_activity": "Low",
        "diabetes": True,
        "hypertension": True,
        "kidney_disease": True,
        "liver_disease": False,
        "heart_disease": True,
        "disease_count": 4,
        "drug_count": 5,
        "gene_count": 6,
        "variant_count": 6,
        "primary_gene": "CYP2C19",
        "primary_variant": "CYP2C19*2",
        "primary_phenotype": "Poor Metabolizer",
        "primary_evidence": "1A",
        "multimorbidity": 1,
        "high_risk_disease": 2,
        "strong_pgx": 1
    }

    result = predictor.predict(sample)

    print()

    print(result)