import requests

from tests.conftest import BASE_URL
from tests.conftest import PATIENT


def test_prediction():

    response = requests.post(

        f"{BASE_URL}/api/predict",

        json=PATIENT

    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data["risk_level"] in [

        "Critical",

        "High",

        "Moderate",

        "Safe"

    ]

    assert data["confidence"] > 0.0