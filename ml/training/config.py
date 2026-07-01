"""
Central configuration for the ML pipeline.

This file defines every feature used for training
and inference.

All training scripts, predictors and APIs must
import these constants instead of hardcoding
feature names.
"""

TARGET_COLUMN = "risk_level"

FEATURE_COLUMNS = [

    # =====================================================
    # Demographics
    # =====================================================

    "age",
    "gender",
    "ethnicity",

    "height_cm",
    "weight_kg",
    "bmi",

    "smoking_status",
    "alcohol_consumption",
    "physical_activity",

    # =====================================================
    # Diseases
    # =====================================================

    "diabetes",
    "hypertension",
    "kidney_disease",
    "liver_disease",
    "heart_disease",

    "disease_count",

    # =====================================================
    # Drugs
    # =====================================================

    "drug_count",

    # =====================================================
    # Genetics
    # =====================================================

    "gene_count",
    "variant_count",

    "primary_gene",
    "primary_variant",
    "primary_phenotype",
    "primary_evidence",

    # =====================================================
    # Safe Engineered Features
    # =====================================================

    "multimorbidity",
    "high_risk_disease",
    "strong_pgx"

]