import json

from backend.database.database import get_connection


class PredictionRepository:

    def save_prediction(self, payload, prediction):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(

            """
            INSERT INTO prediction_history(

                risk_level,
                confidence,
                probabilities,
                payload

            )

            VALUES (?, ?, ?, ?)
            """,

            (

                prediction["risk_level"],

                prediction["confidence"],

                json.dumps(
                    prediction["probabilities"]
                ),

                json.dumps(payload)

            )

        )

        connection.commit()

        prediction_id = cursor.lastrowid

        connection.close()

        return prediction_id

    def get_all_predictions(self):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(

            """
            SELECT *
            FROM prediction_history
            ORDER BY timestamp DESC
            """

        )

        rows = cursor.fetchall()

        connection.close()

        return [

            dict(row)

            for row in rows

        ]

    def get_prediction(self, prediction_id):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(

            """
            SELECT *
            FROM prediction_history
            WHERE id = ?
            """,

            (prediction_id,)

        )

        row = cursor.fetchone()

        connection.close()

        if row is None:

            return None

        return dict(row)

    def delete_prediction(self, prediction_id):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(

            """
            DELETE FROM prediction_history
            WHERE id = ?
            """,

            (prediction_id,)

        )

        connection.commit()

        deleted = cursor.rowcount

        connection.close()

        return deleted > 0


prediction_repository = PredictionRepository()

