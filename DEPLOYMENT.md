# 🏥 Giliza X - Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] SSL certificates installed
- [ ] Monitoring setup (Prometheus, ELK)
- [ ] Load balancer configured
- [ ] Auto-scaling policies defined
- [ ] Disaster recovery plan ready
- [ ] HIPAA/compliance requirements met

## Environment Configuration

### Production .env Files

**backend/.env**
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:password@db.production.com:5432/giliza_prod
REDIS_URL=redis://cache.production.com:6379
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
AI_SERVICE_URL=https://api.production.com:8000
FRONTEND_URL=https://app.production.com
LOG_LEVEL=info
```

**ai-service/.env**
```env
PYTHONUNBUFFEREDBehavior=1
API_PORT=8000
LOG_LEVEL=info
MODEL_CACHE_DIR=/models
```

## Database Setup

### PostgreSQL Production Setup

```bash
# Connect to managed database
export DATABASE_URL=postgresql://user:password@your-db-endpoint:5432/giliza_prod

# Run migrations
node src/database/migrate.js

# Create backups
psql $DATABASE_URL -c "BACKUP DATABASE giliza_prod TO 's3://backups/giliza/'"
```

### Redis Production Setup

```bash
# Use managed Redis service (AWS ElastiCache, GCP Memorystore, etc.)
# Or self-hosted with replication

# Configure Redis cluster
redis-cli CLUSTER MEET 127.0.0.1 7000
redis-cli CLUSTER ADDSLOTS {0..5460}
```

## Docker Deployment

### Build Production Images

```bash
# Build with optimization
docker build -f backend/Dockerfile -t giliza-backend:latest backend/
docker build -f frontend/Dockerfile -t giliza-frontend:latest frontend/
docker build -f ai-service/Dockerfile -t giliza-ai:latest ai-service/

# Tag for registry
docker tag giliza-backend:latest your-registry/giliza-backend:latest
docker tag giliza-frontend:latest your-registry/giliza-frontend:latest
docker tag giliza-ai:latest your-registry/giliza-ai:latest

# Push to registry
docker push your-registry/giliza-backend:latest
docker push your-registry/giliza-frontend:latest
docker push your-registry/giliza-ai:latest
```

## Kubernetes Deployment

### Create k8s deployment files

**k8s/backend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: giliza-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: giliza-backend
  template:
    metadata:
      labels:
        app: giliza-backend
    spec:
      containers:
      - name: backend
        image: your-registry/giliza-backend:latest
        ports:
        - containerPort: 4000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: giliza-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: giliza-secrets
              key: jwt-secret
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1024Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
```

### Deploy to Kubernetes

```bash
# Create secrets
kubectl create secret generic giliza-secrets \
  --from-literal=database-url=$DATABASE_URL \
  --from-literal=jwt-secret=$JWT_SECRET

# Deploy
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ai-deployment.yaml

# Create service
kubectl apply -f k8s/service.yaml

# Check status
kubectl get deployments
kubectl get pods
```

## Load Balancing & Reverse Proxy

### Nginx Configuration (Production)

```nginx
upstream backend_pool {
    least_conn;
    server backend-1:4000 weight=5;
    server backend-2:4000 weight=5;
    server backend-3:4000 weight=5;
}

server {
    listen 443 ssl http2;
    server_name api.production.com;

    ssl_certificate /etc/nginx/ssl/certificate.crt;
    ssl_certificate_key /etc/nginx/ssl/private.key;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Compression
    gzip on;
    gzip_types application/json text/plain;

    location / {
        proxy_pass http://backend_pool;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Rate limiting
        limit_req zone=api burst=100 nodelay;
    }
}
```

## Monitoring & Logging

### Prometheus Metrics

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'giliza-backend'
    static_configs:
      - targets: ['localhost:4000']
  
  - job_name: 'giliza-ai'
    static_configs:
      - targets: ['localhost:8000']
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

```json
// logstash.conf
input {
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  if [type] == "application" {
    mutate {
      add_field => { "[@metadata][index_name]" => "giliza-logs-%{+YYYY.MM.dd}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "%{[@metadata][index_name]}"
  }
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker images
        run: |
          docker build -t giliza-backend:${{ github.sha }} backend/
          docker build -t giliza-frontend:${{ github.sha }} frontend/
      
      - name: Push to registry
        run: |
          docker push your-registry/giliza-backend:${{ github.sha }}
          docker push your-registry/giliza-frontend:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/giliza-backend \
            backend=your-registry/giliza-backend:${{ github.sha }}
```

## Auto-Scaling

### Kubernetes Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: giliza-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: giliza-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Disaster Recovery

### Database Backup Strategy

```bash
# Automated daily backup
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/giliza-$(date +\%Y\%m\%d).sql.gz

# Upload to S3
0 3 * * * aws s3 sync /backups s3://giliza-backups/daily/

# Retention policy
0 4 * * 0 find /backups -name "*.sql.gz" -mtime +30 -delete
```

### Point-in-time Recovery

```bash
# Enable WAL archiving
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backups/wal/%f'
```

## Security Hardening

### SSL/TLS Certificates

```bash
# Using Let's Encrypt
certbot certonly --standalone -d api.production.com -d app.production.com

# Auto-renewal
0 0 1 * * certbot renew --quiet
```

### Network Security

```bash
# Firewall rules
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw deny 4000/tcp  # Backend (internal only)
sudo ufw deny 5432/tcp  # Database (internal only)
```

## Performance Optimization

### CDN Setup

```nginx
# Cloudflare integration
server {
    server_name api.production.com;
    # Enable Cloudflare
    add_header Cache-Control "public, max-age=3600";
}
```

### Database Query Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_patient_id ON medical_scans(patient_id);
CREATE INDEX idx_triage_timestamp ON triage_records(timestamp DESC);
CREATE INDEX idx_urgency_level ON triage_records(urgency_level);
CREATE INDEX idx_status ON triage_records(status);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM medical_scans WHERE patient_id = $1;
```

## Compliance & Audit

### HIPAA Compliance

- [ ] Enable encryption at rest (database)
- [ ] Enable encryption in transit (TLS 1.2+)
- [ ] Implement access controls (RBAC)
- [ ] Enable audit logging
- [ ] Set up automatic backups
- [ ] Configure data retention policies

### Audit Logging

```javascript
// Log all patient data access
app.use((req, res, next) => {
  if (req.path.includes('/api/patients')) {
    logger.info({
      event: 'patient_access',
      user: req.user.id,
      patientId: req.params.id,
      timestamp: new Date(),
      action: req.method,
    });
  }
  next();
});
```

---

**Giliza X is ready for production deployment!** 🚀
