import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT = BASE_DIR / "data" / "raw" / "drug_atc.tsv"
OUTPUT = BASE_DIR / "data" / "processed" / "drug_atc_cleaned.csv"

OUTPUT.parent.mkdir(exist_ok=True)

df = pd.read_csv(
    INPUT,
    sep="\t",
    header=None,
    names=["drug_id", "atc_code"]
)

df.columns = (
    df.columns.str.lower()
              .str.strip()
              .str.replace(" ", "_")
)

df.drop_duplicates(inplace=True)

df["atc_code"] = (
    df["atc_code"]
    .astype(str)
    .str.upper()
    .str.strip()
)

df = df[df["atc_code"] != ""]

df.reset_index(drop=True, inplace=True)

df.to_csv(OUTPUT, index=False)

print(df.head())