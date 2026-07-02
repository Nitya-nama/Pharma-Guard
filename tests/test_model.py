import requests

from tests.conftest import BASE_URL



def test_model():

    response = requests.get(

        f"{BASE_URL}/api/model/info"

    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert "classes" in data

    assert "feature_count" in data