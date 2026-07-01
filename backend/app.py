from flask import Flask
from flasgger import Swagger
from backend.routes.prediction_routes import (
    prediction_bp
)

from backend.config import (DEBUG,HOST,PORT)
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)

app = Flask(__name__)
swagger_config = {
    "title": "PharmaGuard API",
    "uiversion": 3
}

Swagger(app, config=swagger_config)
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