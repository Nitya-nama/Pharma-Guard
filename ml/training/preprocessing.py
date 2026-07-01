from pathlib import Path

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder


BASE_DIR = Path(__file__).resolve().parent.parent

DATA = (
    BASE_DIR
    / "data"
    / "synthetic"
    / "ml_features.csv"
)

MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)


class Preprocessor:

    def __init__(self):

        self.df = pd.read_csv(DATA)

    def prepare(self):

        df = self.df.copy()

        # ----------------------------
        # Target
        # ----------------------------

        y = df["risk_level"]

        # ----------------------------
        # Remove Target Leakage
        # ----------------------------

        leak_columns = [

            "risk_level",
            "risk_score",

            # Derived directly from risk_score
            "overall_health_index",

            # Normalized versions of scores
            "clinical_index",
            "polypharmacy_index",
            "pharmacogenomic_index",
            "lifestyle_index"

        ]

        X = df.drop(columns=leak_columns)

        label_encoder = LabelEncoder()

        y = label_encoder.fit_transform(y)

        categorical = X.select_dtypes(
            include="object"
        ).columns.tolist()

        numeric = X.select_dtypes(
            exclude="object"
        ).columns.tolist()

        transformer = ColumnTransformer(

            [

                (

                    "cat",

                    OneHotEncoder(

                        handle_unknown="ignore"

                    ),

                    categorical

                ),

                (

                    "num",

                    "passthrough",

                    numeric

                )

            ]

        )

        X_train, X_test, y_train, y_test = train_test_split(

            X,

            y,

            test_size=0.2,

            stratify=y,

            random_state=42

        )

        transformer.fit(X_train)

        joblib.dump(

            transformer,

            MODEL_DIR / "preprocessor.pkl"

        )

        joblib.dump(

            label_encoder,

            MODEL_DIR / "label_encoder.pkl"

        )

        return (

            transformer,

            X_train,

            X_test,

            y_train,

            y_test

        )


preprocessor = Preprocessor()


if __name__ == "__main__":

    prep, X_train, X_test, y_train, y_test = preprocessor.prepare()

    print()

    print("=" * 60)

    print("Preprocessor Ready")

    print("=" * 60)

    print()

    print("Training :", len(X_train))

    print("Testing  :", len(X_test))