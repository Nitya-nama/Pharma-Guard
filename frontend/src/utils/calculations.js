/**
 * Calculate BMI from weight in kg and height in cm
 */
export const calculateBMI = (weightKg, heightCm) => {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  if (!w || !h || h <= 0) return 0;
  const heightMeters = h / 100;
  const bmi = w / (heightMeters * heightMeters);
  return parseFloat(bmi.toFixed(1));
};

/**
 * Auto-calculate clinical & PGx derived indicators required by backend validation schema
 */
export const derivePatientMetrics = (formData) => {
  const {
    diabetes = false,
    hypertension = false,
    kidney_disease = false,
    liver_disease = false,
    heart_disease = false,
    primary_evidence = '1A',
  } = formData;

  const diseaseCount = [diabetes, hypertension, kidney_disease, liver_disease, heart_disease].filter(Boolean).length;
  const highRiskDiseaseCount = [kidney_disease, liver_disease, heart_disease].filter(Boolean).length;
  const multimorbidity = diseaseCount >= 2 ? 1 : 0;
  
  const strongPgxEvidences = ['1A', '1B', '2A'];
  const strongPgx = strongPgxEvidences.includes(primary_evidence?.toUpperCase()) ? 1 : 0;

  return {
    disease_count: diseaseCount,
    high_risk_disease: highRiskDiseaseCount,
    multimorbidity: multimorbidity,
    strong_pgx: strongPgx,
  };
};

/**
 * Format timestamps into human readable string
 */
export const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return isoString;
  }
};
