from pathlib import Path

import joblib
import pandas as pd
import matplotlib.pyplot as plt

from xgboost import XGBClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from ml.training.preprocessing import preprocessor


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


class XGBoostTrainer:

    def __init__(self):

        (
            self.transformer,
            self.X_train,
            self.X_test,
            self.y_train,
            self.y_test

        ) = preprocessor.prepare()

    def train(self):

        X_train = self.transformer.transform(
            self.X_train
        )

        X_test = self.transformer.transform(
            self.X_test
        )

        self.model = XGBClassifier(

            n_estimators=300,

            learning_rate=0.05,

            max_depth=8,

            subsample=0.8,

            colsample_bytree=0.8,

            objective="multi:softprob",

            num_class=4,

            random_state=42,

            eval_metric="mlogloss"

        )

        self.model.fit(

            X_train,

            self.y_train

        )

        predictions = self.model.predict(

            X_test

        )

        probabilities = self.model.predict_proba(

            X_test

        )

        print()

        print("=" * 60)
        print("Prediction Probability Shape")
        print("=" * 60)
        print(probabilities.shape)

        print()

        print("=" * 60)
        print("XGBoost Results")
        print("=" * 60)

        print()

        print(

            "Accuracy :",

            round(

                accuracy_score(

                    self.y_test,

                    predictions

                ),

                4

            )

        )

        print()

        encoder = joblib.load(

            MODEL_DIR / "label_encoder.pkl"

        )

        print(

            classification_report(

                self.y_test,

                predictions,

                target_names=encoder.classes_

            )

        )

        print(

            confusion_matrix(

                self.y_test,

                predictions

            )

        )

        self.feature_importance()

        joblib.dump(

            self.model,

            MODEL_DIR / "xgboost.pkl"

        )

        print()

        print("=" * 60)
        print("Model Saved")
        print("=" * 60)

    def feature_importance(self):

        names = self.transformer.get_feature_names_out()

        importance = pd.DataFrame({

            "Feature": names,

            "Importance": self.model.feature_importances_

        })

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

        plt.figure(

            figsize=(10,8)

        )

        plt.barh(

            importance.head(20)["Feature"][::-1],

            importance.head(20)["Importance"][::-1]

        )

        plt.title(

            "Top 20 XGBoost Feature Importance"

        )

        plt.tight_layout()

        plt.show()


trainer = XGBoostTrainer()