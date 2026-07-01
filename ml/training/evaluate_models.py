from pathlib import Path
import time

import joblib
import pandas as pd

from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
)

from ml.training.preprocessing import preprocessor


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


class ModelEvaluator:

    def __init__(self):

        (
            self.transformer,
            self.X_train,
            self.X_test,
            self.y_train,
            self.y_test

        ) = preprocessor.prepare()

        self.X_test = self.transformer.transform(
            self.X_test
        )

        self.label_encoder = joblib.load(
            MODEL_DIR / "label_encoder.pkl"
        )

    def evaluate(self, model_name, filename):

        model = joblib.load(
            MODEL_DIR / filename
        )

        start = time.perf_counter()

        predictions = model.predict(
            self.X_test
        )

        inference_time = (
            time.perf_counter() - start
        )

        accuracy = accuracy_score(
            self.y_test,
            predictions
        )

        precision, recall, f1, _ = precision_recall_fscore_support(

            self.y_test,

            predictions,

            average="weighted"

        )

        return {

            "Model": model_name,
            "Accuracy": round(accuracy, 4),
            "Precision": round(precision, 4),
            "Recall": round(recall, 4),
            "F1 Score": round(f1, 4),
            "Prediction Time (s)": round(inference_time, 4)

        }

    def run(self):

        results = []

        results.append(

            self.evaluate(

                "Random Forest",

                "random_forest.pkl"

            )

        )

        results.append(

            self.evaluate(

                "XGBoost",

                "xgboost.pkl"

            )

        )

        results = pd.DataFrame(
            results
        )

        print()

        print("=" * 70)
        print("MODEL COMPARISON")
        print("=" * 70)

        print()

        print(results)

        output = MODEL_DIR / "model_comparison.csv"

        results.to_csv(

            output,

            index=False

        )

        print()

        print("Saved to")

        print(output)
