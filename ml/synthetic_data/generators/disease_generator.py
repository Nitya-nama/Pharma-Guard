import random

from ml.synthetic_data.core.constants import DISEASES


def _probability(patient):

    score = {
        "Diabetes": 0.05,
        "Hypertension": 0.08,
        "Heart Disease": 0.03,
        "Kidney Disease": 0.02,
        "Liver Disease": 0.02
    }

    age = patient.age
    bmi = patient.bmi

    if age >= 60:

        score["Hypertension"] += 0.35
        score["Heart Disease"] += 0.25
        score["Kidney Disease"] += 0.20
        score["Diabetes"] += 0.15

    elif age >= 45:

        score["Hypertension"] += 0.20
        score["Heart Disease"] += 0.15
        score["Kidney Disease"] += 0.10
        score["Diabetes"] += 0.10

    elif age >= 30:

        score["Hypertension"] += 0.10
        score["Diabetes"] += 0.05

    if bmi >= 30:

        score["Diabetes"] += 0.30
        score["Hypertension"] += 0.20
        score["Heart Disease"] += 0.15

    elif bmi >= 25:

        score["Diabetes"] += 0.15
        score["Hypertension"] += 0.10

    if patient.smoking_status == "Current":

        score["Heart Disease"] += 0.25
        score["Hypertension"] += 0.10

    elif patient.smoking_status == "Former":

        score["Heart Disease"] += 0.10

    if patient.alcohol_consumption == "Regular":

        score["Liver Disease"] += 0.25

    if patient.physical_activity == "Low":

        score["Diabetes"] += 0.10
        score["Hypertension"] += 0.10

    return score


def assign_diseases(patient):

    probabilities = _probability(patient)

    patient.diseases = []

    for disease in DISEASES:

        if random.random() < probabilities[disease]:

            patient.diseases.append(
                disease
            )

    patient.diabetes = "Diabetes" in patient.diseases

    patient.hypertension = "Hypertension" in patient.diseases

    patient.heart_disease = "Heart Disease" in patient.diseases

    patient.kidney_disease = "Kidney Disease" in patient.diseases

    patient.liver_disease = "Liver Disease" in patient.diseases

    patient.disease_count = len(
        patient.diseases
    )

    return patient


if __name__ == "__main__":

    from ml.synthetic_data.generators.demographics import generate_demographics

    for _ in range(10):

        patient = generate_demographics()

        patient = assign_diseases(patient)

        print()

        print(patient.patient_id)

        print(patient.age)

        print(patient.bmi)

        print(patient.smoking_status)

        print(patient.diseases)