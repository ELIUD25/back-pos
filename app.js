const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

// Enhanced CORS Configuration
// const corsOptions = {
//   // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type', 
//     'Accept', 
//     'X-Requested-With'
//   ],
//   exposedHeaders: [],
//   maxAge: 86400 // 24 hours for preflight cache
// };

// app.use(cors(corsOptions));


// Enhanced CORS Configuration for Vercel
const corsOptions = {
  origin: [
    'https://seridah-chemist.vercel.app',
    'https://back-pos-five.vercel.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Accept', 
    'X-Requested-With'
  ],
  exposedHeaders: ['Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));




// Essential Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers Middleware
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
// ... other routes

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error Handling Middleware (should be after routes)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server Initialization
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`
      🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
      📡 Listening on port ${PORT}
      🌐 Allowed CORS origin: ${corsOptions.origin}
      🛡️ CORS Methods: ${corsOptions.methods.join(', ')}
      🕒 ${new Date().toLocaleString()}
    `);
  });

  // Process Event Handlers
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('unhandledRejection', (err) => {
    console.error('⚠️ Unhandled Rejection:', err.stack || err);
    shutdown('UNHANDLED_REJECTION');
  });

  process.on('uncaughtException', (err) => {
    console.error('⚠️ Uncaught Exception:', err.stack || err);
    shutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;