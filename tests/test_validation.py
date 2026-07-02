import requests

from tests.conftest import BASE_URL



def test_missing_age():

    response = requests.post(

        f"{BASE_URL}/api/predict",

        json={}

    )

    assert response.status_code == 400