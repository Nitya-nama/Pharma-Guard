from pathlib import Path

import pandas as pd


class KnowledgeBase:

    def __init__(self):

        base_path = Path(__file__).resolve().parent.parent

        data_path = base_path / "data" / "processed"

        self.drug_master = self._load_csv(
            data_path / "drug_master.csv"
        )

        self.gene_master = self._load_csv(
            data_path / "gene_master.csv"
        )

        self.drug_gene_mapping = self._load_csv(
            data_path / "drug_gene_mapping.csv"
        )

        self.clinical_variants = self._load_csv(
            data_path / "clinical_variants_cleaned.csv"
        )

        self.drug_atc = self._load_csv(
            data_path / "drug_atc_cleaned.csv"
        )

        self._build_indexes()

    def _load_csv(self, path):

        df = pd.read_csv(
            path,
            keep_default_na=False
        )

        df.fillna("", inplace=True)

        return df

    def _build_indexes(self):

        self.drug_lookup = {}

        self.gene_lookup = {}

        self.drug_gene_lookup = {}

        self.gene_variant_lookup = {}

        self.atc_lookup = {}

        for _, row in self.drug_master.iterrows():

            drug = row["drug_name"].strip().lower()

            self.drug_lookup[drug] = row.to_dict()

        for _, row in self.gene_master.iterrows():

            gene = row["gene"].strip().upper()

            self.gene_lookup.setdefault(

                gene,

                []

            ).append(

                row.to_dict()

            )

        for _, row in self.drug_gene_mapping.iterrows():

            drug = row["drug_name"].strip().lower()

            self.drug_gene_lookup.setdefault(

                drug,

                []

            ).append(

                row.to_dict()

            )

        for _, row in self.clinical_variants.iterrows():

            gene = row["gene"].strip().upper()

            self.gene_variant_lookup.setdefault(

                gene,

                []

            ).append(

                row.to_dict()

            )

        for _, row in self.drug_atc.iterrows():

            self.atc_lookup[

                row["atc_code"]

            ] = row.to_dict()

    def summary(self):

        print()

        print("Drug Master :", len(self.drug_master))

        print("Gene Master :", len(self.gene_master))

        print("Drug Gene Mapping :", len(self.drug_gene_mapping))

        print("Clinical Variants :", len(self.clinical_variants))

        print("Drug ATC :", len(self.drug_atc))
        
    def get_drugs_by_atc_prefix(self, prefix):

        prefix = prefix.upper()

        matches = self.drug_master[

            self.drug_master["atc_code"]

            .astype(str)

            .str.startswith(prefix)

        ]

        return matches.to_dict(
            "records"
        )    
    
    def get_drug_genes(self, drug_name):

        return self.drug_gene_lookup.get(

            drug_name.strip().lower(),

            []

        )


    def get_gene_variants(self, gene):

        return self.gene_variant_lookup.get(

            gene.strip().upper(),

            []

        )    