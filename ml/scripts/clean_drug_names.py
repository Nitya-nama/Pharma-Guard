import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT = BASE_DIR / "data" / "raw" / "drug_names.tsv"
OUTPUT = BASE_DIR / "data" / "processed" / "drug_names_cleaned.csv"

OUTPUT.parent.mkdir(exist_ok=True)

print("Loading Drug Names...")

df = pd.read_csv(
    INPUT,
    sep="\t",
    header=None,
    names=["drug_id", "drug_name"]
)

print(df.shape)

df.columns = (
    df.columns.str.lower()
              .str.strip()
              .str.replace(" ", "_")
)

df = df.drop_duplicates()

df["drug_name"] = (
    df["drug_name"]
    .astype(str)
    .str.strip()
    .str.title()
)

df = df[df["drug_name"] != ""]

df.reset_index(drop=True, inplace=True)

df.to_csv(OUTPUT, index=False)

print(df.head())

print("Saved:", OUTPUT)