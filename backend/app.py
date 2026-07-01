from flask import Flask

from backend.routes.prediction_routes import (
    prediction_bp
)

from backend.config import (

    DEBUG,

    HOST,

    PORT

)


app = Flask(__name__)

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