import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flasgger import Swagger
from backend.utils.logger import logger
from backend.routes.prediction_routes import prediction_bp
from backend.config import DEBUG, HOST, PORT
from backend.routes.analytics_routes import analytics_bp
from backend.routes.explainability_routes import explainability_bp
from backend.database.models import create_tables

dist_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

app = Flask(__name__, static_folder=dist_folder if os.path.exists(dist_folder) else None, static_url_path="")
create_tables()

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

# Combined Static Frontend Route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Do not intercept API or swagger requests
    if path.startswith('api/') or path.startswith('apidocs') or path == 'api':
        return {"error": "API route not found"}, 404

    if path != "" and os.path.exists(dist_folder) and os.path.exists(os.path.join(dist_folder, path)):
        return send_from_directory(dist_folder, path)
    elif os.path.exists(dist_folder) and os.path.exists(os.path.join(dist_folder, "index.html")):
        return send_from_directory(dist_folder, "index.html")
    else:
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