from ml.inference.predictor import predictor
from backend.database.repository import prediction_repository
from backend.utils.logger import logger


class PredictionService:

    def predict(self, payload):

        logger.info("Prediction request received.")

        result = predictor.predict(payload)

        logger.info(
            f"Prediction completed | "
            f"Risk={result['risk_level']} | "
            f"Confidence={result['confidence']}"
        )

        prediction_id = prediction_repository.save_prediction(
            payload,
            result
        )

        logger.info(
            f"Prediction stored | ID={prediction_id}"
        )

        result["prediction_id"] = prediction_id

        return result

    def predict_batch(self, payload):

        logger.info(
            f"Batch prediction started | Patients={len(payload)}"
        )

        results = []

        for patient in payload:

            result = predictor.predict(patient)

            prediction_id = prediction_repository.save_prediction(
                patient,
                result
            )

            result["prediction_id"] = prediction_id

            results.append(result)

        logger.info(
            f"Batch prediction completed | Total={len(results)}"
        )

        return results

    def health(self):

        logger.info("Health endpoint accessed.")

        return predictor.health_check()

    def info(self):

        logger.info("Model info requested.")

        return predictor.model_info()

    def history(self):

        logger.info("Prediction history requested.")

        return prediction_repository.get_all_predictions()

    def history_by_id(self, prediction_id):

        logger.info(
            f"Prediction requested | ID={prediction_id}"
        )

        return prediction_repository.get_prediction(
            prediction_id
        )

    def delete(self, prediction_id):

        logger.info(
            f"Deleting prediction | ID={prediction_id}"
        )

        return prediction_repository.delete_prediction(
            prediction_id
        )


prediction_service = PredictionService()