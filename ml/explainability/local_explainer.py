import pandas as pd
import shap

from ml.explainability.model_loader import loader
from ml.explainability.feature_mapper import FEATURE_NAMES


class LocalExplainer:

    def __init__(self):

        self.model = loader.model

        self.preprocessor = loader.preprocessor

        self.label_encoder = loader.label_encoder

        self.explainer = shap.TreeExplainer(
            self.model
        )

    def explain(self, patient):

        # ---------------------------------------
        # Patient → DataFrame
        # ---------------------------------------

        df = pd.DataFrame([patient])

        X = self.preprocessor.transform(df)

        feature_names = self.preprocessor.get_feature_names_out()

        # ---------------------------------------
        # Predict Class
        # ---------------------------------------

        prediction = self.model.predict(X)

        predicted_class = int(prediction[0])

        predicted_label = self.label_encoder.inverse_transform(
            [predicted_class]
        )[0]

        # ---------------------------------------
        # SHAP Values
        # ---------------------------------------

        shap_values = self.explainer.shap_values(X)

        # -------------------------------------------------------
        # Handle different SHAP output formats
        # -------------------------------------------------------

        if isinstance(shap_values, list):

            # Older SHAP versions
            class_values = shap_values[predicted_class][0]

        else:

            # SHAP >= 0.44 often returns:
            # (samples, features, classes)

            if len(shap_values.shape) == 3:

                class_values = shap_values[
                    0,
                    :,
                    predicted_class
                ]

            else:

                class_values = shap_values[0]

        # ---------------------------------------
        # Build Explanation
        # ---------------------------------------

        explanation = []

        for feature, shap_value in zip(
            feature_names,
            class_values
        ):

            friendly = FEATURE_NAMES.get(

                feature,

                feature.replace("num__", "")
                       .replace("cat__", "")
                       .replace("_", " ")
                       .title()

            )

            impact = abs(float(shap_value))

            if impact >= 1:

                importance = "Very High"

            elif impact >= 0.40:

                importance = "High"

            elif impact >= 0.10:

                importance = "Medium"

            else:

                importance = "Low"

            effect = (

                "Increases Risk"

                if shap_value > 0

                else "Reduces Risk"

            )

            explanation.append(

                {

                    "feature": friendly,

                    "impact": round(impact, 4),

                    "shap_value": round(float(shap_value), 4),

                    "effect": effect,

                    "importance": importance

                }

            )

        explanation.sort(

            key=lambda x: x["impact"],

            reverse=True

        )

        return {

            "predicted_class": predicted_label,

            "top_features": explanation[:10]

        }


local_explainer = LocalExplainer()