# Giliza X - AI Healthcare Intelligence Platform 🏥

## Top 5 Core Features MVP

### 1️⃣ AI Emergency Triage Engine
- Real-time patient urgency scoring (Red/Yellow/Green)
- Emergency queue management
- AI-powered risk detection
- High-risk alerts and escalation

### 2️⃣ Chest X-Ray AI Platform
- AI-assisted chest scan analysis
- Pneumonia & TB detection
- Lung opacity detection
- Severity scoring with heatmaps

### 3️⃣ Offline AI Healthcare Infrastructure
- Edge AI inference without internet
- Local scan processing
- Sync when online
- Portable clinic mode

### 4️⃣ AI Medical Report Generator
- Automated radiology report generation
- Multilingual support
- Doctor editing & customization
- PDF export

### 5️⃣ Multimodal Healthcare AI Brain
- Unified patient data intelligence
- Image + symptom + vitals integration
- AI reasoning & risk prediction
- Doctor co-pilot assistance

---

## Tech Stack

### Backend
- **Node.js + Express** - REST API
- **Python FastAPI** - AI/ML microservice
- **PostgreSQL** - Database
- **Redis** - Caching & real-time data

### Frontend
- **Next.js + React + TypeScript** - Web app
- **Tailwind CSS** - Styling
- **Socket.io** - Real-time updates

### ML/AI
- **TensorFlow/PyTorch** - Model inference
- **OpenCV** - Image processing
- **ONNX** - Model optimization

### DevOps
- **Docker & Docker Compose**
- **PostgreSQL + Redis**
- **Nginx** - Reverse proxy

---

## Quick Start

```bash
# Clone & Setup
git clone https://github.com/roshank115/giliza-x.git
cd giliza-x

# Using Docker (Recommended)
docker-compose up -d

# Or manual setup
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install Python AI service
cd ../ai-service
pip install -r requirements.txt
```

### Access Points
- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **AI Service**: http://localhost:8000
- **Swagger Docs**: http://localhost:4000/api/docs

---

## Project Structure

```
gre-x/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   └── services/       # External integrations
│   └── package.json
├── frontend/               # Next.js React app
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── package.json
├── ai-service/            # Python FastAPI
│   ├── models/            # Pre-trained models
│   ├── inference/         # ML inference
│   └── requirements.txt
├── docker-compose.yml
└── docs/
```

---

## API Endpoints

### Triage Engine
- `POST /api/triage/assess` - Submit patient for triage
- `GET /api/triage/queue` - Get current emergency queue
- `GET /api/triage/alerts` - Get high-risk alerts

### Chest X-Ray AI
- `POST /api/xray/analyze` - Analyze chest X-ray image
- `GET /api/xray/results/:id` - Get analysis results
- `POST /api/xray/report` - Generate report from analysis

### Offline Mode
- `GET /api/offline/sync` - Sync offline data
- `POST /api/offline/store` - Store data locally

### Medical Reports
- `POST /api/reports/generate` - Generate medical report
- `PUT /api/reports/:id/edit` - Edit report
- `GET /api/reports/:id/pdf` - Export as PDF

### Multimodal AI
- `POST /api/ai/patient-analysis` - Comprehensive patient analysis
- `GET /api/ai/risk-score/:patientId` - Get AI risk prediction
- `POST /api/ai/reasoning` - Get AI reasoning explanation

---

## Database Schema

See `docs/DATABASE.md` for full schema documentation.

Key tables:
- `patients` - Patient demographics
- `encounters` - Hospital visits
- `scans` - Medical imaging data
- `triage_records` - Triage assessments
- `reports` - Generated medical reports
- `ai_predictions` - AI model predictions

---

## Real Data Integration

### Datasets
- **CheXpert**: Chest X-ray dataset (224k images)
- **MIMIC-CXR**: Medical imaging dataset
- **Public Health Data**: WHO, CDC datasets

See `docs/DATA_INTEGRATION.md` for setup.

---

## Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd ai-service && pytest
```

---

## Environment Variables

Create `.env` files in each service directory. See `.env.example` files.

---

## Contributing

Please read `CONTRIBUTING.md` before submitting PRs.

---

## License

MIT License - See LICENSE file

---

**Built with ❤️ for global healthcare access**
