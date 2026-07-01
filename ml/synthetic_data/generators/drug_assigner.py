from collections import defaultdict
from typing import Dict, List
import random

from ml.knowledge_base import kb


class DrugAssigner:
    """
    Production Drug Assignment Engine

    Responsibilities
    ----------------
    1. Retrieve disease-specific drug candidates
    2. Rank by PharmGKB evidence
    3. Preserve therapeutic diversity
    4. Generate realistic polypharmacy
    """

    # Higher value = more likely to be selected
    EVIDENCE_WEIGHTS = {

        "1A": 50,

        "1B": 25,

        "2A": 15,

        "2B": 7,

        "3": 2,

        "4": 1

    }

    def __init__(self):

        self.kb = kb

    # --------------------------------------------------------
    # Disease → Drug Candidates
    # --------------------------------------------------------

    def _candidate_drugs(

        self,

        patient

    ) -> List[Dict]:

        candidates = []

        seen = set()

        for disease in patient.diseases:

            drugs = self.kb.get_drugs_by_disease(

                disease

            )

            for drug in drugs:

                name = drug["drug_name"]

                if name in seen:
                    continue

                seen.add(name)

                candidates.append(drug)

        return candidates
    
        # --------------------------------------------------------
    # Evidence Weight
    # --------------------------------------------------------

    def _drug_weight(

        self,

        drug

    ):

        evidence = self.kb.get_best_evidence(

            drug["drug_name"]

        )

        return self.EVIDENCE_WEIGHTS.get(

            evidence,

            1

        )

    # --------------------------------------------------------
    # Weighted Sampling
    # --------------------------------------------------------

    def _weighted_choice(

        self,

        drugs

    ):

        if len(drugs) == 0:

            return None

        weights = [

            self._drug_weight(

                drug

            )

            for drug in drugs

        ]

        return random.choices(

            drugs,

            weights=weights,

            k=1

        )[0]
        
        # --------------------------------------------------------
    # Therapeutic Diversity
    # --------------------------------------------------------

    def _same_group(

        self,

        drug1,

        drug2

    ):

        atc1 = str(

            drug1.get(

                "atc_code",

                ""

            )

        )

        atc2 = str(

            drug2.get(

                "atc_code",

                ""

            )

        )

        if len(atc1) < 3 or len(atc2) < 3:

            return False

        return atc1[:3] == atc2[:3]

    def _diverse_candidates(

        self,

        selected,

        candidates

    ):

        remaining = []

        for drug in candidates:

            duplicate = False

            for existing in selected:

                if self._same_group(

                    drug,

                    existing

                ):

                    duplicate = True

                    break

            if duplicate:

                continue

            remaining.append(

                drug

            )

        if len(remaining):

            return remaining

        return candidates
    
    # --------------------------------------------------------
    # Polypharmacy Rules
    # --------------------------------------------------------

    def _target_drug_count(self, patient):

        count = patient.disease_count

        if count == 0:
            return 0

        if count == 1:
            return random.choice([1, 2])

        if count == 2:
            return random.choice([2, 3])

        if count == 3:
            return random.choice([3, 4])

        return random.choice([4, 5])

    # --------------------------------------------------------
    # Drug Selection
    # --------------------------------------------------------

    def _select_drugs(

        self,

        patient,

        candidates

    ):

        selected = []

        remaining = candidates.copy()

        target = self._target_drug_count(

            patient

        )

        while (

            len(selected) < target

            and

            len(remaining) > 0

        ):

            pool = self._diverse_candidates(

                selected,

                remaining

            )

            drug = self._weighted_choice(

                pool

            )

            if drug is None:

                break

            selected.append(

                drug

            )

            remaining = [

                item

                for item in remaining

                if item["drug_name"]

                !=

                drug["drug_name"]

            ]

        return selected    
    
    
        # --------------------------------------------------------
    # Genetic Coverage
    # --------------------------------------------------------

    def _prioritize_genetic_drugs(

        self,

        drugs

    ):

        informative = []

        non_informative = []

        for drug in drugs:

            genes = self.kb.get_drug_genes(

                drug["drug_name"]

            )

            if len(genes):

                informative.append(

                    drug

                )

            else:

                non_informative.append(

                    drug

                )

        random.shuffle(

            informative

        )

        random.shuffle(

            non_informative

        )

        return informative + non_informative
    
        # --------------------------------------------------------
    # Primary Drug
    # --------------------------------------------------------

    def _primary_drug(

        self,

        drugs

    ):

        if len(drugs) == 0:

            return None

        scored = []

        for drug in drugs:

            evidence = self.kb.get_best_evidence(

                drug["drug_name"]

            )

            scored.append(

                (

                    self.kb.get_evidence_rank(

                        evidence

                    ),

                    drug

                )

            )

        scored.sort(

            key=lambda x: x[0]

        )

        return scored[0][1]
    
        # --------------------------------------------------------
    # Public API
    # --------------------------------------------------------

    def assign(self, patient):

        # Reset patient drug fields
        patient.drugs = []
        patient.assigned_drugs = []

        patient.drug_count = 0

        patient.drug_id = ""
        patient.drug_name = ""
        patient.atc_code = ""

        # No diseases → no drugs
        if patient.disease_count == 0:

            return patient

        # Retrieve candidates
        candidates = self._candidate_drugs(
            patient
        )

        if len(candidates) == 0:

            return patient

        # Prefer genetically informative drugs
        candidates = self._prioritize_genetic_drugs(
            candidates
        )

        # Select drugs
        selected = self._select_drugs(
            patient,
            candidates
        )

        if len(selected) == 0:

            return patient

        patient.drugs = selected

        patient.assigned_drugs = [

            drug["drug_name"]

            for drug in selected

        ]

        patient.drug_count = len(
            selected
        )

        primary = self._primary_drug(
            selected
        )

        if primary is not None:

            patient.drug_id = primary.get(
                "drug_id",
                ""
            )

            patient.drug_name = primary.get(
                "drug_name",
                ""
            )

            patient.atc_code = primary.get(
                "atc_code",
                ""
            )

        return patient
    
# --------------------------------------------------------
# Singleton
# --------------------------------------------------------

drug_assigner = DrugAssigner()


def assign_drugs(patient):

    return drug_assigner.assign(
        patient
    )
