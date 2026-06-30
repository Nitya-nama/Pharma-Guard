import random
import uuid

import numpy as np
import pandas as pd


random.seed(42)
np.random.seed(42)


def generate_patient_id():

    return "PAT-" + uuid.uuid4().hex[:8].upper()


def weighted_choice(values, probabilities):

    return random.choices(

        values,

        weights=probabilities,

        k=1

    )[0]


def calculate_weight(height_cm, bmi):

    height = height_cm / 100

    return round(

        bmi * height * height,

        1

    )


def calculate_bmi(weight, height_cm):

    height = height_cm / 100

    return round(

        weight / (height * height),

        1

    )


def save_dataframe(df, path):

    df.to_csv(

        path,

        index=False

    )


def load_dataframe(path):

    return pd.read_csv(path)


def random_sample(items, n):

    if len(items) <= n:

        return items

    return random.sample(items, n)