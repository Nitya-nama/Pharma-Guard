from pathlib import Path

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder


BASE_DIR = Path(__file__).resolve().parent.parent

DATASET = BASE_DIR / "data" / "synthetic" / "ml_features.csv"

MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(exist_ok=True)


class RandomForestTrainer:

    def __init__(self):

        self.df = pd.read_csv(DATASET)

    def train(self):

        df = self.df.copy()

        DROP_COLUMNS = [

            "risk_level",

            "risk_score",
            "overall_health_index",

            "lifestyle_score",
            "clinical_score",
            "drug_burden_score",
            "genetic_score",
            "evidence_score",

            "lifestyle_index",
            "clinical_index",
            "polypharmacy_index",
            "pharmacogenomic_index"

        ]

        X = df.drop(

            columns=DROP_COLUMNS

        )

        y = df["risk_level"]

        encoder = LabelEncoder()

        y = encoder.fit_transform(y)

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

        preprocessor = ColumnTransformer(

            [

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

        X_train = preprocessor.fit_transform(

            X_train

        )

        X_test = preprocessor.transform(

            X_test

        )

        model = RandomForestClassifier(

            n_estimators=500,

            max_depth=20,

            min_samples_split=5,

            min_samples_leaf=2,

            class_weight="balanced",

            random_state=42,

            n_jobs=-1

        )

        model.fit(

            X_train,

            y_train

        )

        predictions = model.predict(

            X_test

        )
        
        probabilities = model.predict_proba(
            X_test
        )

        print()

        print("Prediction Probability Shape")

        print(probabilities.shape)

        accuracy = accuracy_score(

            y_test,

            predictions

        )

        print()

        print("=" * 60)

        print("Random Forest Results")

        print("=" * 60)

        print()

        print(

            "Accuracy :",

            round(

                accuracy,

                4

            )

        )

        print()

        print(

            classification_report(

                y_test,

                predictions,

                target_names=encoder.classes_

            )

        )

        print()

        print(

            confusion_matrix(

                y_test,

                predictions

            )

        )

        feature_names = preprocessor.get_feature_names_out()
        
        joblib.dump(
            feature_names,
            MODEL_DIR / "feature_names.pkl"
        )

        importance = pd.DataFrame(

            {

                "Feature": feature_names,

                "Importance": model.feature_importances_

            }

        )

        importance = importance.sort_values(

            "Importance",

            ascending=False

        )

        print()

        print("=" * 60)

        print("Top 20 Features")

        print("=" * 60)

        print()

        print(

            importance.head(20)

        )

        joblib.dump(

            model,

            MODEL_DIR / "random_forest.pkl"

        )

        joblib.dump(

            preprocessor,

            MODEL_DIR / "rf_preprocessor.pkl"

        )

        joblib.dump(

            encoder,

            MODEL_DIR / "label_encoder.pkl"

        )

        importance.to_csv(

            MODEL_DIR / "rf_feature_importance.csv",

            index=False

        )

        print()

        print("=" * 60)

        print("Model Saved")

        print("=" * 60)


if __name__ == "__main__":

    trainer = RandomForestTrainer()

    trainer.train()