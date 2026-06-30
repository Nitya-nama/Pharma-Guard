import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

df = pd.read_csv(
    BASE_DIR / "data/processed/clinical_variants_cleaned.csv"
)

gene_master = (
    df[
        [
            "gene",
            "type",
            "level_of_evidence"
        ]
    ]
    .drop_duplicates()
)

gene_master.to_csv(
    BASE_DIR / "data/processed/gene_master.csv",
    index=False
)

print(gene_master.head())