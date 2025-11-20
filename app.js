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




// ==================== ENHANCED CORS CONFIGURATION ====================
app.use(cors({
  origin: [
    'https://seridah-chemist.vercel.app',
    'https://seridah-chemist.vercel.app/',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'X-API-Key'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials'
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours
}));


// ==================== SIMPLIFIED CORS CONFIGURATION ====================
const allowedOrigins = [
  'https://seridah-chemist.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

// Enhanced CORS middleware - PLACE THIS FIRST
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'X-API-Key'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range'
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400
}));

// Handle preflight requests globally - PLACE THIS RIGHT AFTER CORS
app.options('*', cors());

// Add CORS headers to all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, X-API-Key');
  res.header('Vary', 'Origin');
  
  next();
});

// Essential Middleware - PLACE THIS AFTER CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers Middleware
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});





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