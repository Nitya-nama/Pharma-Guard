from marshmallow import Schema, fields, validate


class PatientSchema(Schema):

    age = fields.Integer(required=True)

    gender = fields.String(
        required=True,
        validate=validate.OneOf(
            [
                "Male",
                "Female"
            ]
        )
    )

    ethnicity = fields.String(required=True)

    height_cm = fields.Float(required=True)

    weight_kg = fields.Float(required=True)

    bmi = fields.Float(required=True)

    smoking_status = fields.String(required=True)

    alcohol_consumption = fields.String(required=True)

    physical_activity = fields.String(required=True)

    diabetes = fields.Boolean(required=True)

    hypertension = fields.Boolean(required=True)

    kidney_disease = fields.Boolean(required=True)

    liver_disease = fields.Boolean(required=True)

    heart_disease = fields.Boolean(required=True)

    disease_count = fields.Integer(required=True)

    drug_count = fields.Integer(required=True)

    gene_count = fields.Integer(required=True)

    variant_count = fields.Integer(required=True)

    primary_gene = fields.String()

    primary_variant = fields.String()

    primary_phenotype = fields.String()

    primary_evidence = fields.String()

    multimorbidity = fields.Integer(required=True)

    high_risk_disease = fields.Integer(required=True)

    strong_pgx = fields.Integer(required=True)