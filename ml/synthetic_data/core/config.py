RANDOM_SEED = 42

MIN_AGE = 18
MAX_AGE = 80

MAX_DRUGS = 3

AGE_GROUPS = [

    ((18, 30), 0.30),

    ((31, 45), 0.30),

    ((46, 60), 0.25),

    ((61, 80), 0.15)

]

HEIGHT_RANGE = {

    "Male": (160, 190),

    "Female": (150, 180)

}

BMI_RANGE = {

    "18-30": (18, 28),

    "31-45": (20, 30),

    "46-60": (22, 33),

    "61-80": (21, 35)

}

ETHNICITY_DISTRIBUTION = {

    "Asian": 0.40,

    "White": 0.25,

    "Black": 0.15,

    "Hispanic": 0.10,

    "Other": 0.10

}

SMOKING_PROBABILITY = [

    0.65,

    0.20,

    0.15

]

ALCOHOL_PROBABILITY = [

    0.35,

    0.50,

    0.15

]

PHYSICAL_ACTIVITY_PROBABILITY = [

    0.30,

    0.50,

    0.20
]