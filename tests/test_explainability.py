import requests

from tests.conftest import BASE_URL
from tests.conftest import PATIENT


def test_explainability():

    response = requests.post(

        f"{BASE_URL}/api/explain",

        json=PATIENT

    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert len(

        data["top_features"]

    ) > 0

    assert "summary" in data