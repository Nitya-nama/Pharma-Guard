from pathlib import Path
import sqlite3


BASE_DIR = Path(__file__).resolve().parent

DATABASE = BASE_DIR / "pharmaguard.db"


def get_connection():

    connection = sqlite3.connect(DATABASE)

    connection.row_factory = sqlite3.Row

    return connection