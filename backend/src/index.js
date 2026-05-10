const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Import routes
const triageRoutes = require('./routes/triage');
const xrayRoutes = require('./routes/xray');
const reportRoutes = require('./routes/reports');
const patientRoutes = require('./routes/patients');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const offlineRoutes = require('./routes/offline');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/xray', xrayRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/patients', authMiddleware, patientRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/offline', authMiddleware, offlineRoutes);

// WebSocket real-time updates
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('join-hospital', (hospitalId) => {
    socket.join(`hospital-${hospitalId}`);
    logger.info(`User ${socket.id} joined hospital ${hospitalId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  logger.info(`✅ Giliza Backend running on port ${PORT}`);
  logger.info(`🏥 Ready to serve healthcare data`);
});

module.exports = { app, server, io };
