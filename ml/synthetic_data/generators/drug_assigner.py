import random

from ml.knowledge_base import kb
from ml.synthetic_data.core.constants import DISEASE_ATC_MAP
from ml.synthetic_data.core.config import MAX_DRUGS


class DrugAssigner:

    def __init__(self):

        self.kb = kb

    def _candidate_drugs(self, patient):

        candidates = []

        used = set()

        for disease in patient.diseases:

            prefixes = DISEASE_ATC_MAP.get(
                disease,
                []
            )

            for prefix in prefixes:

                drugs = self.kb.get_drugs_by_atc_prefix(
                    prefix
                )

                for drug in drugs:

                    name = drug["drug_name"]

                    if name in used:
                        continue

                    used.add(name)

                    candidates.append(drug)

        return candidates

    def assign(self, patient):

        patient.drugs = []

        patient.assigned_drugs = []

        patient.drug_id = ""

        patient.drug_name = ""

        patient.atc_code = ""

        patient.drug_count = 0

        candidates = self._candidate_drugs(
            patient
        )

        if len(candidates) == 0:

            return patient

        total = min(

            MAX_DRUGS,

            len(candidates),

            max(
                1,
                patient.disease_count
            )

        )

        selected = random.sample(

            candidates,

            total

        )

        patient.drugs = selected

        patient.assigned_drugs = [

            item["drug_name"]

            for item in selected

        ]

        patient.drug_count = len(

            selected

        )

        primary = selected[0]

        patient.drug_id = primary.get(

            "drug_id",

            ""

        )

        patient.drug_name = primary.get(

            "drug_name",

            ""

        )

        patient.atc_code = primary.get(

            "atc_code",

            ""

        )

        return patient


drug_assigner = DrugAssigner()


if __name__ == "__main__":

    from ml.synthetic_data.generators.demographics import generate_demographics

    from ml.synthetic_data.generators.disease_generator import assign_diseases

    for _ in range(10):

        patient = generate_demographics()

        patient = assign_diseases(
            patient
        )

        patient = drug_assigner.assign(
            patient
        )

        print()

        print(patient.patient_id)

        print(patient.diseases)

        print(patient.assigned_drugs)

        print(patient.drug_name)