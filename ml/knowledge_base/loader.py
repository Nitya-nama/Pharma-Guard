from pathlib import Path
from collections import defaultdict
from ml.synthetic_data.core.constants import DISEASE_ATC_MAP
import random
import pandas as pd


class KnowledgeBase:

    def __init__(self):

        self.base_dir = (
            Path(__file__).resolve().parent.parent
        )

        self.data_dir = (
            self.base_dir /
            "data" /
            "processed"
        )

        self._load_data()

        self._build_indexes()

    # ==========================================================
    # DATA LOADING
    # ==========================================================

    def _load_data(self):

        self.drug_master = pd.read_csv(

            self.data_dir /

            "drug_master.csv"

        )

        self.gene_master = pd.read_csv(

            self.data_dir /

            "gene_master.csv"

        )

        self.drug_gene = pd.read_csv(

            self.data_dir /

            "drug_gene_mapping.csv"

        )

        self.variants = pd.read_csv(

            self.data_dir /

            "clinical_variants_cleaned.csv"

        )

    # ==========================================================
    # INDEX BUILDING
    # ==========================================================

    def _build_indexes(self):

        self.drug_lookup = {}

        self.gene_lookup = {}

        self.drug_gene_lookup = defaultdict(list)

        self.gene_variant_lookup = defaultdict(list)

        self.atc_lookup = defaultdict(list)

        self.evidence_lookup = defaultdict(list)

        self.variant_lookup = defaultdict(list)

        self._build_drug_index()

        self._build_gene_index()

        self._build_drug_gene_index()

        self._build_variant_index()

        self._build_atc_index()

        self._build_evidence_index()
        
    # ==========================================================
    # DRUG INDEX
    # ==========================================================

    def _build_drug_index(self):

        for _, row in self.drug_master.iterrows():


            if pd.isna(row["drug_name"]):
                continue
            
            drug = str(

                row["drug_name"]

            ).strip()

            if drug == "":

                continue

            self.drug_lookup[

                drug.lower()

            ] = row.to_dict()

    # ==========================================================
    # GENE INDEX
    # ==========================================================

    def _build_gene_index(self):

        for _, row in self.gene_master.iterrows():

            if pd.isna(row["gene"]):
                continue
            
            gene = str(

                row["gene"]

            ).strip()

            if gene == "":

                continue

            self.gene_lookup[

                gene.upper()

            ] = row.to_dict()

    # ==========================================================
    # DRUG → GENE INDEX
    # ==========================================================

    def _build_drug_gene_index(self):

        for _, row in self.drug_gene.iterrows():
            if pd.isna(row["drug_name"]):
                continue
            drug = str(

                row["drug_name"]

            ).strip()
            
            if pd.isna(row["gene"]):
                continue            

            gene = str(

                row["gene"]

            ).strip()

            if drug == "" or gene == "":

                continue

            self.drug_gene_lookup[

                drug.lower()

            ].append(

                row.to_dict()

            )  
            
        # ==========================================================
    # VARIANT INDEX
    # ==========================================================

    def _build_variant_index(self):

        for _, row in self.variants.iterrows():

            if pd.isna(row["gene"]):
                continue
            
            gene = str(

                row["gene"]

            ).strip()

            if gene == "":

                continue

            self.gene_variant_lookup[

                gene.upper()

            ].append(

                row.to_dict()

            )

            if pd.isna(row["variant"]):
                continue
            variant = str(

                row["variant"]

            ).strip()

            if variant != "":

                self.variant_lookup[

                    variant

                ].append(

                    row.to_dict()

                )

    # ==========================================================
    # ATC INDEX
    # ==========================================================

    def _build_atc_index(self):

        for _, row in self.drug_master.iterrows():

            if pd.isna(row["atc_code"]):
                continue
            atc = str(

                row["atc_code"]

            ).strip()

            if atc == "":

                continue

            for length in (1, 3, 4):

                prefix = atc[:length]

                self.atc_lookup[

                    prefix

                ].append(

                    row.to_dict()

                )          
                
        # ==========================================================
    # EVIDENCE INDEX
    # ==========================================================

    def _build_evidence_index(self):

        for _, row in self.drug_gene.iterrows():

            evidence = str(

                row.get(

                    "level_of_evidence",

                    ""

                )

            ).strip()

            if evidence == "":

                continue

            self.evidence_lookup[

                evidence

            ].append(

                row.to_dict()

            )            
            
        # ==========================================================
    # DRUG LOOKUPS
    # ==========================================================

    def get_drug(self, drug_name):

        if not drug_name:
            return None

        return self.drug_lookup.get(

            str(drug_name).strip().lower()

        )

    def get_all_drugs(self):

        return list(

            self.drug_lookup.values()

        )

    def get_random_drug(self):

        drugs = self.get_all_drugs()

        if not drugs:

            return None

        return random.choice(

            drugs

        )

    def total_drugs(self):

        return len(

            self.drug_lookup

        )

    # ==========================================================
    # ATC LOOKUPS
    # ==========================================================

    def get_drugs_by_atc_prefix(

        self,

        prefix

    ):

        if prefix is None:

            return []

        prefix = str(

            prefix

        ).strip().upper()

        return list(

            self.atc_lookup.get(

                prefix,

                []

            )

        )

    def get_drugs_by_atc(

        self,

        atc

    ):

        return self.get_drugs_by_atc_prefix(

            atc

        )

    # ==========================================================
    # DISEASE LOOKUPS
    # ==========================================================

    def get_drugs_by_disease(self, disease):

        prefixes = DISEASE_ATC_MAP.get(

            disease,

            []

        )

        drugs = []

        seen = set()

        for prefix in prefixes:

            for drug in self.get_drugs_by_atc_prefix(prefix):

                name = drug["drug_name"]

                if name in seen:
                    continue

                seen.add(name)

                drugs.append(drug)

        return drugs

    def get_best_drug(self, disease):

        drugs = self.get_drugs_by_disease(disease)

        if not drugs:
            return None

        scored = []

        for drug in drugs:

            evidence = self.get_best_evidence(
                drug["drug_name"]
            )

            scored.append(
                (
                    self.get_evidence_rank(evidence),
                    drug
                )
            )

        scored.sort(key=lambda x: x[0])

        return scored[0][1]
    
    # ==========================================================
    # GENE LOOKUPS
    # ==========================================================

    def get_gene(

        self,

        gene

    ):

        if not gene:

            return None

        return self.gene_lookup.get(

            str(gene).strip().upper()

        )

    def get_all_genes(self):

        return list(

            self.gene_lookup.values()

        )

    def total_genes(self):

        return len(

            self.gene_lookup

        )

    def get_drug_genes(

        self,

        drug

    ):

        if not drug:

            return []

        return list(

            self.drug_gene_lookup.get(

                str(drug).strip().lower(),

                []

            )

        )

    def get_gene_variants(

        self,

        gene

    ):

        if not gene:

            return []

        return list(

            self.gene_variant_lookup.get(

                str(gene).strip().upper(),

                []

            )

        )        
        
    # ==========================================================
    # VARIANT LOOKUPS
    # ==========================================================

    def get_variant(

        self,

        variant

    ):

        if not variant:

            return []

        return list(

            self.variant_lookup.get(

                variant,

                []

            )

        )

    def total_variants(self):

        return len(

            self.variants

        )    
        
    # ==========================================================
    # EVIDENCE RANKING
    # ==========================================================

    @staticmethod
    def get_evidence_rank(level):

        ranking = {

            "1A": 1,
            "1B": 2,
            "2A": 3,
            "2B": 4,
            "3": 5,
            "4": 6

        }

        return ranking.get(

            str(level).strip(),

            99

        )

    def sort_by_evidence(self, records):

        if not records:

            return []

        return sorted(

            records,

            key=lambda x: self.get_evidence_rank(

                x.get(

                    "level_of_evidence",

                    "4"

                )

            )

        )

    def get_best_evidence(self, drug_name):

        mappings = self.get_drug_genes(

            drug_name

        )

        if len(mappings) == 0:

            return "4"

        mappings = self.sort_by_evidence(

            mappings

        )

        return mappings[0].get(

            "level_of_evidence",

            "4"

        )
        
        # ==========================================================
    # BEST VARIANT
    # ==========================================================

    def get_best_variant(

        self,

        gene

    ):

        variants = self.get_gene_variants(

            gene

        )

        if len(variants) == 0:

            return None

        variants = self.sort_by_evidence(

            variants

        )

        best_level = variants[0].get(

            "level_of_evidence",

            "4"

        )

        best = [

            item

            for item in variants

            if item.get(

                "level_of_evidence",

                "4"

            ) == best_level

        ]

        return random.choice(

            best

        )
        
        # ==========================================================
    # RANDOM HELPERS
    # ==========================================================

    def random_gene(self):

        genes = list(

            self.gene_lookup.values()

        )

        if len(genes) == 0:

            return None

        return random.choice(

            genes

        )

    def random_variant(self):

        if len(self.variants) == 0:

            return None

        row = self.variants.sample(

            1,

            random_state=None

        )

        return row.iloc[0].to_dict()
    
        # ==========================================================
    # SUMMARY
    # ==========================================================

    def summary(self):

        print()

        print("=" * 60)

        print("Knowledge Base Summary")

        print("=" * 60)

        print()

        print(

            "Drug Master       :",

            len(

                self.drug_master

            )

        )

        print(

            "Gene Master       :",

            len(

                self.gene_master

            )

        )

        print(

            "Drug Gene Mapping :",

            len(

                self.drug_gene

            )

        )

        print(

            "Clinical Variants :",

            len(

                self.variants

            )

        )

        print()

        print(

            "Unique Drugs      :",

            self.total_drugs()

        )

        print(

            "Unique Genes      :",

            self.total_genes()

        )

        print(

            "Unique Variants   :",

            self.total_variants()

        )

        print()
        
# ==========================================================
# GLOBAL SINGLETON
# ==========================================================

kb = KnowledgeBase()


