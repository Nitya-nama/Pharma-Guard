import random

from ml.synthetic_data.core.patient import Patient
from ml.synthetic_data.core.constants import (
    GENDERS,
    ETHNICITIES,
    SMOKING_STATUS,
    ALCOHOL_CONSUMPTION,
    PHYSICAL_ACTIVITY
)
from ml.synthetic_data.core.config import (
    AGE_GROUPS,
    HEIGHT_RANGE,
    BMI_RANGE,
    ETHNICITY_DISTRIBUTION,
    SMOKING_PROBABILITY,
    ALCOHOL_PROBABILITY,
    PHYSICAL_ACTIVITY_PROBABILITY
)
from ml.synthetic_data.core.utils import (
    generate_patient_id,
    weighted_choice,
    calculate_weight
)


def _generate_age():

    groups = [item[0] for item in AGE_GROUPS]
    probabilities = [item[1] for item in AGE_GROUPS]

    selected = weighted_choice(
        groups,
        probabilities
    )

    return random.randint(
        selected[0],
        selected[1]
    )


def _generate_gender():

    return random.choice(
        GENDERS
    )


def _generate_ethnicity():

    return weighted_choice(

        list(ETHNICITY_DISTRIBUTION.keys()),

        list(ETHNICITY_DISTRIBUTION.values())

    )


def _generate_height(gender):

    minimum, maximum = HEIGHT_RANGE[gender]

    return round(

        random.uniform(

            minimum,

            maximum

        ),

        1

    )


def _generate_bmi(age):

    if age <= 30:

        key = "18-30"

    elif age <= 45:

        key = "31-45"

    elif age <= 60:

        key = "46-60"

    else:

        key = "61-80"

    minimum, maximum = BMI_RANGE[key]

    return round(

        random.uniform(

            minimum,

            maximum

        ),

        1

    )


def generate_demographics():

    patient = Patient()

    patient.patient_id = generate_patient_id()

    patient.age = _generate_age()

    patient.gender = _generate_gender()

    patient.ethnicity = _generate_ethnicity()

    patient.height_cm = _generate_height(

        patient.gender

    )

    patient.bmi = _generate_bmi(

        patient.age

    )

    patient.weight_kg = calculate_weight(

        patient.height_cm,

        patient.bmi

    )

    patient.smoking_status = weighted_choice(

        SMOKING_STATUS,

        SMOKING_PROBABILITY

    )

    patient.alcohol_consumption = weighted_choice(

        ALCOHOL_CONSUMPTION,

        ALCOHOL_PROBABILITY

    )

    patient.physical_activity = weighted_choice(

        PHYSICAL_ACTIVITY,

        PHYSICAL_ACTIVITY_PROBABILITY

    )

    return patient