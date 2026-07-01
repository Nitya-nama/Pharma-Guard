from ml.knowledge_base import kb


class RiskEngine:

    def __init__(self):

        self.kb = kb

    # -------------------------------------------------------
    # Lifestyle
    # -------------------------------------------------------

    def lifestyle_score(self, patient):

        score = 0

        if patient.smoking_status == "Current":

            score += 8

        elif patient.smoking_status == "Former":

            score += 3

        if patient.alcohol_consumption == "Regular":

            score += 4

        elif patient.alcohol_consumption == "Occasional":

            score += 1

        if patient.physical_activity == "Low":

            score += 5

        elif patient.physical_activity == "Moderate":

            score += 2

        if patient.bmi >= 35:

            score += 8

        elif patient.bmi >= 30:

            score += 5

        elif patient.bmi >= 25:

            score += 2

        return score
    
        # -------------------------------------------------------
    # Clinical Score
    # -------------------------------------------------------

    def clinical_score(self, patient):

        score = 0

        if patient.diabetes:

            score += 8

        if patient.hypertension:

            score += 7

        if patient.heart_disease:

            score += 12

        if patient.kidney_disease:

            score += 10

        if patient.liver_disease:

            score += 6

        score += patient.disease_count * 2

        return score
    
        # -------------------------------------------------------
    # Drug Burden
    # -------------------------------------------------------

    def drug_score(self, patient):

        score = patient.drug_count * 3

        if patient.drug_count >= 5:

            score += 6

        elif patient.drug_count >= 3:

            score += 3

        return score
    
        # -------------------------------------------------------
    # Pharmacogenomics
    # -------------------------------------------------------

    def genetics_score(self, patient):

        score = 0

        score += patient.gene_count

        score += patient.variant_count

        return score
    
        # -------------------------------------------------------
    # Evidence Score
    # -------------------------------------------------------

    def evidence_score(self, patient):

        score = 0

        evidence_weight = {

            "1A": 8,
            "1B": 6,
            "2A": 5,
            "2B": 4,
            "3": 2,
            "4": 1

        }

        for evidence in patient.evidence_levels:

            score += evidence_weight.get(

                evidence,

                1

            )

        return score
    
        # -------------------------------------------------------
    # Interaction Score
    # -------------------------------------------------------

    def interaction_score(self, patient):

        score = 0

        # Diabetes + Kidney Disease
        if patient.diabetes and patient.kidney_disease:
            score += 10

        # Diabetes + Hypertension
        if patient.diabetes and patient.hypertension:
            score += 6

        # Hypertension + Heart Disease
        if patient.hypertension and patient.heart_disease:
            score += 8

        # Heart Disease + Kidney Disease
        if patient.heart_disease and patient.kidney_disease:
            score += 8

        # Polypharmacy
        if patient.drug_count >= 5:
            score += 8

        elif patient.drug_count >= 3:
            score += 4

        # High PGx burden
        if patient.gene_count >= 10:
            score += 4

        return score
    
        # -------------------------------------------------------
    # Final Risk Score
    # -------------------------------------------------------

    def calculate_score(self, patient):

        patient.lifestyle_score = self.lifestyle_score(
            patient
        )

        patient.clinical_score = self.clinical_score(
            patient
        )

        patient.drug_burden_score = self.drug_score(
            patient
        )

        patient.genetic_score = self.genetics_score(
            patient
        )

        patient.evidence_score = self.evidence_score(
            patient
        )

        patient.interaction_score = self.interaction_score(
            patient
        )

        patient.risk_score = (

            patient.lifestyle_score +

            patient.clinical_score +

            patient.drug_burden_score +

            patient.genetic_score +

            patient.evidence_score +

            patient.interaction_score

        )

        return patient.risk_score
    
        # -------------------------------------------------------
    # Risk Level
    # -------------------------------------------------------

    def risk_level(self, patient):
        if patient.risk_score >= 110:
            return "Critical"
        elif patient.risk_score >= 75:
            return "High"
        elif patient.risk_score >= 40:
            return "Moderate"
        else:
            return "Safe"
    
        # -------------------------------------------------------
    # Confidence
    # -------------------------------------------------------

    def confidence(self, patient):

        confidence = 0.50

        confidence += min(

            patient.gene_count,

            10

        ) * 0.02

        confidence += min(

            patient.drug_count,

            5

        ) * 0.02

        confidence += min(

            patient.disease_count,

            5

        ) * 0.03

        return round(

            min(

                confidence,

                0.99

            ),

            2

        )
        
            # -------------------------------------------------------
    # Public API
    # -------------------------------------------------------

    def assign(self, patient):

        self.calculate_score(

            patient

        )

        patient.risk_level = self.risk_level(

            patient

        )

        patient.confidence = self.confidence(

            patient

        )

        return patient


risk_engine = RiskEngine()


def assign_risk(patient):

    return risk_engine.assign(

        patient

    )
    
if __name__ == "__main__":

    from ml.synthetic_data.generators.demographics import generate_demographics
    from ml.synthetic_data.generators.disease_generator import assign_diseases
    from ml.synthetic_data.generators.drug_assigner import assign_drugs
    from ml.synthetic_data.generators.genetics_generator import assign_genetics

    for i in range(5):

        patient = generate_demographics()

        patient = assign_diseases(patient)

        patient = assign_drugs(patient)

        patient = assign_genetics(patient)

        patient = assign_risk(patient)

        print()

        print("=" * 70)
        print("PATIENT", i + 1)
        print("=" * 70)

        print("Diseases :", patient.diseases)
        print("Drugs    :", patient.assigned_drugs)
        print("Genes    :", patient.gene_count)
        print("Variants :", patient.variant_count)

        print()

        print("Lifestyle Score :", patient.lifestyle_score)
        print("Clinical Score  :", patient.clinical_score)
        print("Drug Score      :", patient.drug_burden_score)
        print("Genetics Score  :", patient.genetic_score)
        print("Evidence Score  :", patient.evidence_score)
        print("Interaction     :", patient.interaction_score)

        print()

        print("Risk Score :", patient.risk_score)
        print("Risk Level :", patient.risk_level)
        print("Confidence :", patient.confidence)    