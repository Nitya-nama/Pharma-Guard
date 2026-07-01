from ml.inference.predictor import predictor
from backend.database.repository import prediction_repository


class PredictionService:

    def predict(self, payload):

        result = predictor.predict(payload)

        prediction_id = prediction_repository.save_prediction(
            payload,
            result
        )

        result["prediction_id"] = prediction_id

        return result

    def predict_batch(self, payload):

        results = []

        for patient in payload:

            result = predictor.predict(patient)

            prediction_id = prediction_repository.save_prediction(
                patient,
                result
            )

            result["prediction_id"] = prediction_id

            results.append(result)

        return results

    def health(self):

        return predictor.health_check()

    def info(self):

        return predictor.model_info()
    
    def history(self):

        return prediction_repository.get_all_predictions()


    def history_by_id(self, prediction_id):

        return prediction_repository.get_prediction(
            prediction_id
        )


    def delete(self, prediction_id):

        return prediction_repository.delete_prediction(
            prediction_id
        )


prediction_service = PredictionService()