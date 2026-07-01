import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = True

HOST = "0.0.0.0"

PORT = 5000

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "pharmaguard-secret-key"
)