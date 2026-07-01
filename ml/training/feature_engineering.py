from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent

DATASET = (
    BASE_DIR
    / "data"
    / "synthetic"
    / "ml_training_dataset.csv"
)


class FeatureEngineer:

    def __init__(self):

        self.df = pd.read_csv(DATASET)

    # ---------------------------------------------------------
    # Helper Functions
    # ---------------------------------------------------------

    @staticmethod
    def age_group(age):

        if age < 30:
            return "18-29"

        elif age < 45:
            return "30-44"

        elif age < 60:
            return "45-59"

        return "60+"

    @staticmethod
    def bmi_category(bmi):

        if bmi < 18.5:
            return "Underweight"

        elif bmi < 25:
            return "Normal"

        elif bmi < 30:
            return "Overweight"

        return "Obese"

    @staticmethod
    def normalize(series):

        maximum = max(series.max(), 1)

        return (series / maximum).round(2)

    # ---------------------------------------------------------
    # Feature Engineering
    # ---------------------------------------------------------

    def build(self):

        df = self.df.copy()

        # =====================================================
        # Demographic Features
        # =====================================================

        df["age_group"] = df["age"].apply(
            self.age_group
        )

        df["bmi_category"] = df["bmi"].apply(
            self.bmi_category
        )

        # =====================================================
        # Disease Features
        # =====================================================

        df["high_risk_disease"] = (

            df["heart_disease"].astype(int)

            +

            df["kidney_disease"].astype(int)

        )

        df["multimorbidity"] = (

            df["disease_count"] >= 2

        ).astype(int)

        # =====================================================
        # Lifestyle Features
        # =====================================================

        df["lifestyle_index"] = self.normalize(

            df["lifestyle_score"]

        )

        # =====================================================
        # Clinical Features
        # =====================================================

        df["clinical_index"] = self.normalize(

            df["clinical_score"]

        )

        # =====================================================
        # Drug Features
        # =====================================================

        df["polypharmacy_index"] = self.normalize(

            df["drug_burden_score"]

        )

        # =====================================================
        # Pharmacogenomic Features
        # =====================================================

        df["pharmacogenomic_index"] = self.normalize(

            df["genetic_score"]

        )

        df["strong_pgx"] = (

            df["primary_evidence"]

            .isin(

                ["1A", "1B"]

            )

        ).astype(int)

        # =====================================================
        # Overall Health
        # =====================================================

        max_risk = max(

            df["risk_score"].max(),

            1

        )

        df["overall_health_index"] = (

            100

            *

            (

                1

                -

                (

                    df["risk_score"]

                    /

                    max_risk

                )

            )

        ).clip(

            lower=0,

            upper=100

        ).round(2)

        # =====================================================
        # Export
        # =====================================================

        output = (

            BASE_DIR

            / "data"

            / "synthetic"

            / "ml_features.csv"

        )

        df.to_csv(

            output,

            index=False

        )

        print()

        print("=" * 70)

        print("Feature Engineering Complete")

        print("=" * 70)

        print()

        print("Rows    :", len(df))

        print("Columns :", len(df.columns))

        print()

        print(df.head())

        print()

        print("Saved to:")

        print(output)

        return df