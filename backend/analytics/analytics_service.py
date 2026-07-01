import json

from backend.database.database import get_connection
from backend.utils.logger import logger

class AnalyticsService:

    def summary(self):
        logger.info("Analytics summary requested.")

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute("""

            SELECT

                COUNT(*) AS total,

                AVG(confidence) AS avg_confidence,

                SUM(
                    CASE
                        WHEN risk_level='Critical'
                        THEN 1
                        ELSE 0
                    END
                ) AS critical,

                SUM(
                    CASE
                        WHEN risk_level='High'
                        THEN 1
                        ELSE 0
                    END
                ) AS high,

                SUM(
                    CASE
                        WHEN risk_level='Moderate'
                        THEN 1
                        ELSE 0
                    END
                ) AS moderate,

                SUM(
                    CASE
                        WHEN risk_level='Safe'
                        THEN 1
                        ELSE 0
                    END
                ) AS safe

            FROM prediction_history

        """)

        row = cursor.fetchone()

        connection.close()

        return {

            "total_predictions": row["total"],

            "critical": row["critical"],

            "high": row["high"],

            "moderate": row["moderate"],

            "safe": row["safe"],

            "average_confidence": round(
                row["avg_confidence"],
                4
            ) if row["avg_confidence"] else 0

        }
        
    def risk_distribution(self):
        logger.info("Risk distribution requested.")
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT
                risk_level,
                COUNT(*) AS count
            FROM prediction_history
            GROUP BY risk_level
            ORDER BY count DESC
        """)
        rows = cursor.fetchall()
        connection.close()
        return [
            {
                "risk_level": row["risk_level"],
                "count": row["count"]
            }
            for row in rows
        ]  
        
        
    def daily_predictions(self):
        logger.info("Daily predictions requested.")

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute("""

            SELECT

                DATE(timestamp) AS date,

                COUNT(*) AS predictions

            FROM prediction_history

            GROUP BY DATE(timestamp)

            ORDER BY DATE(timestamp)

        """)

        rows = cursor.fetchall()

        connection.close()

        return [

            {

                "date": row["date"],

                "predictions": row["predictions"]

            }

            for row in rows

        ]      
        
        
    def confidence_distribution(self):
        logger.info("Confidence distribution requested.")

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute("""

            SELECT

                ROUND(confidence,2) AS confidence,

                COUNT(*) AS count

            FROM prediction_history

            GROUP BY ROUND(confidence,2)

            ORDER BY confidence DESC

        """)

        rows = cursor.fetchall()

        connection.close()

        return [

            {

                "confidence": row["confidence"],

                "count": row["count"]

            }

            for row in rows

        ]    

    def top_genes(self):
        logger.info("Top genes requested.")

        import json

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute("""

            SELECT payload

            FROM prediction_history

        """)

        rows = cursor.fetchall()

        connection.close()

        genes = {}

        for row in rows:

            payload = json.loads(row["payload"])

            gene = payload.get(

                "primary_gene",

                "Unknown"

            )

            if gene == "":

                gene = "Unknown"

            genes[gene] = genes.get(

                gene,

                0

            ) + 1

        result = [

            {

                "gene": k,

                "count": v

            }

            for k, v in genes.items()

        ]

        result.sort(

            key=lambda x: x["count"],

            reverse=True

        )

        return result[:10]

analytics_service = AnalyticsService()
