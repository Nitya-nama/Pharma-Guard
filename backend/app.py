from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from backend.utils.logger import logger
from backend.routes.prediction_routes import prediction_bp
from backend.config import DEBUG, HOST, PORT
from backend.routes.analytics_routes import analytics_bp
from backend.routes.explainability_routes import explainability_bp
import os
app = Flask(__name__)

# CORS
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)

# Swagger Configuration
app.config["SWAGGER"] = {
    "title": "PharmaGuard API",
    "description": "AI-powered Pharmacogenomics Risk Prediction API",
    "version": "1.0.0",
    "uiversion": 3
}

Swagger(app)

# Register Routes
app.register_blueprint(
    prediction_bp,
    url_prefix="/api"
)

app.register_blueprint(
    analytics_bp,
    url_prefix="/api"
)

app.register_blueprint(
    explainability_bp,
    url_prefix="/api"
)

@app.route("/")
def home():

    return {
        "application": "PharmaGuard",
        "version": "1.0",
        "status": "Running"
    }


if __name__ == "__main__":
    logger.info(
        "Starting PharmaGuard API..."
    )

    app.run(

        host="0.0.0.0",

        port=int(os.environ.get("PORT", 5000)),

        debug=False

    )