from flask import Blueprint, request
from flasgger import swag_from
from marshmallow import ValidationError

from backend.schemas.request_schema import PredictionRequestSchema

from backend.services.prediction_service import prediction_service
from backend.utils.response import success, error


prediction_bp = Blueprint(
    "prediction",
    __name__
)

request_schema = PredictionRequestSchema()


# ============================================================
# Health Check
# ============================================================

@prediction_bp.route("/health", methods=["GET"])
@swag_from({
    "tags": ["System"],
    "summary": "Health Check",
    "description": "Returns API and model health status.",
    "responses": {
        200: {
            "description": "API is healthy"
        }
    }
})
def health():

    return success(
        prediction_service.health()
    )


# ============================================================
# Model Information
# ============================================================

@prediction_bp.route("/model/info", methods=["GET"])
@swag_from({
    "tags": ["Model"],
    "summary": "Model Information",
    "description": "Returns metadata about the deployed ML model.",
    "responses": {
        200: {
            "description": "Model information returned successfully"
        }
    }
})
def info():

    return success(
        prediction_service.info()
    )


# ============================================================
# Single Prediction
# ============================================================

@prediction_bp.route("/predict", methods=["POST"])
@swag_from({
    "tags": ["Prediction"],
    "summary": "Predict Patient Risk",
    "description": "Predict pharmacogenomic risk using the trained XGBoost model.",

    "consumes": [
        "application/json"
    ],

    "produces": [
        "application/json"
    ],

    "parameters": [

        {

            "name": "patient",

            "in": "body",

            "required": True,

            "schema": {

                "type": "object",

                "properties": {

                    "age": {
                        "type": "integer",
                        "example": 67
                    },

                    "gender": {
                        "type": "string",
                        "example": "Male"
                    },

                    "ethnicity": {
                        "type": "string",
                        "example": "Asian"
                    },

                    "height_cm": {
                        "type": "number",
                        "example": 171
                    },

                    "weight_kg": {
                        "type": "number",
                        "example": 81
                    },

                    "bmi": {
                        "type": "number",
                        "example": 27.7
                    },

                    "smoking_status": {
                        "type": "string",
                        "example": "Former"
                    },

                    "alcohol_consumption": {
                        "type": "string",
                        "example": "Occasional"
                    },

                    "physical_activity": {
                        "type": "string",
                        "example": "Low"
                    },

                    "diabetes": {
                        "type": "boolean",
                        "example": True
                    },

                    "hypertension": {
                        "type": "boolean",
                        "example": True
                    },

                    "kidney_disease": {
                        "type": "boolean",
                        "example": True
                    },

                    "liver_disease": {
                        "type": "boolean",
                        "example": False
                    },

                    "heart_disease": {
                        "type": "boolean",
                        "example": True
                    },

                    "disease_count": {
                        "type": "integer",
                        "example": 4
                    },

                    "drug_count": {
                        "type": "integer",
                        "example": 5
                    },

                    "gene_count": {
                        "type": "integer",
                        "example": 5
                    },

                    "variant_count": {
                        "type": "integer",
                        "example": 5
                    },

                    "primary_gene": {
                        "type": "string",
                        "example": "CYP2C19"
                    },

                    "primary_variant": {
                        "type": "string",
                        "example": "CYP2C19*2"
                    },

                    "primary_phenotype": {
                        "type": "string",
                        "example": "Poor Metabolizer"
                    },

                    "primary_evidence": {
                        "type": "string",
                        "example": "1A"
                    },

                    "multimorbidity": {
                        "type": "integer",
                        "example": 1
                    },

                    "high_risk_disease": {
                        "type": "integer",
                        "example": 2
                    },

                    "strong_pgx": {
                        "type": "integer",
                        "example": 1
                    }

                }

            }

        }

    ],

    "responses": {

        200: {
            "description": "Prediction generated successfully"
        },

        400: {
            "description": "Validation Error"
        },

        500: {
            "description": "Internal Server Error"
        }

    }

})
def predict():

    try:

        payload = request.get_json()

        request_schema.load(payload)

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


# ============================================================
# Batch Prediction
# ============================================================

@prediction_bp.route("/predict/batch", methods=["POST"])
@swag_from({
    "tags": ["Prediction"],
    "summary": "Batch Prediction",
    "description": "Predict risk levels for multiple patients.",

    "consumes": [
        "application/json"
    ],

    "produces": [
        "application/json"
    ],

    "parameters": [

        {

            "name": "patients",

            "in": "body",

            "required": True,

            "schema": {

                "type": "array",

                "items": {

                    "type": "object"

                }

            }

        }

    ],

    "responses": {

        200: {
            "description": "Batch prediction completed successfully"
        },

        500: {
            "description": "Internal Server Error"
        }

    }

})
def predict_batch():

    try:

        payload = request.get_json()

        result = prediction_service.predict_batch(payload)

        return success(result)

    except Exception as e:

        return error(

            str(e),

            500

        )