from flask import Blueprint

from backend.analytics.analytics_service import analytics_service
from backend.utils.response import success, error
from backend.utils.logger import logger

analytics_bp = Blueprint(
    "analytics",
    __name__
)


# ============================================================
# Analytics Summary
# ============================================================

@analytics_bp.route("/analytics/summary", methods=["GET"])
def summary():

    try:

        return success(
            analytics_service.summary()
        )

    except Exception as e:

        logger.exception("Analytics Summary failed")

        return error(
            str(e),
            500
        )


# ============================================================
# Risk Distribution
# ============================================================

@analytics_bp.route("/analytics/risk-distribution", methods=["GET"])
def risk_distribution():

    try:

        return success(
            analytics_service.risk_distribution()
        )

    except Exception as e:

        logger.exception("Risk Distribution failed")

        return error(
            str(e),
            500
        )


# ============================================================
# Daily Predictions
# ============================================================

@analytics_bp.route("/analytics/daily", methods=["GET"])
def daily_predictions():

    try:

        return success(
            analytics_service.daily_predictions()
        )

    except Exception as e:

        logger.exception("Daily Predictions failed")

        return error(
            str(e),
            500
        )


# ============================================================
# Confidence Distribution
# ============================================================

@analytics_bp.route("/analytics/confidence", methods=["GET"])
def confidence_distribution():

    try:

        return success(
            analytics_service.confidence_distribution()
        )

    except Exception as e:

        logger.exception("Confidence Distribution failed")

        return error(
            str(e),
            500
        )


# ============================================================
# Top Genes
# ============================================================

@analytics_bp.route("/analytics/top-genes", methods=["GET"])
def top_genes():

    try:

        return success(
            analytics_service.top_genes()
        )

    except Exception as e:

        logger.exception("Top Genes Analytics failed")

        return error(
            str(e),
            500
        )