from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import shap

from ml.explainability.model_loader import loader


BASE_DIR = Path(__file__).resolve().parent.parent

DATA = BASE_DIR / "data" / "synthetic" / "ml_features.csv"

OUTPUT = Path(__file__).resolve().parent / "outputs"
OUTPUT.mkdir(exist_ok=True)


class GlobalExplainer:

    def __init__(self):

        self.df = pd.read_csv(DATA)

    def prepare(self):

        df = self.df.copy()

        drop_columns = [

            "risk_level",
            "risk_score",
            "overall_health_index",
            "clinical_index",
            "polypharmacy_index",
            "pharmacogenomic_index",
            "lifestyle_index"

        ]

        X = df.drop(columns=drop_columns)

        # ⭐ Sample only 300 patients
        X = X.sample(
            n=300,
            random_state=42
        ).reset_index(drop=True)

        X_processed = loader.preprocessor.transform(X)

        feature_names = loader.preprocessor.get_feature_names_out()

        return X_processed, feature_names

    def explain(self):

        X, names = self.prepare()

        explainer = shap.TreeExplainer(
            loader.model
        )

        print("Calculating SHAP values...")

        shap_values = explainer.shap_values(X)

        print("Creating Summary Plot...")

        plt.figure(figsize=(12,8))

        shap.summary_plot(

            shap_values,

            X,

            feature_names=names,

            show=False

        )

        plt.tight_layout()

        plt.savefig(

            OUTPUT / "summary_plot.png",

            dpi=300

        )

        plt.close()

        print("✓ summary_plot.png")

        print("Creating Bar Plot...")

        plt.figure(figsize=(12,8))

        shap.summary_plot(

            shap_values,

            X,

            feature_names=names,

            plot_type="bar",

            show=False

        )

        plt.tight_layout()

        plt.savefig(

            OUTPUT / "bar_plot.png",

            dpi=300

        )

        plt.close()

        print("✓ bar_plot.png")


explainer = GlobalExplainer()

if __name__ == "__main__":

    explainer.explain()