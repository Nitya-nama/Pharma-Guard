import random

from ml.knowledge_base import kb
from ml.synthetic_data.core.constants import EVIDENCE_PRIORITY


DEFAULT_PHENOTYPES = {

    "Metabolism/PK": "Normal Metabolizer",

    "Toxicity": "Standard Toxicity Risk",

    "Dosage": "Standard Dose Response",

    "Efficacy": "Normal Response"

}


class GeneticsGenerator:

    def __init__(self):

        self.kb = kb

    def _select_best_variant(self, variants):

        if len(variants) == 0:

            return None

        variants = sorted(

            variants,

            key=lambda item: EVIDENCE_PRIORITY.get(

                item.get(

                    "level_of_evidence",

                    "4"

                ),

                99

            )

        )

        best_level = variants[0]["level_of_evidence"]

        candidates = [

            item

            for item in variants

            if item["level_of_evidence"] == best_level

        ]

        return random.choice(

            candidates

        )

    def assign(self, patient):

        patient.genes = []

        patient.variants = []

        patient.phenotypes = []

        patient.evidence_levels = []

        patient.primary_gene = ""

        patient.primary_variant = ""

        patient.primary_phenotype = ""

        patient.primary_evidence = ""

        records = []

        processed = set()

        for drug in patient.drugs:

            mappings = self.kb.get_drug_genes(

                drug["drug_name"]

            )

            for mapping in mappings:

                gene = mapping["gene"].strip()

                if gene == "":

                    continue

                if gene in processed:

                    continue

                processed.add(

                    gene

                )

                patient.genes.append(

                    gene

                )

                variants = self.kb.get_gene_variants(

                    gene

                )

                best = self._select_best_variant(

                    variants

                )

                if best is None:

                    patient.variants.append("")

                    patient.phenotypes.append("")

                    patient.evidence_levels.append("")

                    continue

                phenotype = best.get(

                    "phenotypes",

                    ""

                )

                if phenotype == "":

                    phenotype = DEFAULT_PHENOTYPES.get(

                        best.get(

                            "type",

                            ""

                        ),

                        "Unknown"

                    )

                patient.variants.append(

                    best.get(

                        "variant",

                        ""

                    )

                )

                patient.phenotypes.append(

                    phenotype

                )

                patient.evidence_levels.append(

                    best.get(

                        "level_of_evidence",

                        ""

                    )

                )

                records.append({

                    "gene": gene,

                    "variant": best.get(

                        "variant",

                        ""

                    ),

                    "phenotype": phenotype,

                    "evidence": best.get(

                        "level_of_evidence",

                        ""

                    )

                })

        if len(records) == 0:

            return patient

        records = sorted(

            records,

            key=lambda item: EVIDENCE_PRIORITY.get(

                item["evidence"],

                99

            )

        )

        best = records[0]

        patient.primary_gene = best["gene"]

        patient.primary_variant = best["variant"]

        patient.primary_phenotype = best["phenotype"]

        patient.primary_evidence = best["evidence"]

        return patient


genetics_generator = GeneticsGenerator()


if __name__ == "__main__":

    from ml.synthetic_data.generators.demographics import generate_demographics

    from ml.synthetic_data.generators.disease_generator import assign_diseases

    from ml.synthetic_data.generators.drug_assigner import drug_assigner

    for _ in range(5):

        patient = generate_demographics()

        patient = assign_diseases(

            patient

        )

        patient = drug_assigner.assign(

            patient

        )

        patient = genetics_generator.assign(

            patient

        )

        print()

        print(patient.patient_id)

        print("Diseases :", patient.diseases)

        print("Drugs :", patient.assigned_drugs)

        print("Genes :", patient.genes)

        print("Variants :", patient.variants)

        print("Evidence :", patient.evidence_levels)

        print("Primary Gene :", patient.primary_gene)

        print("Primary Variant :", patient.primary_variant)