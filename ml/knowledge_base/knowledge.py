import random

from ml.knowledge_base import kb


class Knowledge:

    def __init__(self):

        self.kb = kb

    def get_drug(self, drug_name):

        return self.kb.drug_lookup.get(

            drug_name.lower()

        )

    def get_gene(self, gene):

        return self.kb.gene_lookup.get(

            gene.upper(),

            []

        )

    def get_drug_genes(self, drug_name):

        return self.kb.drug_gene_lookup.get(

            drug_name.lower(),

            []

        )

    def get_gene_variants(self, gene):

        return self.kb.gene_variant_lookup.get(

            gene.upper(),

            []

        )

    def get_drugs_by_atc_prefix(self, prefix):

        prefix = prefix.upper()

        matches = self.kb.drug_master[

            self.kb.drug_master["atc_code"]

            .astype(str)

            .str.startswith(prefix)

        ]

        return matches.to_dict(

            "records"

        )

    def random_drug(self, prefix):

        drugs = self.get_drugs_by_atc_prefix(

            prefix

        )

        if len(drugs) == 0:

            return None

        return random.choice(

            drugs

        )


knowledge = Knowledge()


if __name__ == "__main__":

    kb.summary()

    print()

    print(

        knowledge.get_drug(

            "Warfarin"

        )

    )

    print()

    print(

        knowledge.get_drug_genes(

            "Warfarin"

        )

    )

    print()

    print(

        knowledge.get_gene_variants(

            "CYP2C9"

        )[:2]

    )

    print()

    print(

        knowledge.random_drug(

            "C09"

        )

    )