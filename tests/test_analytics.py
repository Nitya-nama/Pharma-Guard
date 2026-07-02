import requests

from tests.conftest import BASE_URL



def test_summary():

    response = requests.get(

        f"{BASE_URL}/api/analytics/summary"

    )

    assert response.status_code == 200