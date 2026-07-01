from marshmallow import Schema, fields


class PredictionHistorySchema(Schema):

    id = fields.Integer()

    patient_id = fields.String()

    risk_level = fields.String()

    confidence = fields.Float()

    created_at = fields.DateTime()