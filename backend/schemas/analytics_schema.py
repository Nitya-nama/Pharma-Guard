from marshmallow import Schema, fields


class AnalyticsSummarySchema(Schema):

    total_predictions = fields.Integer()

    critical = fields.Integer()

    high = fields.Integer()

    moderate = fields.Integer()

    safe = fields.Integer()