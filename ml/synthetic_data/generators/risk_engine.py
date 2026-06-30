from ml.synthetic_data.core.constants import EVIDENCE_PRIORITY


EVIDENCE_SCORES = {

    "1A": 10,
    "1B": 8,
    "2A": 6,
    "2B": 4,
    "3": 2,
    "4": 1

}


class RiskEngine:

    def __init__(self):

        pass

    def lifestyle_score(self, patient):

        score = 0

        if patient.age >= 65:

            score += 8

        elif patient.age >= 50:

            score += 5

        elif patient.age >= 35:

            score += 2

        if patient.bmi >= 30:

            score += 6

        elif patient.bmi >= 25:

            score += 3

        if patient.smoking_status == "Current":

            score += 6

        elif patient.smoking_status == "Former":

            score += 3

        if patient.alcohol_consumption == "Regular":

            score += 3

        elif patient.alcohol_consumption == "Occasional":

            score += 1

        if patient.physical_activity == "Low":

            score += 4

        elif patient.physical_activity == "Moderate":

            score += 2

        return min(score, 25)

    def disease_score(self, patient):

        score = patient.disease_count * 5

        if patient.heart_disease:

            score += 5

        if patient.kidney_disease:

            score += 3

        return min(score, 25)

    def polypharmacy_score(self, patient):

        if patient.drug_count >= 5:

            return 15

        if patient.drug_count == 4:

            return 12

        if patient.drug_count == 3:

            return 9

        if patient.drug_count == 2:

            return 6

        if patient.drug_count == 1:

            return 3

        return 0

    def pharmacogenomic_score(self, patient):

        genes = len(patient.genes)

        variants = len(patient.variants)

        score = genes * 3

        score += variants * 2

        return min(score, 15)

    def evidence_score(self, patient):

        if len(patient.evidence_levels) == 0:

            return 0

        scores = []

        for level in patient.evidence_levels:

            scores.append(

                EVIDENCE_SCORES.get(

                    level,

                    1

                )

            )

        return max(scores)

    def assign(self, patient):

        patient.lifestyle_score = self.lifestyle_score(

            patient

        )

        patient.disease_score = self.disease_score(

            patient

        )

        patient.polypharmacy_score = self.polypharmacy_score(

            patient

        )

        patient.pharmacogenomic_score = self.pharmacogenomic_score(

            patient

        )

        patient.evidence_score = self.evidence_score(

            patient

        )

        patient.risk_score = (

            patient.lifestyle_score

            + patient.disease_score

            + patient.polypharmacy_score

            + patient.pharmacogenomic_score

            + patient.evidence_score

        )

        if patient.risk_score < 25:

            patient.risk_level = "Safe"

        elif patient.risk_score < 50:

            patient.risk_level = "Moderate"

        elif patient.risk_score < 75:

            patient.risk_level = "High"

        else:

            patient.risk_level = "Critical"

        if patient.evidence_score == 0:

            patient.confidence = 0.50

        else:

            patient.confidence = round(

                min(

                    0.50 +

                    (patient.evidence_score / 20),

                    0.99

                ),

                2

            )

        return patient


risk_engine = RiskEngine()


if __name__ == "__main__":

    from ml.synthetic_data.generators.demographics import generate_demographics

    from ml.synthetic_data.generators.disease_generator import assign_diseases

    from ml.synthetic_data.generators.drug_assigner import drug_assigner

    from ml.synthetic_data.generators.genetics_generator import genetics_generator

    patient = generate_demographics()

    patient = assign_diseases(

        patient

    )

    patient = drug_assigner.assign(

        patient

    )

    patient = genetics_generator.assign(

        patient

    )

    patient = risk_engine.assign(

        patient

    )

    print()

    print(patient.to_dict())