import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

RAW_DATA = BASE_DIR / "data" / "raw" / "clinicalVariants.tsv"

OUTPUT_DIR = BASE_DIR / "data" / "processed"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "clinical_variants_cleaned.csv"

print("=" * 60)
print("Loading Clinical Variants Dataset...")
print("=" * 60)

df = pd.read_csv(RAW_DATA, sep="\t")

print(f"Rows    : {df.shape[0]}")
print(f"Columns : {df.shape[1]}")

df.columns = (
    df.columns
      .str.strip()
      .str.lower()
      .str.replace(" ", "_")
      .str.replace("-", "_")
)

duplicates = df.duplicated().sum()

print(f"\nDuplicate Rows : {duplicates}")

df.drop_duplicates(inplace=True)

for column in df.select_dtypes(include="object").columns:
    df[column] = df[column].str.strip()

if "chemicals" in df.columns:
    df["chemicals"] = df["chemicals"].str.title()

if "gene" in df.columns:
    df["gene"] = df["gene"].str.upper()

print("\nMissing Values")
print("-" * 40)

missing = df.isnull().sum()

print(missing[missing > 0])

df.dropna(how="all", inplace=True)

df.reset_index(drop=True, inplace=True)

df.to_csv(OUTPUT_FILE, index=False)

print("\nDataset Successfully Cleaned")

print("-" * 60)

print(f"Final Rows    : {df.shape[0]}")
print(f"Final Columns : {df.shape[1]}")

print(f"\nSaved To :\n{OUTPUT_FILE}")

print("=" * 60)