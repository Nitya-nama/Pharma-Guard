from typing import Dict, List, Set

from ml.knowledge_base import kb


class GeneticsGenerator:
    """
    Pharmacogenomics Generator

    Responsibilities
    ----------------
    1. Drug → Gene mapping
    2. Gene → Variant mapping
    3. Variant prioritization
    4. Evidence aggregation
    """

    def __init__(self):

        self.kb = kb

    # --------------------------------------------------------
    # Drug -> Gene
    # --------------------------------------------------------

    def _collect_genes(

        self,

        patient

    ) -> List[str]:

        genes: Set[str] = set()

        for drug in patient.drugs:

            mappings = self.kb.get_drug_genes(

                drug["drug_name"]

            )

            for item in mappings:

                gene = str(

                    item.get(

                        "gene",

                        ""

                    )

                ).strip()

                if gene:

                    genes.add(

                        gene.upper()

                    )

        genes = sorted(genes)

        MAX_GENES = 12

        return genes[:MAX_GENES]
        
    # --------------------------------------------------------
    # Gene -> Variant
    # --------------------------------------------------------

    def _collect_variants(

        self,

        genes

    ):

        records = []

        for gene in genes:

            variant = self.kb.get_best_variant(

                gene

            )

            if variant is None:

                continue

            records.append(

                variant

            )

        return records
    
        # --------------------------------------------------------
    # Evidence Sort
    # --------------------------------------------------------

    def _sort_records(

        self,

        records

    ):

        return sorted(

            records,

            key=lambda item:

                self.kb.get_evidence_rank(

                    item.get(

                        "level_of_evidence",

                        "4"

                    )

                )

        )
        
        # --------------------------------------------------------
    # Remove Duplicate Variants
    # --------------------------------------------------------

    def _unique_records(

        self,

        records

    ):

        unique = []

        seen = set()

        for record in records:

            variant = record.get(

                "variant",

                ""

            )

            if variant in seen:

                continue

            seen.add(

                variant

            )

            unique.append(

                record

            )

        return unique
    
        # --------------------------------------------------------
    # Public API
    # --------------------------------------------------------

    def assign(self, patient):

        # Reset genetics fields
        patient.genes = []
        patient.variants = []
        patient.phenotypes = []
        patient.evidence_levels = []

        patient.primary_gene = ""
        patient.primary_variant = ""
        patient.primary_phenotype = ""
        patient.primary_evidence = ""

        # No drugs → no genetics
        if patient.drug_count == 0:

            return patient

        # ----------------------------
        # Collect Genes
        # ----------------------------

        genes = self._collect_genes(
            patient
        )

        patient.genes = genes

        # ----------------------------
        # Collect Variants
        # ----------------------------

        records = self._collect_variants(
            genes
        )

        records = self._unique_records(
            records
        )

        records = self._sort_records(
            records
        )

        if len(records) == 0:

            return patient

        # ----------------------------
        # Populate Patient
        # ----------------------------

        for record in records:

            variant = str(
                record.get("variant", "")
            ).strip()

            # Keep only the first listed allele
            if "," in variant:
                variant = variant.split(",")[0].strip()

            variant = str(
                record.get(
                    "variant",
                    ""
                )
            ).strip()

            # Keep only the first allele
            if "," in variant:
                variant = variant.split(",")[0].strip()

            patient.variants.append(
                variant
            )

            phenotype = str(
                record.get(
                    "phenotypes",
                    ""
                )
            ).strip()

            if phenotype == "" or phenotype.lower() == "nan":

                phenotype = "Unknown"

            patient.phenotypes.append(
                phenotype
            )

            patient.evidence_levels.append(

                record.get(
                    "level_of_evidence",
                    ""
                )

            )

        # ----------------------------
        # Primary Record
        # ----------------------------

        primary = records[0]

        patient.primary_gene = primary.get(
            "gene",
            ""
        )

        primary_variant = str(
            primary.get(
                "variant",
                ""
            )
        ).strip()

        if "," in primary_variant:
            primary_variant = primary_variant.split(",")[0].strip()

        patient.primary_variant = primary_variant

        phenotype = str(
            primary.get(
                "phenotypes",
                ""
            )
        ).strip()

        if phenotype == "" or phenotype.lower() == "nan":

            phenotype = "Unknown"

        patient.primary_phenotype = phenotype

        if phenotype is None:
            phenotype = ""

        if str(phenotype).lower() == "nan":
            phenotype = ""

        patient.primary_phenotype = phenotype

        patient.primary_evidence = primary.get(
            "level_of_evidence",
            ""
        )

        return patient
    
genetics_generator = GeneticsGenerator()


def assign_genetics(patient):

    return genetics_generator.assign(
        patient
    )
    
    
if __name__ == "__main__":

    from ml.synthetic_data.generators.demographics import generate_demographics
    from ml.synthetic_data.generators.disease_generator import assign_diseases
    from ml.synthetic_data.generators.drug_assigner import assign_drugs

    for i in range(5):

        patient = generate_demographics()

        patient = assign_diseases(
            patient
        )

        patient = assign_drugs(
            patient
        )

        patient = assign_genetics(
            patient
        )

        print()

        print("=" * 70)
        print("PATIENT", i + 1)
        print("=" * 70)

        print("Diseases :", patient.diseases)
        print("Drugs    :", patient.assigned_drugs)
        print("Genes    :", patient.genes)
        print("Variants :", patient.variants)
        print("Evidence :", patient.evidence_levels)

        print()

        print("Primary Gene      :", patient.primary_gene)
        print("Primary Variant   :", patient.primary_variant)
        print("Primary Evidence  :", patient.primary_evidence)
        print("Primary Phenotype :", patient.primary_phenotype)            