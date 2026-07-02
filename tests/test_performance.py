import time
import requests

from tests.conftest import BASE_URL
from tests.conftest import PATIENT


def test_prediction_speed():

    start = time.time()

    response = requests.post(

        f"{BASE_URL}/api/predict",

        json=PATIENT

    )

    elapsed = time.time() - start

    assert response.status_code == 200

    assert elapsed < 2