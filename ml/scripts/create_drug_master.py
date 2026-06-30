import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

drug_names = pd.read_csv(
    BASE_DIR / "data/processed/drug_names_cleaned.csv"
)

drug_atc = pd.read_csv(
    BASE_DIR / "data/processed/drug_atc_cleaned.csv"
)

drug_master = pd.merge(
    drug_names,
    drug_atc,
    on="drug_id",
    how="left"
)

drug_master = drug_master.drop_duplicates()

drug_master.to_csv(
    BASE_DIR / "data/processed/drug_master.csv",
    index=False
)

print(drug_master.head())

print(drug_master.shape)