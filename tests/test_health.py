import requests

from tests.conftest import BASE_URL
from tests.conftest import PATIENT

def test_health():

    response = requests.get(

        f"{BASE_URL}/api/health"

    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True