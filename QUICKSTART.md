# Giliza X - Quick Start Guide 🚀

## ⚡ 5-Minute Setup

### Prerequisites
- Docker & Docker Compose
- Git
- 4GB RAM minimum
- 20GB disk space

### Step 1: Clone Repository
```bash
git clone https://github.com/roshank115/giliza-x.git
cd giliza-x
```

### Step 2: Start Everything with Docker
```bash
# Build and start all services
docker-compose up -d

# Wait 30 seconds for services to initialize
sleep 30

# Check status
docker-compose ps
```

### Step 3: Access the Application

| Service | URL | Purpose |
|---------|-----|----------|
| **Frontend** | http://localhost:3000 | Web application |
| **Backend API** | http://localhost:4000 | REST API |
| **AI Service** | http://localhost:8000 | ML inference |
| **API Docs** | http://localhost:4000/api/docs | Swagger UI |
| **Database** | localhost:5432 | PostgreSQL |

### Step 4: Test Features

#### 1️⃣ Emergency Triage (Red/Yellow/Green)
```bash
curl -X POST http://localhost:4000/api/triage/assess \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "symptoms": ["chest pain", "shortness of breath"],
    "vitalSigns": {
      "heartRate": 120,
      "bloodPressure": {"systolic": 180, "diastolic": 110},
      "respiratoryRate": 24,
      "temperature": 38.5,
      "oxygenSaturation": 92
    }
  }'
```

#### 2️⃣ Chest X-Ray Analysis
```bash
# Upload and analyze X-ray
curl -X POST http://localhost:4000/api/xray/analyze \
  -F "xray=@path/to/xray.jpg" \
  -F "imageType=frontal" \
  -F "patientId=patient-123"
```

#### 3️⃣ AI Patient Analysis
```bash
curl -X POST http://localhost:4000/api/ai/patient-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-123",
    "symptoms": ["fever", "cough"],
    "vitalSigns": {
      "heartRate": 90,
      "temperature": 38,
      "oxygenSaturation": 95
    }
  }'
```

#### 4️⃣ Medical Report Generation
```bash
curl -X POST http://localhost:4000/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-123",
    "patientName": "John Doe",
    "findings": ["Pneumonia detected", "Right lower lobe infiltration"],
    "severity": "moderate",
    "recommendations": ["Antibiotics", "Follow-up CT in 6 weeks"]
  }'
```

#### 5️⃣ Offline Sync
```bash
curl -X POST http://localhost:4000/api/offline/sync \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "device-123"}'
```

---

## 🛑 Troubleshooting

### Ports Already in Use
```bash
# Change ports in docker-compose.yml
# Then restart
docker-compose restart
```

### Services Not Starting
```bash
# Check logs
docker-compose logs backend
docker-compose logs ai-service
docker-compose logs frontend

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Connection Error
```bash
# Wait for PostgreSQL to be ready
sleep 10
docker-compose restart backend
```

### Out of Memory
```bash
# Increase Docker memory limit
# Docker Desktop Settings → Resources → Memory: 4GB+
```

---

## 📁 Manual Setup (Without Docker)

### Backend Setup
```bash
cd backend
npm install

# Create .env from .env.example
cp .env.example .env

# Start PostgreSQL locally
# Update DATABASE_URL in .env

# Run migrations
node src/database/migrate.js

# Seed sample data
node src/database/seed.js

# Start server
npm run dev
# Server: http://localhost:4000
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env.local
cp .env.example .env.local

# Update NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Start dev server
npm run dev
# App: http://localhost:3000
```

### AI Service Setup
```bash
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env from .env.example
cp .env.example .env

# Start server
python main.py
# Service: http://localhost:8000
```

---

## 🔑 Key Features Included

### 1️⃣ Emergency Triage Engine
- ✅ Real-time AI urgency scoring
- ✅ Red/Yellow/Green priority system
- ✅ Queue management
- ✅ Risk factor detection
- ✅ WebSocket real-time alerts

### 2️⃣ Chest X-Ray AI Platform
- ✅ Image upload & analysis
- ✅ Pneumonia detection
- ✅ TB screening
- ✅ Severity scoring
- ✅ Heatmap visualization

### 3️⃣ Offline Healthcare Infrastructure
- ✅ Edge AI inference (no internet needed)
- ✅ Local data storage
- ✅ Sync when online
- ✅ Device management
- ✅ Model downloads

### 4️⃣ AI Medical Report Generator
- ✅ Automated findings generation
- ✅ Severity assessment
- ✅ Multilingual support
- ✅ PDF export
- ✅ Doctor editing

### 5️⃣ Multimodal Healthcare AI Brain
- ✅ Image + symptom + vitals analysis
- ✅ Risk prediction
- ✅ Condition detection
- ✅ AI reasoning explanation
- ✅ Doctor co-pilot assistance

---

## 📊 Real Data Integration

### Connect to Real Datasets
```bash
# CheXpert X-ray dataset (224k images)
cd data
wget https://download.stanford.edu/datasets/chexpert/CheXpert-v1.0-small.zip
unzip CheXpert-v1.0-small.zip
```

### Connect to Real APIs

Update backend `.env`:
```env
# FHIR API
FHIR_SERVER_URL=https://your-fhir-server.com
FHIR_AUTH_TOKEN=your-token

# Lab Results
LAB_API_URL=https://your-lab-api.com
LAB_API_KEY=your-key

# Hospital System
HIS_SERVER_URL=https://your-his.com
HIS_API_KEY=your-key
```

---

## 🚀 Deployment

### Deploy to AWS
```bash
# Using ECS Fargate
aws ecs create-service --cluster giliza-x --service-name giliza-backend --task-definition giliza-backend

# Using EKS (Kubernetes)
kubectl apply -f k8s/deployment.yaml
```

### Deploy to Heroku
```bash
# Create app
heroku create giliza-x

# Deploy
git push heroku main
```

### Deploy to GCP
```bash
# Using Cloud Run
gcloud run deploy giliza-backend --source .

# Using App Engine
gcloud app deploy
```

---

## 🔐 Security

### Change Default Credentials
```bash
# Update in docker-compose.yml
POSTGRES_PASSWORD: your-secure-password
JWT_SECRET: your-secret-key

# Update AI service
AI_API_KEY: your-api-key
```

### Enable HTTPS
```bash
# Generate SSL certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/private.key \
  -out nginx/ssl/certificate.crt

# Update nginx.conf for SSL
```

---

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Load balance with Nginx (configured)
```

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_patient_id ON medical_scans(patient_id);
CREATE INDEX idx_triage_timestamp ON triage_records(timestamp);
CREATE INDEX idx_urgency_level ON triage_records(urgency_level);
```

---

## 📞 Support

- **Issues**: https://github.com/roshank115/giliza-x/issues
- **Documentation**: See `docs/` folder
- **API Docs**: http://localhost:4000/api/docs

---

## 📄 License

MIT License - See LICENSE file

---

**Built with ❤️ for global healthcare access**
