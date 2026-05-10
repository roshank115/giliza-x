# Giliza X - Data Integration Guide

## Real Medical Datasets

### 1. CheXpert Dataset
Chest X-ray dataset with 224,316 images

**Setup:**
```bash
# Download from Stanford
wget https://download.stanford.edu/datasets/chexpert/CheXpert-v1.0-small.zip

# Extract
unzip CheXpert-v1.0-small.zip -d data/chexpert/
```

**Structure:**
```
data/chexpert/
├── train/
│   ├── patient00000/
│   └── patient00001/
├── valid/
└── test/
```

### 2. MIMIC-CXR Dataset
Medical imaging dataset from MIT

**Setup:**
```bash
# Requires PhysioNet credentials
# https://physionet.org/content/mimic-cxr/2.0.0/

wget -r -N -c -np https://physionet.org/files/mimic-cxr/2.0.0/
```

### 3. Public Health Data
- WHO datasets: https://data.who.int/
- CDC data: https://data.cdc.gov/
- NIH datasets: https://www.nlm.nih.gov/

## Database Seeding

```bash
# Seed with sample data
cd backend
node src/database/seed.js

# Run migrations
node src/database/migrate.js
```

## Real API Integrations

### FHIR API
```javascript
// Connect to FHIR-compliant servers
const FHIR_URL = 'https://fhir.example.com/R4';

const getPatient = async (patientId) => {
  const response = await axios.get(`${FHIR_URL}/Patient/${patientId}`);
  return response.data;
};
```

### Lab Results API
```javascript
// Connect to lab testing systems
const LAB_API = 'https://lab.example.com/api';

const getLabResults = async (patientId) => {
  const response = await axios.get(
    `${LAB_API}/results/${patientId}`,
    { headers: { 'Authorization': `Bearer ${LAB_TOKEN}` } }
  );
  return response.data;
};
```

## Environment Setup

Create `.env` files for each service with real credentials.
