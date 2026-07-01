from flask import Blueprint

from backend.analytics.analytics_service import analytics_service
from backend.utils.response import success


analytics_bp = Blueprint(
    "analytics",
    __name__
)


@analytics_bp.route("/analytics/summary", methods=["GET"])
def summary():

    return success(

        analytics_service.summary()

    )
    
@analytics_bp.route("/analytics/risk-distribution", methods=["GET"])
def risk_distribution():

    return success(

        analytics_service.risk_distribution()

    )
    
@analytics_bp.route(
    "/analytics/daily",
    methods=["GET"]
)
def daily_predictions():

    return success(

        analytics_service.daily_predictions()

    )
    
@analytics_bp.route(
    "/analytics/confidence",
    methods=["GET"]
)
def confidence_distribution():

    return success(

        analytics_service.confidence_distribution()

    )
    
@analytics_bp.route(
    "/analytics/top-genes",
    methods=["GET"]
)
def top_genes():

    return success(

        analytics_service.top_genes()

    )            
    