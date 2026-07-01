from flask import Blueprint
from flask import request

from backend.services.prediction_service import (
    prediction_service
)

from backend.utils.response import (
    success,
    error
)


prediction_bp = Blueprint(

    "prediction",

    __name__

)


@prediction_bp.route(

    "/health",

    methods=["GET"]

)

def health():

    return success(

        prediction_service.health()

    )


@prediction_bp.route(

    "/model/info",

    methods=["GET"]

)

def info():

    return success(

        prediction_service.info()

    )


@prediction_bp.route(

    "/predict",

    methods=["POST"]

)

def predict():

    try:

        payload = request.get_json()

        result = prediction_service.predict(

            payload

        )

        return success(result)

    except Exception as e:

        return error(

            str(e),

            500

        )


@prediction_bp.route(

    "/predict/batch",

    methods=["POST"]

)

def predict_batch():

    try:

        payload = request.get_json()

        result = prediction_service.predict_batch(

            payload

        )

        return success(result)

    except Exception as e:

        return error(

            str(e),

            500

        )