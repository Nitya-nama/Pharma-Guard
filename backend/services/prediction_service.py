from ml.inference.predictor import predictor


class PredictionService:

    def predict(self, payload):

        return predictor.predict(payload)

    def predict_batch(self, payload):

        return predictor.predict_batch(payload)

    def health(self):

        return predictor.health_check()

    def info(self):

        return predictor.model_info()


prediction_service = PredictionService()