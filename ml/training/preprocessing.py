from pathlib import Path

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


BASE_DIR = Path(__file__).resolve().parent.parent

DATASET = BASE_DIR / "data" / "synthetic" / "ml_training_dataset.csv"

MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(
    exist_ok=True
)


class DataPreprocessor:

    def __init__(self):

        self.df = pd.read_csv(
            DATASET
        )

    def prepare(self):

        df = self.df.copy()

        X = df.drop(
            columns=["risk_level"]
        )

        y = df["risk_level"]

        categorical = X.select_dtypes(
            include=["object"]
        ).columns.tolist()

        numerical = X.select_dtypes(
            exclude=["object"]
        ).columns.tolist()

        numeric_pipeline = Pipeline(

            steps=[

                (
                    "imputer",

                    SimpleImputer(

                        strategy="median"

                    )

                )

            ]

        )

        categorical_pipeline = Pipeline(

            steps=[

                (
                    "imputer",

                    SimpleImputer(

                        strategy="most_frequent"

                    )

                ),

                (
                    "encoder",

                    OneHotEncoder(

                        handle_unknown="ignore"

                    )

                )

            ]

        )

        transformer = ColumnTransformer(

            transformers=[

                (

                    "num",

                    numeric_pipeline,

                    numerical

                ),

                (

                    "cat",

                    categorical_pipeline,

                    categorical

                )

            ]

        )

        X_train, X_test, y_train, y_test = train_test_split(

            X,

            y,

            test_size=0.20,

            random_state=42,

            stratify=y

        )

        X_train = transformer.fit_transform(

            X_train

        )

        X_test = transformer.transform(

            X_test

        )

        joblib.dump(

            transformer,

            MODEL_DIR / "preprocessor.pkl"

        )

        print()

        print("=" * 60)

        print("Preprocessing Complete")

        print("=" * 60)

        print()

        print("Training Samples :", X_train.shape)

        print("Testing Samples  :", X_test.shape)

        print()

        return (

            X_train,

            X_test,

            y_train,

            y_test

        )


if __name__ == "__main__":

    processor = DataPreprocessor()

    processor.prepare()