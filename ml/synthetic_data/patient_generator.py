from pathlib import Path

import pandas as pd

from ml.synthetic_data.generators.demographics import generate_demographics
from ml.synthetic_data.generators.disease_generator import assign_diseases
from ml.synthetic_data.generators.drug_assigner import drug_assigner
from ml.synthetic_data.generators.genetics_generator import genetics_generator
from ml.synthetic_data.generators.risk_engine import risk_engine


class PatientGenerator:

    def __init__(self):

        pass

    def generate_patient(self):

        patient = generate_demographics()

        patient = assign_diseases(patient)

        patient = drug_assigner.assign(patient)

        patient = genetics_generator.assign(patient)

        patient = risk_engine.assign(patient)

        return patient

    def generate_dataset(self, total):

        patients = []

        for i in range(total):

            patient = self.generate_patient()

            patients.append(
                patient.to_dict()
            )

            if (i + 1) % 100 == 0:

                print(
                    "Generated",
                    i + 1,
                    "patients..."
                )

        return pd.DataFrame(
            patients
        )

    def export(self, df):

        output_dir = (
            Path(__file__).resolve().parent.parent
            / "data"
            / "synthetic"
        )

        output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        df.to_csv(

            output_dir / "synthetic_patients.csv",

            index=False

        )

        ml_columns = [

            "age",
            "gender",
            "ethnicity",

            "height_cm",
            "weight_kg",
            "bmi",

            "smoking_status",
            "alcohol_consumption",
            "physical_activity",

            "diabetes",
            "hypertension",
            "kidney_disease",
            "liver_disease",
            "heart_disease",

            "disease_count",

            "drug_count",

            "lifestyle_score",
            "disease_score",
            "polypharmacy_score",
            "pharmacogenomic_score",
            "evidence_score",

            "primary_gene",
            "primary_variant",
            "primary_phenotype",
            "primary_evidence",

            "risk_score",
            "risk_level"

        ]

        df[ml_columns].to_csv(

            output_dir / "ml_training_dataset.csv",

            index=False

        )

        df.to_csv(

            output_dir / "analytics_dataset.csv",

            index=False

        )

        print()

        print("=" * 60)

        print("Datasets Exported Successfully")

        print("=" * 60)

        print(output_dir / "synthetic_patients.csv")

        print(output_dir / "ml_training_dataset.csv")

        print(output_dir / "analytics_dataset.csv")

        print()

        print("Rows :", len(df))

        print("Columns :", len(df.columns))


generator = PatientGenerator()


if __name__ == "__main__":

    NUMBER_OF_PATIENTS = 10000

    dataframe = generator.generate_dataset(

        NUMBER_OF_PATIENTS

    )

    generator.export(

        dataframe

    )

    print()

    print(

        dataframe.head()

    )