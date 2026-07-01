from flask import Blueprint
from flask import request

from marshmallow import ValidationError
from backend.schemas.patient_schema import PatientSchema

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

patient_schema = PatientSchema()

@prediction_bp.route(
    "/predict",
    methods=["POST"]
)
def predict():
    
    """
        Predict patient risk level
        ---
        tags:
        - Prediction

        consumes:
        - application/json

        parameters:
        - in: body
            name: patient
            required: true
            schema:
            type: object
            properties:
                age:
                type: integer
                example: 67
                gender:
                type: string
                example: Male
                ethnicity:
                type: string
                example: Asian
                bmi:
                type: number
                example: 27.7
                disease_count:
                type: integer
                example: 4
                drug_count:
                type: integer
                example: 5

        responses:
        200:
            description: Prediction generated successfully

        400:
            description: Validation error

        500:
            description: Internal server error
    """

    try:
        payload = request.get_json()
        patient_schema.load(payload)
        result = prediction_service.predict(payload)
        return success(result)

    except ValidationError as err:

        return error(
            {
                "Validation Error": err.messages
            },
            400
        )

    except Exception as e:

        return error(
            str(e),
            500
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