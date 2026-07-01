import random

from ml.synthetic_data.core.constants import DISEASES


BASE_PROBABILITY = {
    "Diabetes": 0.03,
    "Hypertension": 0.05,
    "Heart Disease": 0.01,
    "Kidney Disease": 0.01,
    "Liver Disease": 0.02
}


class DiseaseGenerator:

    def __init__(self):
        pass

    def _initialize_probability(self):
        return BASE_PROBABILITY.copy()

    def _age_effect(self, patient, probability):

        age = patient.age

        if age >= 70:

            probability["Diabetes"] += 0.22
            probability["Hypertension"] += 0.35
            probability["Heart Disease"] += 0.28
            probability["Kidney Disease"] += 0.24
            probability["Liver Disease"] += 0.06

        elif age >= 60:

            probability["Diabetes"] += 0.18
            probability["Hypertension"] += 0.28
            probability["Heart Disease"] += 0.22
            probability["Kidney Disease"] += 0.18
            probability["Liver Disease"] += 0.05

        elif age >= 45:

            probability["Diabetes"] += 0.12
            probability["Hypertension"] += 0.18
            probability["Heart Disease"] += 0.12
            probability["Kidney Disease"] += 0.10

        elif age >= 30:

            probability["Diabetes"] += 0.06
            probability["Hypertension"] += 0.08

    def _bmi_effect(self, patient, probability):

        bmi = patient.bmi

        if bmi >= 35:

            probability["Diabetes"] += 0.30
            probability["Hypertension"] += 0.24
            probability["Heart Disease"] += 0.18

        elif bmi >= 30:

            probability["Diabetes"] += 0.22
            probability["Hypertension"] += 0.18
            probability["Heart Disease"] += 0.12

        elif bmi >= 25:

            probability["Diabetes"] += 0.10
            probability["Hypertension"] += 0.08

    def _smoking_effect(self, patient, probability):

        if patient.smoking_status == "Current":

            probability["Heart Disease"] += 0.25
            probability["Hypertension"] += 0.15
            probability["Kidney Disease"] += 0.05

        elif patient.smoking_status == "Former":

            probability["Heart Disease"] += 0.10
            probability["Hypertension"] += 0.05

    def _alcohol_effect(self, patient, probability):

        if patient.alcohol_consumption == "Regular":

            probability["Liver Disease"] += 0.35
            probability["Heart Disease"] += 0.05

        elif patient.alcohol_consumption == "Occasional":

            probability["Liver Disease"] += 0.08

    def _activity_effect(self, patient, probability):

        if patient.physical_activity == "Low":

            probability["Diabetes"] += 0.12
            probability["Hypertension"] += 0.12
            probability["Heart Disease"] += 0.08

        elif patient.physical_activity == "Moderate":

            probability["Diabetes"] += 0.04
            probability["Hypertension"] += 0.04

    def _clip_probability(self, probability):

        for disease in probability:

            probability[disease] = max(
                0.0,
                min(
                    probability[disease],
                    0.95
                )
            )

        return probability

    def _assign_primary_diseases(self, probability):

        diseases = []

        for disease in DISEASES:

            if random.random() < probability[disease]:

                diseases.append(disease)

        return diseases
    
    
    def _apply_dependencies(self, diseases, probability):

        if "Diabetes" in diseases:

            probability["Hypertension"] += 0.22
            probability["Kidney Disease"] += 0.18

        if "Hypertension" in diseases:

            probability["Heart Disease"] += 0.20
            probability["Kidney Disease"] += 0.12

        if "Heart Disease" in diseases:

            probability["Kidney Disease"] += 0.08

        if "Kidney Disease" in diseases:

            probability["Heart Disease"] += 0.06

        if "Liver Disease" in diseases:

            probability["Diabetes"] += 0.04

        probability = self._clip_probability(
            probability
        )

        for disease in DISEASES:

            if disease in diseases:
                continue

            if random.random() < probability[disease]:

                diseases.append(
                    disease
                )

        return diseases

    def _multimorbidity(self, patient, diseases):

        if patient.age >= 65 and len(diseases) >= 2:

            if "Hypertension" not in diseases:

                diseases.append(
                    "Hypertension"
                )

        if patient.bmi >= 32:

            if "Diabetes" in diseases:

                if "Hypertension" not in diseases:

                    diseases.append(
                        "Hypertension"
                    )

        if patient.smoking_status == "Current":

            if "Heart Disease" in diseases:

                if "Hypertension" not in diseases:

                    diseases.append(
                        "Hypertension"
                    )

        if patient.age >= 70:

            if len(diseases) == 1:

                remaining = [

                    disease

                    for disease in DISEASES

                    if disease not in diseases

                ]

                if len(remaining):

                    diseases.append(

                        random.choice(

                            remaining

                        )

                    )

        return list(

            dict.fromkeys(

                diseases

            )

        )

    def assign(self, patient):

        probability = self._initialize_probability()

        self._age_effect(

            patient,

            probability

        )

        self._bmi_effect(

            patient,

            probability

        )

        self._smoking_effect(

            patient,

            probability

        )

        self._alcohol_effect(

            patient,

            probability

        )

        self._activity_effect(

            patient,

            probability

        )

        probability = self._clip_probability(

            probability

        )

        diseases = self._assign_primary_diseases(

            probability

        )

        diseases = self._apply_dependencies(

            diseases,

            probability

        )

        diseases = self._multimorbidity(

            patient,

            diseases

        )

        patient.diseases = diseases

        patient.diabetes = "Diabetes" in diseases

        patient.hypertension = "Hypertension" in diseases

        patient.heart_disease = "Heart Disease" in diseases

        patient.kidney_disease = "Kidney Disease" in diseases

        patient.liver_disease = "Liver Disease" in diseases

        patient.disease_count = len(

            diseases

        )

        return patient


disease_generator = DiseaseGenerator()


def assign_diseases(patient):

    return disease_generator.assign(

        patient

    )