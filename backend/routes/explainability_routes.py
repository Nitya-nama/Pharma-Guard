from flask import Blueprint, request

from backend.services.explainability_service import explainability_service
from backend.utils.response import success, error
import traceback
from backend.utils.logger import logger
explainability_bp = Blueprint(
    "explainability",
    __name__
)


@explainability_bp.route(
    "/explain",
    methods=["POST"]
)
def explain():

    """
    Explain Prediction
    ---
    tags:
      - Explainability

    summary: Explain model prediction using SHAP

    consumes:
      - application/json

    produces:
      - application/json

    responses:

      200:
        description: Prediction explanation
    """

    try:

        payload = request.get_json()

        result = explainability_service.explain(
            payload
        )

        return success(result)

    except Exception as e:

        logger.exception("Prediction failed")

        return error(
            str(e),
            500
        )