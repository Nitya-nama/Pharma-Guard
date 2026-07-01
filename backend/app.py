from flask import Flask
from flask_cors import CORS
from flasgger import Swagger

from backend.routes.prediction_routes import prediction_bp
from backend.config import DEBUG, HOST, PORT


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


@app.route("/")
def home():

    return {
        "application": "PharmaGuard",
        "version": "1.0",
        "status": "Running"
    }


if __name__ == "__main__":

    app.run(
        host=HOST,
        port=PORT,
        debug=DEBUG
    )