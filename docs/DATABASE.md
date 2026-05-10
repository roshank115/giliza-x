# Giliza X - Database Schema

## Tables

### patients
Store patient demographic information

```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    blood_type VARCHAR(5),
    address TEXT,
    medical_history JSONB DEFAULT '[]',
    allergies JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### triage_records
Store emergency triage assessments

```sql
CREATE TABLE triage_records (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    urgency_level VARCHAR(10),
    urgency_score INTEGER,
    risk_factors JSONB,
    vital_signs JSONB,
    symptoms JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending'
);
```

### medical_scans
Store medical imaging data

```sql
CREATE TABLE medical_scans (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    scan_type VARCHAR(100),
    file_path VARCHAR(500),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analyzed BOOLEAN DEFAULT false,
    ai_analysis JSONB
);
```

### ai_predictions
Store AI model predictions

```sql
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    analysis_type VARCHAR(100),
    prediction_data JSONB,
    confidence_score NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### medical_reports
Store generated medical reports

```sql
CREATE TABLE medical_reports (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    report_type VARCHAR(100),
    content TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP
);
```

## Indexes

```sql
CREATE INDEX idx_patient_id ON medical_scans(patient_id);
CREATE INDEX idx_triage_timestamp ON triage_records(timestamp);
CREATE INDEX idx_urgency_level ON triage_records(urgency_level);
```
