from marshmallow import Schema, fields


class PredictionResponseSchema(Schema):

    risk_level = fields.String()

    confidence = fields.Float()

    probabilities = fields.Dict()