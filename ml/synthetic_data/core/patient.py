from dataclasses import dataclass, field


@dataclass
class Patient:

    patient_id: str = ""

    age: int = 0
    gender: str = ""
    ethnicity: str = ""

    height_cm: float = 0.0
    weight_kg: float = 0.0
    bmi: float = 0.0

    smoking_status: str = ""
    alcohol_consumption: str = ""
    physical_activity: str = ""

    lifestyle_score: int = 0

    diabetes: bool = False
    hypertension: bool = False
    kidney_disease: bool = False
    liver_disease: bool = False
    heart_disease: bool = False

    diseases: list = field(default_factory=list)
    disease_count: int = 0

    drugs: list = field(default_factory=list)

    drug_id: str = ""
    drug_name: str = ""
    atc_code: str = ""

    assigned_drugs: list = field(default_factory=list)
    drug_count: int = 0

    genes: list = field(default_factory=list)
    variants: list = field(default_factory=list)
    phenotypes: list = field(default_factory=list)
    evidence_levels: list = field(default_factory=list)

    primary_gene: str = ""
    primary_variant: str = ""
    primary_phenotype: str = ""
    primary_evidence: str = ""

    disease_score: int = 0
    pharmacogenomic_score: int = 0
    polypharmacy_score: int = 0
    evidence_score: int = 0

    risk_score: float = 0.0
    risk_level: str = ""
    confidence: float = 0.0

    def to_dict(self):

        return self.__dict__.copy()