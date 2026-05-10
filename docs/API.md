# Giliza X - API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
All endpoints except `/auth/*` require JWT token:
```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### Authentication

#### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "secure_password",
  "name": "Dr. Smith",
  "role": "doctor"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "secure_password"
}
```

### Triage Engine

#### Submit Triage Assessment
```bash
POST /triage/assess
Content-Type: application/json

{
  "patientName": "John Doe",
  "symptoms": ["chest pain", "difficulty breathing"],
  "vitalSigns": {
    "heartRate": 120,
    "bloodPressure": {"systolic": 180, "diastolic": 110},
    "respiratoryRate": 24,
    "temperature": 38.5,
    "oxygenSaturation": 92
  }
}
```

#### Get Emergency Queue
```bash
GET /triage/queue
```

#### Get High-Risk Alerts
```bash
GET /triage/alerts
```

### X-Ray Analysis

#### Analyze X-Ray
```bash
POST /xray/analyze
Content-Type: multipart/form-data

Form Fields:
- xray: <image_file>
- imageType: "frontal" | "lateral"
- patientId: "patient-123"
```

#### Get Analysis Result
```bash
GET /xray/{analysisId}
```

#### Generate Report from Analysis
```bash
POST /xray/{analysisId}/report
Content-Type: application/json

{}
```

### Medical Reports

#### Generate Report
```bash
POST /reports/generate
Content-Type: application/json

{
  "patientId": "patient-123",
  "patientName": "John Doe",
  "findings": ["Pneumonia in right lobe"],
  "severity": "moderate",
  "recommendations": ["Antibiotics", "Follow-up CT"]
}
```

#### Edit Report
```bash
PUT /reports/{reportId}/edit
Content-Type: application/json

{
  "findings": ["Updated findings"],
  "doctorNotes": "Additional clinical notes"
}
```

#### Export PDF
```bash
GET /reports/{reportId}/pdf
```

### AI Analysis

#### Patient Analysis
```bash
POST /ai/patient-analysis
Content-Type: application/json

{
  "patientId": "patient-123",
  "symptoms": ["fever", "cough"],
  "vitalSigns": {
    "heartRate": 90,
    "temperature": 38,
    "oxygenSaturation": 95
  }
}
```

#### Get Risk Score
```bash
GET /ai/risk-score/{patientId}
```

#### AI Reasoning
```bash
POST /ai/reasoning
Content-Type: application/json

{
  "analysisId": "analysis-123",
  "question": "Why was pneumonia predicted?"
}
```

### Offline Mode

#### Store Offline Data
```bash
POST /offline/store
Content-Type: application/json

{
  "deviceId": "device-abc123",
  "dataType": "patient_scan",
  "data": {...}
}
```

#### Sync Data
```bash
POST /offline/sync
Content-Type: application/json

{
  "deviceId": "device-abc123"
}
```

#### Get Offline Status
```bash
GET /offline/status/{deviceId}
```

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {...}
}
```

### Error Response
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
