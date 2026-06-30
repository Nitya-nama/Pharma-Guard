import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

df = pd.read_csv(
    BASE_DIR / "data/processed/clinical_variants_cleaned.csv"
)

mapping = (
    df[
        [
            "chemicals",
            "gene",
            "level_of_evidence"
        ]
    ]
    .rename(
        columns={
            "chemicals":"drug_name"
        }
    )
)

mapping.drop_duplicates(inplace=True)

mapping.to_csv(
    BASE_DIR / "data/processed/drug_gene_mapping.csv",
    index=False
)

print(mapping.head())