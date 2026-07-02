from ml.inference.predictor import predictor
from ml.explainability.local_explainer import local_explainer


class ExplainabilityService:

    def explain(self, payload):

        prediction = predictor.predict(payload)

        explanation = local_explainer.explain(payload)

        top = explanation["top_features"][:5]

        names = [x["feature"] for x in top]

        if len(names) > 1:

            summary = (

                "The model predicted "

                f"{prediction['risk_level']} primarily because of "

                +

                ", ".join(names[:-1])

                +

                " and "

                +

                names[-1]

                +

                "."

            )

        else:

            summary = (

                f"The model predicted "

                f"{prediction['risk_level']}."

            )

        return {

            "prediction": prediction["risk_level"],

            "confidence": prediction["confidence"],

            "summary": summary,

            "top_features": explanation["top_features"]

        }


explainability_service = ExplainabilityService()