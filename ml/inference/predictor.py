from pathlib import Path
from typing import Dict, Any

import joblib
import pandas as pd

from ml.training.config import FEATURE_COLUMNS


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

    # -----------------------------------------------------
    # Prepare Input
    # -----------------------------------------------------

    def prepare_input(
        self,
        patient: Dict[str, Any]
    ):

        df = pd.DataFrame([patient])

        # Keep only training columns
        df = df.reindex(
            columns=FEATURE_COLUMNS,
            fill_value=0
        )

        return self.preprocessor.transform(df)

    # -----------------------------------------------------
    # Predict
    # -----------------------------------------------------

    def predict(
        self,
        patient: Dict[str, Any]
    ):

        X = self.prepare_input(patient)

        prediction = self.model.predict(X)[0]

        probabilities = self.model.predict_proba(X)[0]

        risk_level = self.encoder.inverse_transform(
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

        confidence = round(

            max(probability_dict.values()),

            4

        )

        return {

            "risk_level": risk_level,

            "confidence": confidence,

            "probabilities": probability_dict

        }
        
    def predict_batch(self, patients):

        results = []

        for patient in patients:

            results.append(

                self.predict(patient)

            )

        return results
    
    def model_info(self):

        return {

            "model_name": "XGBoost",

            "version": "1.0",

            "classes": list(

                self.encoder.classes_

            ),

            "feature_count": len(

                FEATURE_COLUMNS

            )

        }
        
    def health_check(self):

        return {

            "status": "healthy",

            "model_loaded": self.model is not None,

            "preprocessor_loaded": self.preprocessor is not None,

            "label_encoder_loaded": self.encoder is not None

        }    
    
    

    


predictor = PharmaGuardPredictor()

if __name__ == "__main__":

    sample_patient = {

        "age": 67,
        "gender": "Male",
        "ethnicity": "Asian",

        "height_cm": 171,
        "weight_kg": 81,
        "bmi": 27.7,

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

        "gene_count": 5,
        "variant_count": 5,

        "primary_gene": "CYP2C19",
        "primary_variant": "CYP2C19*2",
        "primary_phenotype": "Poor Metabolizer",
        "primary_evidence": "1A",

        "multimorbidity": 1,
        "high_risk_disease": 2,
        "strong_pgx": 1

    }

    result = predictor.predict(
        sample_patient
    )

    print()

    print("=" * 60)
    print("Prediction")
    print("=" * 60)
    print()

    print(result)