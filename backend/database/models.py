from backend.database.database import get_connection


def create_tables():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""

        CREATE TABLE IF NOT EXISTS prediction_history(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

            risk_level TEXT,

            confidence REAL,

            probabilities TEXT,

            payload TEXT

        )

    """)

    connection.commit()

    connection.close()
