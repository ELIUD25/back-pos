const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ==================== SERVER STATUS ====================
let serverStatus = {
  isInitialized: false,
  isInitializing: false,
  initializationStartTime: null,
  services: {
    database: false,
    models: false,
    email: false,
    session: false
  }
};

// ==================== MIDDLEWARE SETUP ====================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

app.use(compression());

// SINGLE CORS CONFIGURATION - No duplicates
app.use(cors({
  origin: [
    'https://seridah-chemist.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many authentication attempts' }
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many email requests' }
});

app.use('/api/auth/request-code', emailLimiter);
app.use('/api/auth/verify-code', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'stanzo_session_secret_change_in_production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://chemistseridah_db_user:m5pBLBogNk9Ov714@cluster0.5pw7hqj.mongodb.net/?appName=Cluster0',
    collectionName: 'sessions'
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ==================== INITIALIZATION ====================
const initializeServer = async () => {
  if (serverStatus.isInitializing || serverStatus.isInitialized) {
    console.log('🔄 Server initialization already in progress or completed');
    return;
  }

  serverStatus.isInitializing = true;
  serverStatus.initializationStartTime = new Date();
  
  console.log('🚀 Starting comprehensive server initialization...');

  try {
    // Step 1: Database connection
    console.log('📦 Step 1: Connecting to database...');
    await connectDB();
    serverStatus.services.database = true;

    // Step 2: Create models
    console.log('📦 Step 2: Creating enhanced models...');
    models = createModels();
    serverStatus.services.models = true;

    // Step 3: Initialize email service (non-blocking)
    console.log('📦 Step 3: Initializing email service...');
    initializeEmail().then(success => {
      serverStatus.services.email = success;
      console.log(success ? '✅ Email service initialized' : '⚠️ Email service disabled');
    }).catch(error => {
      console.error('❌ Email service initialization failed:', error);
      serverStatus.services.email = false;
    });

    // Step 4: Session setup verification
    console.log('📦 Step 4: Verifying session configuration...');
    serverStatus.services.session = true;

    // Step 5: Create default admin (non-blocking)
    console.log('📦 Step 5: Setting up default admin...');
    createDefaultAdmin().then(() => {
      console.log('✅ Default admin setup completed');
    }).catch(error => {
      console.log('⚠️ Default admin setup failed:', error.message);
    });

    // Mark initialization as complete
    serverStatus.isInitialized = true;
    serverStatus.isInitializing = false;
    
    const initTime = new Date() - serverStatus.initializationStartTime;
    console.log(`✅ Server initialization completed in ${initTime}ms`);
    
  } catch (error) {
    console.error('💥 Server initialization failed:', error);
    serverStatus.isInitializing = false;
    serverStatus.isInitialized = false;
    throw error;
  }
};

// ==================== DATABASE CONNECTION ====================
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb+srv://chemistseridah_db_user:m5pBLBogNk9Ov714@cluster0.5pw7hqj.mongodb.net/?appName=Cluster0';
    
    console.log('🔗 Connecting to MongoDB...');
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 25,
      minPoolSize: 5,
      retryWrites: true
    });
    
    console.log('✅ MongoDB connected successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// ==================== MODELS ====================
const createModels = () => {
  console.log('🔧 Creating enhanced models...');
  
  // Product Schema
  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: 'Uncategorized' },
    buyingPrice: { type: Number, default: 0 },
    minSellingPrice: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 5 },
    barcode: String,
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    shopId: String,
    shopName: String,
    description: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Shop Schema
  const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    manager: String,
    contact: String,
    email: String,
    type: { type: String, default: 'retail' },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Cashier Schema
  const cashierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    password: String,
    role: { type: String, default: 'cashier' },
    status: { type: String, default: 'active' },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    shopName: String,
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Expense Schema
  const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: 'General' },
    date: { type: Date, default: Date.now },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    shopId: String,
    shopName: String,
    recordedBy: String,
    paymentMethod: { type: String, default: 'cash' },
    referenceNumber: String,
    notes: String,
    status: { type: String, default: 'completed' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Transaction Schema
  const transactionSchema = new mongoose.Schema({
    transactionNumber: { type: String, required: true, unique: true },
    totalAmount: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    profitMargin: { type: Number, default: 0 },
    items: [{
      productName: String,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      price: Number,
      totalPrice: Number,
      buyingPrice: Number,
      cost: Number,
      profit: Number,
      profitMargin: Number
    }],
    itemsCount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'cash' },
    customerName: { type: String, default: 'Walk-in Customer' },
    customerPhone: String,
    cashierName: String,
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cashier' },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    shopId: String,
    shopName: String,
    saleDate: { type: Date, default: Date.now },
    status: { type: String, default: 'completed' },
    isCreditTransaction: { type: Boolean, default: false },
    creditStatus: { type: String, enum: ['pending', 'partially_paid', 'paid', 'overdue'] },
    recognizedRevenue: { type: Number, default: 0 },
    outstandingRevenue: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    dueDate: Date,
    creditShopName: String,
    creditShopId: String,
    shopClassification: String,
    paymentSplit: {
      cash: { type: Number, default: 0 },
      bank_mpesa: { type: Number, default: 0 },
      credit: { type: Number, default: 0 },
      upfront_cash: { type: Number, default: 0 },
      upfront_bank_mpesa: { type: Number, default: 0 }
    },
    immediateRevenue: { type: Number, default: 0 },
    upfrontPaymentDetails: {
      amount: { type: Number, default: 0 },
      method: String,
      split: {
        cash: { type: Number, default: 0 },
        bank_mpesa: { type: Number, default: 0 }
      }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Credit Schema
  const creditSchema = new mongoose.Schema({
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    customerName: { type: String, required: true },
    customerPhone: String,
    customerEmail: String,
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'partially_paid', 'paid', 'overdue'] },
    paymentHistory: [{
      amount: Number,
      paymentDate: { type: Date, default: Date.now },
      paymentMethod: String,
      recordedBy: String,
      cashierName: String,
      notes: String,
      isUpfrontPayment: { type: Boolean, default: false }
    }],
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    shopId: String,
    shopName: String,
    creditShopName: String,
    creditShopId: String,
    shopClassification: String,
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cashier' },
    cashierName: String,
    recordedBy: String,
    notes: String,
    upfrontPayment: {
      amount: { type: Number, default: 0 },
      method: String,
      split: {
        cash: { type: Number, default: 0 },
        bank_mpesa: { type: Number, default: 0 }
      }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // User Schema
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Secure Code Schema
  const secureCodeSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    used: { type: Boolean, default: false }
  });

  secureCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  // Create models
  const models = {
    Product: mongoose.models.Product || mongoose.model('Product', productSchema),
    Shop: mongoose.models.Shop || mongoose.model('Shop', shopSchema),
    Cashier: mongoose.models.Cashier || mongoose.model('Cashier', cashierSchema),
    Expense: mongoose.models.Expense || mongoose.model('Expense', expenseSchema),
    Transaction: mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema),
    Credit: mongoose.models.Credit || mongoose.model('Credit', creditSchema),
    User: mongoose.models.User || mongoose.model('User', userSchema),
    SecureCode: mongoose.models.SecureCode || mongoose.model('SecureCode', secureCodeSchema)
  };

  console.log('✅ All enhanced models created successfully');
  return models;
};

let models = {};

// ==================== UTILITIES ====================
const CalculationUtils = {
  safeNumber: (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  },

  formatCurrency: (amount) => {
    const value = CalculationUtils.safeNumber(amount);
    return `KES ${value.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },

  calculateProfit: (revenue, cost) => {
    return CalculationUtils.safeNumber(revenue) - CalculationUtils.safeNumber(cost);
  },

  calculateProfitMargin: (revenue, profit) => {
    const safeRevenue = CalculationUtils.safeNumber(revenue);
    const safeProfit = CalculationUtils.safeNumber(profit);
    return safeRevenue > 0 ? (safeProfit / safeRevenue) * 100 : 0;
  },

  calculateCOGS: (transactions) => {
    if (!Array.isArray(transactions)) return 0;
    return transactions.reduce((sum, transaction) => {
      const cost = CalculationUtils.safeNumber(transaction.cost);
      return sum + cost;
    }, 0);
  },

  calculateCostFromItems: async (transaction, products = []) => {
    try {
      if (transaction.cost && CalculationUtils.safeNumber(transaction.cost) > 0) {
        return CalculationUtils.safeNumber(transaction.cost);
      }
      
      if (transaction.totalCost && CalculationUtils.safeNumber(transaction.totalCost) > 0) {
        return CalculationUtils.safeNumber(transaction.totalCost);
      }

      if (transaction.items && Array.isArray(transaction.items)) {
        let totalCost = 0;
        
        for (const item of transaction.items) {
          const quantity = CalculationUtils.safeNumber(item.quantity, 1);
          let itemCost = 0;
          
          if (item.cost && CalculationUtils.safeNumber(item.cost) > 0) {
            itemCost = CalculationUtils.safeNumber(item.cost);
          }
          else if (item.buyingPrice && CalculationUtils.safeNumber(item.buyingPrice) > 0) {
            itemCost = CalculationUtils.safeNumber(item.buyingPrice);
          }
          else if (item.productId && products.length > 0) {
            const product = products.find(p => 
              p._id && item.productId && 
              (p._id.toString() === item.productId.toString() || 
               (p._id && item.productId._id && p._id.toString() === item.productId._id.toString()))
            );
            
            if (product) {
              itemCost = CalculationUtils.safeNumber(product.buyingPrice);
            }
          }
          else if (item.price && CalculationUtils.safeNumber(item.price) > 0) {
            itemCost = CalculationUtils.safeNumber(item.price) * 0.3;
          }

          totalCost += itemCost * quantity;
        }
        
        return totalCost;
      }
      
      return 0;
    } catch (error) {
      console.error('❌ Error calculating cost from items:', error);
      return 0;
    }
  },

  processSingleTransaction: async (transaction, products = []) => {
    try {
      if (!transaction) return { totalAmount: 0, cost: 0, profit: 0, profitMargin: 0, isCreditTransaction: false, recognizedRevenue: 0, outstandingRevenue: 0, amountPaid: 0, creditStatus: 'completed', itemsCount: 0, displayDate: new Date().toLocaleString('en-KE') };

      const isCredit = transaction.paymentMethod === 'credit' || 
                      transaction.isCredit === true || 
                      transaction.transactionType === 'credit' ||
                      transaction.isCreditTransaction === true ||
                      transaction.status === 'credit';
      
      const totalAmount = CalculationUtils.safeNumber(transaction.totalAmount) || 
                         CalculationUtils.safeNumber(transaction.amount) || 0;
      
      const cost = await CalculationUtils.calculateCostFromItems(transaction, products);
      
      const amountPaid = CalculationUtils.safeNumber(transaction.amountPaid) || 
                        CalculationUtils.safeNumber(transaction.paidAmount) || 0;
      
      const recognizedRevenue = isCredit ? amountPaid : totalAmount;
      const outstandingRevenue = isCredit ? 
        (CalculationUtils.safeNumber(transaction.outstandingRevenue) || 
         CalculationUtils.safeNumber(transaction.balanceDue) || 
         Math.max(0, totalAmount - amountPaid)) : 0;

      const profit = recognizedRevenue - cost;
      const profitMargin = CalculationUtils.calculateProfitMargin(recognizedRevenue, profit);
      
      let creditStatus = 'completed';
      if (isCredit) {
        if (outstandingRevenue <= 0) {
          creditStatus = 'paid';
        } else if (amountPaid > 0) {
          creditStatus = 'partially_paid';
        } else {
          creditStatus = 'pending';
        }
        
        if (transaction.dueDate && new Date(transaction.dueDate) < new Date() && outstandingRevenue > 0) {
          creditStatus = 'overdue';
        }
      }

      let paymentSplit = transaction.paymentSplit || {
        cash: 0,
        bank_mpesa: 0,
        credit: 0,
        upfront_cash: 0,
        upfront_bank_mpesa: 0
      };

      if (!paymentSplit.upfront_cash && !paymentSplit.upfront_bank_mpesa) {
        if (isCredit && transaction.upfrontPaymentDetails) {
          paymentSplit.upfront_cash = CalculationUtils.safeNumber(transaction.upfrontPaymentDetails.split?.cash);
          paymentSplit.upfront_bank_mpesa = CalculationUtils.safeNumber(transaction.upfrontPaymentDetails.split?.bank_mpesa);
        }
      }

      return {
        ...transaction,
        totalAmount,
        cost,
        profit,
        profitMargin,
        isCreditTransaction: isCredit,
        recognizedRevenue,
        outstandingRevenue,
        amountPaid,
        creditStatus,
        paymentSplit,
        itemsCount: transaction.items ? transaction.items.reduce((sum, item) => 
          sum + CalculationUtils.safeNumber(item.quantity, 1), 0) : 0,
        displayDate: transaction.displayDate || 
                    new Date(transaction.saleDate || transaction.createdAt).toLocaleString('en-KE')
      };
    } catch (error) {
      console.error('❌ Error processing single transaction:', error);
      return { totalAmount: 0, cost: 0, profit: 0, profitMargin: 0, isCreditTransaction: false, recognizedRevenue: 0, outstandingRevenue: 0, amountPaid: 0, creditStatus: 'completed', itemsCount: 0, displayDate: new Date().toLocaleString('en-KE') };
    }
  },

  processComprehensiveData: async (rawData, selectedShop) => {
    const transactions = rawData.transactions || [];
    const expenses = rawData.expenses || [];
    const credits = rawData.credits || [];
    const products = rawData.products || [];
    const shops = rawData.shops || [];
    const cashiers = rawData.cashiers || [];

    const salesWithProfit = await Promise.all(
      transactions.map(transaction => 
        CalculationUtils.processSingleTransaction(transaction, products)
      )
    );

    const filteredTransactions = selectedShop && selectedShop !== 'all' ? 
      salesWithProfit.filter(t => 
        t.shop === selectedShop || t.shopId === selectedShop
      ) : salesWithProfit;

    const totalTransactions = filteredTransactions.length;
    const creditTransactions = filteredTransactions.filter(t => t.isCreditTransaction);
    const nonCreditTransactions = filteredTransactions.filter(t => !t.isCreditTransaction);
    const completeTransactions = filteredTransactions.filter(t => t.status === 'completed');

    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.recognizedRevenue, 0);
    const creditSales = creditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const nonCreditSales = nonCreditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const costOfGoodsSold = CalculationUtils.calculateCOGS(filteredTransactions);
    const grossProfit = totalRevenue - costOfGoodsSold;
    const totalExpenses = expenses.reduce((sum, e) => sum + CalculationUtils.safeNumber(e.amount), 0);
    const netProfit = grossProfit - totalExpenses;
    
    let totalCash = 0;
    let totalMpesaBank = 0;
    let totalCredit = 0;
    let totalUpfrontCash = 0;
    let totalUpfrontMpesaBank = 0;

    filteredTransactions.forEach(transaction => {
      if (transaction.paymentSplit) {
        totalCash += CalculationUtils.safeNumber(transaction.paymentSplit.cash);
        totalMpesaBank += CalculationUtils.safeNumber(transaction.paymentSplit.bank_mpesa);
        totalCredit += CalculationUtils.safeNumber(transaction.paymentSplit.credit);
        totalUpfrontCash += CalculationUtils.safeNumber(transaction.paymentSplit.upfront_cash);
        totalUpfrontMpesaBank += CalculationUtils.safeNumber(transaction.paymentSplit.upfront_bank_mpesa);
      } else {
        if (transaction.paymentMethod === 'cash') {
          totalCash += CalculationUtils.safeNumber(transaction.recognizedRevenue);
        } else if (['mpesa', 'bank', 'card', 'bank_mpesa'].includes(transaction.paymentMethod)) {
          totalMpesaBank += CalculationUtils.safeNumber(transaction.recognizedRevenue);
        } else if (transaction.paymentMethod === 'credit') {
          totalCredit += CalculationUtils.safeNumber(transaction.recognizedRevenue);
        } else if (transaction.paymentMethod === 'cash_bank_mpesa') {
          const half = CalculationUtils.safeNumber(transaction.recognizedRevenue) / 2;
          totalCash += half;
          totalMpesaBank += half;
        }
      }
    });

    totalCash += totalUpfrontCash;
    totalMpesaBank += totalUpfrontMpesaBank;
    
    const outstandingCredit = credits
      .filter(credit => credit.status !== 'paid' && 
        (!selectedShop || selectedShop === 'all' || 
         credit.shop === selectedShop || credit.shopId === selectedShop))
      .reduce((sum, credit) => sum + CalculationUtils.safeNumber(credit.balanceDue), 0);
    
    const totalCreditGiven = creditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const recognizedCreditRevenue = creditTransactions.reduce((sum, t) => sum + t.recognizedRevenue, 0);
    const totalUpfrontPayments = creditTransactions.reduce((sum, t) => sum + t.amountPaid, 0);

    const financialStats = {
      totalSales: totalTransactions,
      creditSales: creditSales,
      nonCreditSales: nonCreditSales,
      totalRevenue: totalRevenue,
      totalExpenses: totalExpenses,
      grossProfit: grossProfit,
      netProfit: netProfit,
      costOfGoodsSold: costOfGoodsSold,
      totalMpesaBank: totalMpesaBank,
      totalCash: totalCash,
      totalCredit: totalCredit,
      outstandingCredit: outstandingCredit,
      totalCreditGiven: totalCreditGiven,
      totalUpfrontPayments: totalUpfrontPayments,
      totalUpfrontCash: totalUpfrontCash,
      totalUpfrontMpesaBank: totalUpfrontMpesaBank,
      creditSalesCount: creditTransactions.length,
      nonCreditSalesCount: nonCreditTransactions.length,
      completeTransactionsCount: completeTransactions.length,
      recognizedCreditRevenue: recognizedCreditRevenue,
      profitMargin: CalculationUtils.calculateProfitMargin(totalRevenue, netProfit),
      creditCollectionRate: totalCreditGiven > 0 ? 
        (recognizedCreditRevenue / totalCreditGiven) * 100 : 0,
      totalItemsSold: filteredTransactions.reduce((sum, t) => sum + t.itemsCount, 0),
      averageTransactionValue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
      cogsBreakdown: {
        total: costOfGoodsSold,
        fromCreditSales: CalculationUtils.calculateCOGS(creditTransactions),
        fromCompleteSales: CalculationUtils.calculateCOGS(nonCreditTransactions)
      },
      _cogsCalculation: 'complete_sales_plus_credit_sales_made',
      _revenueCalculation: 'recognized_revenue_includes_upfront_payments',
      _paymentTracking: 'payment_split_with_upfront_support',
      _calculatedAt: new Date().toISOString()
    };

    return {
      salesWithProfit: filteredTransactions,
      financialStats,
      expenses,
      credits,
      products,
      shops,
      cashiers,
      timestamp: new Date().toISOString()
    };
  }
};

// ==================== EMAIL SERVICE ====================
const createEmailTransporter = () => {
  try {
    const emailUser = process.env.EMAIL_USER || 'chemistseridah@gmail.com';
    const emailPass = process.env.EMAIL_PASSWORD || 'your-gmail-password';

    if (!emailUser || !emailPass) {
      throw new Error('Email credentials not configured');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      debug: false,
      logger: false
    });

    return transporter;
  } catch (error) {
    console.error('❌ Error creating email transporter:', error.message);
    throw error;
  }
};

let emailTransporter = null;

const initializeEmail = async () => {
  try {
    emailTransporter = createEmailTransporter();
    await emailTransporter.verify();
    console.log('✅ Email transporter is ready and verified');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('⚠️ Email functionality will be disabled');
    return false;
  }
};

// ==================== AUTHENTICATION ====================
const generateSecureCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSecureCodeEmail = async (email, code) => {
  if (!emailTransporter) {
    throw new Error('Email service not configured');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'chemistseridah@gmail.com',
    to: email,
    subject: 'Your Secure Login Code - Seridah Chemist Management',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          Seridah Chemist Management - Secure Login
        </h2>
        <p>Hello,</p>
        <p>Your secure login code for Seridah Chemist Management System is:</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 25px 0; border: 2px dashed #4CAF50; border-radius: 8px;">
          ${code}
        </div>
        <p style="color: #666; font-size: 14px;">
          This code will expire in 15 minutes for security reasons.
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request this code, please ignore this email or contact support if you're concerned.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #888; font-size: 11px;">
          This is an automated message from Seridah Chemist Management System.
        </p>
      </div>
    `
  };

  await emailTransporter.sendMail(mailOptions);
};

const generateAuthToken = (userId, email, role) => {
  return jwt.sign(
    { 
      userId, 
      email, 
      role,
      timestamp: Date.now()
    },
    process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
};

const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'chemistseridah@gmail.com';
    
    const existingAdmin = await models.User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await models.User.create({
        email: adminEmail,
        name: 'System Administrator',
        role: 'admin'
      });
      console.log('✅ Default admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.log('⚠️ Could not create admin user:', error.message);
  }
};

// ==================== MIDDLEWARE ====================
app.use('/api/*', (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/health' || req.path === '/api/health/') {
    return next();
  }

  if (!serverStatus.isInitialized) {
    return res.status(503).json({
      success: false,
      message: 'Server is initializing. Please try again in a moment.',
      code: 'SERVER_INITIALIZING',
      endpoint: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
      retryAfter: 30
    });
  }

  next();
});

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.session.token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-change-in-production');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
};

// ==================== DATA FETCHING ====================
const getAllTransactionData = async (filters = {}) => {
  try {
    const {
      startDate,
      endDate,
      shopId,
      cashierId,
      paymentMethod,
      status
    } = filters;

    let filter = { 
      status: { $in: ['completed', 'credit'] }
    };

    if (startDate && endDate) {
      filter.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (shopId && shopId !== 'all') {
      filter.$or = [
        { shop: shopId },
        { shopId: shopId }
      ];
    }

    if (cashierId && cashierId !== 'all') {
      filter.$or = [
        { cashierId: cashierId },
        { cashierName: { $regex: cashierId, $options: 'i' } }
      ];
    }

    if (paymentMethod && paymentMethod !== 'all') {
      if (paymentMethod === 'digital') {
        filter.paymentMethod = { $in: ['mpesa', 'bank', 'card'] };
      } else if (paymentMethod === 'credit') {
        filter.paymentMethod = 'credit';
      } else {
        filter.paymentMethod = paymentMethod;
      }
    }

    const [transactions, shops, cashiers, products, expenses, credits] = await Promise.all([
      models.Transaction.find(filter)
        .populate('shop', 'name location type')
        .populate('cashierId', 'name email')
        .populate('items.productId', 'name buyingPrice currentStock')
        .sort({ saleDate: -1 })
        .lean(),
      models.Shop.find().lean(),
      models.Cashier.find().lean(),
      models.Product.find().lean(),
      models.Expense.find(startDate && endDate ? {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      } : {}).populate('shop', 'name').lean(),
      models.Credit.find(startDate && endDate ? {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      } : {}).populate('transactionId').populate('shop').populate('cashierId').lean()
    ]);

    const processedData = await CalculationUtils.processComprehensiveData({
      transactions,
      shops,
      cashiers,
      products,
      expenses,
      credits
    }, shopId);

    return processedData;

  } catch (error) {
    console.error('❌ Error in getAllTransactionData:', error);
    throw error;
  }
};

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: process.env.APP_NAME || 'Seridah Chemist Management',
    version: process.env.APP_VERSION || '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    email: emailTransporter ? 'configured' : 'disabled'
  });
});

// Authentication routes
app.post('/api/auth/request-code', async (req, res) => {
  try {
    if (!models || !models.User || !models.SecureCode || !models.Cashier) {
      return res.status(503).json({
        success: false,
        message: 'Server is initializing. Please try again in a moment.',
        code: 'SERVER_INITIALIZING'
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required',
        code: 'EMAIL_REQUIRED'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    let user = null;
    try {
      user = await models.User.findOne({ email: email.toLowerCase().trim() }) || 
             await models.Cashier.findOne({ email: email.toLowerCase().trim() });
    } catch (dbError) {
      return res.status(500).json({
        success: false,
        message: 'Database error. Please try again.',
        code: 'DATABASE_ERROR'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address',
        code: 'USER_NOT_FOUND'
      });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your account is not active. Please contact administrator.',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    const secureCode = generateSecureCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const hashedCode = await bcrypt.hash(secureCode, 10);
    
    try {
      await models.SecureCode.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        {
          code: hashedCode,
          expiresAt,
          attempts: 0,
          used: false
        },
        { 
          upsert: true, 
          new: true,
          runValidators: true 
        }
      );
    } catch (dbError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate secure code. Please try again.',
        code: 'CODE_SAVE_ERROR'
      });
    }

    if (!emailTransporter) {
      return res.json({
        success: true,
        message: 'Secure code generated (email service disabled)',
        developmentMode: true,
        secureCode: secureCode,
        expiresIn: 15,
        code: 'DEVELOPMENT_MODE'
      });
    }

    try {
      await sendSecureCodeEmail(email, secureCode);
      
      res.json({
        success: true,
        message: 'Secure code sent to your email',
        expiresIn: 15,
        code: 'CODE_SENT'
      });
    } catch (emailError) {
      await models.SecureCode.deleteOne({ email: email.toLowerCase().trim() });

      res.status(500).json({
        success: false,
        message: 'Failed to send secure code. Please try again later.',
        code: 'EMAIL_SEND_FAILED'
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error in request-code endpoint:', error);
    
    let errorMessage = 'Failed to process request. Please try again later.';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error.name === 'MongoNetworkError') {
      errorMessage = 'Database connection error. Please try again.';
      errorCode = 'DATABASE_CONNECTION_ERROR';
    } else if (error.name === 'ValidationError') {
      errorMessage = 'Data validation error. Please check your input.';
      errorCode = 'VALIDATION_ERROR';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      code: errorCode
    });
  }
});

app.post('/api/auth/verify-code',
  [
    body('email').isEmail().normalizeEmail(),
    body('code').isLength({ min: 6, max: 6 }).isNumeric()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          details: errors.array()
        });
      }

      const { email, code } = req.body;

      const secureCode = await models.SecureCode.findOne({ email });
      if (!secureCode) {
        return res.status(404).json({
          success: false,
          message: 'No secure code found for this email. Please request a new code.'
        });
      }

      if (new Date() > secureCode.expiresAt) {
        await models.SecureCode.deleteOne({ email });
        return res.status(400).json({
          success: false,
          message: 'Secure code has expired. Please request a new code.'
        });
      }

      if (secureCode.used) {
        return res.status(400).json({
          success: false,
          message: 'Secure code has already been used. Please request a new code.'
        });
      }

      if (secureCode.attempts >= 5) {
        await models.SecureCode.deleteOne({ email });
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new code.'
        });
      }

      const isValidCode = await bcrypt.compare(code, secureCode.code);
      if (!isValidCode) {
        secureCode.attempts += 1;
        await secureCode.save();
        
        return res.status(400).json({
          success: false,
          message: 'Invalid secure code',
          attemptsRemaining: 5 - secureCode.attempts
        });
      }

      secureCode.used = true;
      await secureCode.save();

      const user = await models.User.findOne({ email }) || 
                   await models.Cashier.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found'
        });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateAuthToken(user._id, user.email, user.role);

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      };

      if (user.role === 'cashier' && user.shopId) {
        userData.shopId = user.shopId;
        userData.shopName = user.shopName;
      }

      req.session.user = userData;
      req.session.token = token;

      res.json({
        success: true,
        user: userData,
        token: token,
        message: 'Login successful'
      });

    } catch (error) {
      console.error('❌ Error verifying secure code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify code. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Transaction routes
app.post('/api/transactions', async (req, res) => {
  try {
    const transactionData = req.body;

    if (transactionData.transactionNumber) {
      const existingTransaction = await models.Transaction.findOne({ 
        transactionNumber: transactionData.transactionNumber 
      });
      
      if (existingTransaction) {
        return res.status(409).json({
          success: false,
          message: 'Transaction with this number already exists'
        });
      }
    }

    if (transactionData.isCreditPayment && transactionData.originalCreditId) {
      return await handleCreditPayment(transactionData, res);
    }

    if (transactionData.shop) {
      const shop = await models.Shop.findById(transactionData.shop);
      if (shop) {
        transactionData.shopName = shop.name;
        transactionData.shopId = shop._id;
      }
    }

    if (transactionData.cashierId) {
      const cashier = await models.Cashier.findById(transactionData.cashierId);
      if (cashier) {
        transactionData.cashierName = cashier.name;
      }
    }

    const items = transactionData.items || [];
    let totalAmount = 0;
    let totalCost = 0;

    const enhancedItems = await Promise.all(items.map(async (item) => {
      const quantity = CalculationUtils.safeNumber(item.quantity, 1);
      const price = CalculationUtils.safeNumber(item.price);
      const buyingPrice = CalculationUtils.safeNumber(item.buyingPrice);
      const itemTotalPrice = price * quantity;
      const itemCost = buyingPrice * quantity;
      const itemProfit = itemTotalPrice - itemCost;
      const itemProfitMargin = itemTotalPrice > 0 ? (itemProfit / itemTotalPrice) * 100 : 0;

      totalAmount += itemTotalPrice;
      totalCost += itemCost;

      if (item.productId && !transactionData.isCreditPayment) {
        try {
          const product = await models.Product.findById(item.productId);
          if (product) {
            const currentStock = CalculationUtils.safeNumber(product.currentStock);
            const newStock = Math.max(0, currentStock - quantity);
            
            await models.Product.findByIdAndUpdate(item.productId, {
              currentStock: newStock,
              updatedAt: new Date()
            });
          }
        } catch (stockError) {
          console.error('❌ Error reducing stock for product:', item.productId, stockError);
        }
      }

      return {
        ...item,
        quantity,
        price,
        totalPrice: itemTotalPrice,
        buyingPrice,
        cost: itemCost,
        profit: itemProfit,
        profitMargin: itemProfitMargin
      };
    }));

    const amountPaidNow = CalculationUtils.safeNumber(transactionData.amountPaidNow) || 0;
    const isCreditTransaction = transactionData.paymentMethod === 'credit';
    
    let recognizedRevenue = totalAmount;
    let outstandingRevenue = 0;
    let amountPaid = totalAmount;
    let creditStatus = 'completed';

    if (isCreditTransaction) {
      amountPaid = amountPaidNow;
      recognizedRevenue = amountPaidNow;
      outstandingRevenue = Math.max(0, totalAmount - amountPaidNow);
      
      if (outstandingRevenue <= 0) {
        creditStatus = 'paid';
      } else if (amountPaidNow > 0) {
        creditStatus = 'partially_paid';
      } else {
        creditStatus = 'pending';
      }
    }

    const profit = recognizedRevenue - totalCost;
    const profitMargin = recognizedRevenue > 0 ? (profit / recognizedRevenue) * 100 : 0;

    transactionData.totalAmount = totalAmount;
    transactionData.cost = totalCost;
    transactionData.profit = profit;
    transactionData.profitMargin = profitMargin;
    transactionData.itemsCount = items.reduce((sum, item) => sum + CalculationUtils.safeNumber(item.quantity, 1), 0);
    transactionData.items = enhancedItems;

    transactionData.paymentSplit = {
      cash: 0,
      bank_mpesa: 0,
      credit: 0,
      upfront_cash: 0,
      upfront_bank_mpesa: 0
    };

    if (isCreditTransaction) {
      transactionData.isCreditTransaction = true;
      transactionData.creditStatus = creditStatus;
      transactionData.recognizedRevenue = recognizedRevenue;
      transactionData.outstandingRevenue = outstandingRevenue;
      transactionData.amountPaid = amountPaid;
      transactionData.status = 'credit';
      transactionData.immediateRevenue = amountPaidNow;
      
      transactionData.creditShopName = transactionData.creditShopName || transactionData.shopName;
      transactionData.creditShopId = transactionData.creditShopId || transactionData.shopId;
      transactionData.shopClassification = transactionData.shopClassification || transactionData.shopName;
      
      transactionData.upfrontPaymentDetails = {
        amount: amountPaidNow,
        method: transactionData.upfrontPaymentMethod || 'cash',
        split: {
          cash: 0,
          bank_mpesa: 0
        }
      };

      if (amountPaidNow > 0) {
        if (transactionData.upfrontPaymentMethod === 'cash') {
          transactionData.paymentSplit.upfront_cash = amountPaidNow;
          transactionData.upfrontPaymentDetails.split.cash = amountPaidNow;
        } else if (transactionData.upfrontPaymentMethod === 'bank_mpesa') {
          transactionData.paymentSplit.upfront_bank_mpesa = amountPaidNow;
          transactionData.upfrontPaymentDetails.split.bank_mpesa = amountPaidNow;
        } else if (transactionData.upfrontPaymentMethod === 'cash_bank_mpesa' && transactionData.upfrontPaymentSplit) {
          transactionData.paymentSplit.upfront_cash = CalculationUtils.safeNumber(transactionData.upfrontPaymentSplit.cash);
          transactionData.paymentSplit.upfront_bank_mpesa = CalculationUtils.safeNumber(transactionData.upfrontPaymentSplit.bank_mpesa);
          transactionData.upfrontPaymentDetails.split.cash = CalculationUtils.safeNumber(transactionData.upfrontPaymentSplit.cash);
          transactionData.upfrontPaymentDetails.split.bank_mpesa = CalculationUtils.safeNumber(transactionData.upfrontPaymentSplit.bank_mpesa);
        }
      }
      
      transactionData.paymentSplit.credit = outstandingRevenue;
      
      if (!transactionData.dueDate) {
        transactionData.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    } else {
      transactionData.isCreditTransaction = false;
      transactionData.recognizedRevenue = recognizedRevenue;
      transactionData.outstandingRevenue = 0;
      transactionData.amountPaid = amountPaid;
      transactionData.status = 'completed';
      transactionData.immediateRevenue = totalAmount;
      
      if (transactionData.paymentMethod === 'cash') {
        transactionData.paymentSplit.cash = totalAmount;
      } else if (['mpesa', 'bank', 'card', 'bank_mpesa'].includes(transactionData.paymentMethod)) {
        transactionData.paymentSplit.bank_mpesa = totalAmount;
      } else if (transactionData.paymentMethod === 'cash_bank_mpesa' && transactionData.paymentSplit) {
        transactionData.paymentSplit.cash = CalculationUtils.safeNumber(transactionData.paymentSplit.cash);
        transactionData.paymentSplit.bank_mpesa = CalculationUtils.safeNumber(transactionData.paymentSplit.bank_mpesa);
      }
    }

    if (!transactionData.transactionNumber) {
      transactionData.transactionNumber = `TXN-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 5)}`;
    }

    const transaction = new models.Transaction(transactionData);
    await transaction.save();
    
    await transaction.populate('shop', 'name location type');
    await transaction.populate('cashierId', 'name email');
    await transaction.populate('items.productId', 'name buyingPrice');

    if (isCreditTransaction && !transactionData.isCreditPayment) {
      const existingCredit = await models.Credit.findOne({ 
        transactionId: transaction._id 
      });
      
      if (!existingCredit) {
        const creditData = {
          transactionId: transaction._id,
          customerName: transactionData.customerName || 'Unknown Customer',
          customerPhone: transactionData.customerPhone,
          customerEmail: transactionData.customerEmail,
          totalAmount: totalAmount,
          amountPaid: amountPaidNow,
          balanceDue: outstandingRevenue,
          dueDate: transactionData.dueDate,
          status: creditStatus,
          shop: transactionData.shop,
          shopId: transactionData.shopId,
          shopName: transactionData.shopName,
          creditShopName: transactionData.creditShopName || transactionData.shopName,
          creditShopId: transactionData.creditShopId || transactionData.shopId,
          shopClassification: transactionData.shopClassification || transactionData.shopName,
          cashierId: transactionData.cashierId,
          cashierName: transactionData.cashierName,
          recordedBy: transactionData.recordedBy || 'System',
          notes: `Credit transaction created for ${transactionData.customerName}`,
          upfrontPayment: {
            amount: amountPaidNow,
            method: transactionData.upfrontPaymentMethod || 'cash',
            split: {
              cash: transactionData.paymentSplit.upfront_cash || 0,
              bank_mpesa: transactionData.paymentSplit.upfront_bank_mpesa || 0
            }
          }
        };

        if (amountPaidNow > 0) {
          creditData.paymentHistory = [{
            amount: amountPaidNow,
            paymentDate: new Date(),
            paymentMethod: transactionData.upfrontPaymentMethod || 'cash',
            recordedBy: transactionData.recordedBy || 'System',
            cashierName: transactionData.cashierName,
            notes: `Initial upfront payment for credit sale`,
            isUpfrontPayment: true
          }];
        }

        await models.Credit.create(creditData);
      }
    }

    res.status(201).json({
      success: true,
      data: transaction,
      message: `Transaction created successfully${isCreditTransaction ? ' with credit record' : ''}`
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
});

async function handleCreditPayment(transactionData, res) {
  try {
    const originalCredit = await models.Credit.findById(transactionData.originalCreditId)
      .populate('transactionId')
      .populate('shop', 'name location type');

    if (!originalCredit) {
      return res.status(404).json({
        success: false,
        message: 'Original credit record not found'
      });
    }

    const paymentAmount = CalculationUtils.safeNumber(transactionData.totalAmount);
    const currentAmountPaid = CalculationUtils.safeNumber(originalCredit.amountPaid);
    const newAmountPaid = currentAmountPaid + paymentAmount;
    const totalAmount = CalculationUtils.safeNumber(originalCredit.totalAmount);
    const newBalanceDue = Math.max(0, totalAmount - newAmountPaid);

    originalCredit.amountPaid = newAmountPaid;
    originalCredit.balanceDue = newBalanceDue;
    
    let newStatus = originalCredit.status;
    if (newBalanceDue <= 0) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partially_paid';
    }
    originalCredit.status = newStatus;

    originalCredit.paymentHistory.push({
      amount: paymentAmount,
      paymentMethod: transactionData.paymentMethod,
      recordedBy: transactionData.recordedBy || 'System',
      cashierName: transactionData.cashierName || 'Cashier',
      paymentDate: new Date(),
      notes: `Credit payment of ${CalculationUtils.formatCurrency(paymentAmount)}`
    });

    originalCredit.updatedAt = new Date();
    await originalCredit.save();

    if (originalCredit.transactionId) {
      await models.Transaction.findByIdAndUpdate(originalCredit.transactionId, {
        amountPaid: newAmountPaid,
        recognizedRevenue: newAmountPaid,
        outstandingRevenue: newBalanceDue,
        creditStatus: newStatus,
        updatedAt: new Date()
      });
    }

    const paymentSplit = {
      cash: 0,
      bank_mpesa: 0,
      credit: 0,
      upfront_cash: 0,
      upfront_bank_mpesa: 0
    };

    if (transactionData.paymentMethod === 'cash') {
      paymentSplit.cash = paymentAmount;
    } else if (['mpesa', 'bank', 'card', 'bank_mpesa'].includes(transactionData.paymentMethod)) {
      paymentSplit.bank_mpesa = paymentAmount;
    } else if (transactionData.paymentMethod === 'cash_bank_mpesa' && transactionData.paymentSplit) {
      paymentSplit.cash = CalculationUtils.safeNumber(transactionData.paymentSplit.cash);
      paymentSplit.bank_mpesa = CalculationUtils.safeNumber(transactionData.paymentSplit.bank_mpesa);
    }

    const paymentTransactionData = {
      ...transactionData,
      isCreditPayment: true,
      originalCreditId: originalCredit._id,
      transactionNumber: `PAY-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 5)}`,
      recognizedRevenue: paymentAmount,
      outstandingRevenue: 0,
      amountPaid: paymentAmount,
      immediateRevenue: paymentAmount,
      isCreditTransaction: false,
      creditStatus: null,
      status: 'completed',
      paymentSplit: paymentSplit
    };

    const paymentTransaction = new models.Transaction(paymentTransactionData);
    await paymentTransaction.save();

    res.status(201).json({
      success: true,
      data: {
        credit: originalCredit,
        paymentTransaction: paymentTransaction
      },
      message: `Credit payment of ${CalculationUtils.formatCurrency(paymentAmount)} recorded successfully. New balance: ${CalculationUtils.formatCurrency(newBalanceDue)}`
    });

  } catch (error) {
    console.error('❌ Error processing credit payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process credit payment',
      error: error.message
    });
  }
}

// Combined transaction endpoint
app.get('/api/transactions/combined', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      shopId,
      cashierId,
      paymentMethod
    } = req.query;

    const filters = {
      startDate,
      endDate,
      shopId,
      cashierId,
      paymentMethod
    };

    const transactionData = await getAllTransactionData(filters);

    res.json({
      success: true,
      data: transactionData,
      message: 'Combined transaction data fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error in enhanced combined transaction endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch combined transaction data',
      error: error.message
    });
  }
});

// Basic CRUD routes (simplified for brevity)
app.get('/api/products', async (req, res) => {
  try {
    const products = await models.Product.find()
      .populate('shop', 'name location type')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

app.get('/api/shops', async (req, res) => {
  try {
    const shops = await models.Shop.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: shops,
      count: shops.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shops',
      error: error.message
    });
  }
});

app.get('/api/cashiers', async (req, res) => {
  try {
    const cashiers = await models.Cashier.find()
      .populate('shopId', 'name location')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: cashiers,
      count: cashiers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cashiers',
      error: error.message
    });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await models.Expense.find()
      .populate('shop', 'name location')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message
    });
  }
});

app.get('/api/credits', async (req, res) => {
  try {
    const { shopId, status, cashierId, startDate, endDate } = req.query;
    
    let filter = {};
    if (shopId && shopId !== 'all') {
      filter.$or = [
        { shop: shopId },
        { shopId: shopId },
        { creditShopId: shopId }
      ];
    }
    if (status && status !== 'all') filter.status = status;
    if (cashierId && cashierId !== 'all') {
      filter.$or = [
        { cashierId: cashierId },
        { cashierName: { $regex: cashierId, $options: 'i' } }
      ];
    }
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const credits = await models.Credit.find(filter)
      .populate('transactionId')
      .populate('shop', 'name location type')
      .populate('cashierId', 'name email')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: credits,
      count: credits.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credits',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: process.env.APP_NAME || 'Seridah Chemist Management API',
    version: process.env.APP_VERSION || '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// ==================== SERVER START ====================
const startServer = async () => {
  try {
    console.log('🚀 Starting Seridah Chemist Management Server...');
    
    const server = app.listen(PORT, () => {
      console.log(`\n🎉 Server listening on port ${PORT}`);
      console.log('⏳ Initialization in progress...');
    });

    // Initialize server in background
    initializeServer().then(() => {
      console.log('\n✅ Server initialization completed successfully!');
      console.log('🟢 All endpoints are now available');
    }).catch(error => {
      console.error('\n💥 Server initialization failed:', error);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });

    return server;

  } catch (error) {
    console.error('💥 Server startup failed:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;