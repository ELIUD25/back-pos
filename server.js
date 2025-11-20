// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// const rateLimit = require('express-rate-limit');
// const compression = require('compression');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const { body, validationResult } = require('express-validator');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5001;

// // ==================== ENHANCED MODELS ====================

// const createModels = () => {
//   console.log('🔧 Creating enhanced models...');
  
//   // Enhanced Product Schema
//   const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     category: { type: String, default: 'Uncategorized' },
//     buyingPrice: { type: Number, default: 0 },
//     minSellingPrice: { type: Number, default: 0 },
//     currentStock: { type: Number, default: 0 },
//     minStockLevel: { type: Number, default: 5 },
//     barcode: String,
//     shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
//     shopId: String,
//     shopName: String,
//     description: String,
//     isActive: { type: Boolean, default: true },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
//   });

//   // Enhanced Shop Schema
//   const shopSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     location: String,
//     manager: String,
//     contact: String,
//     email: String,
//     type: { type: String, default: 'retail' },
//     status: { type: String, default: 'active' },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
//   });

//   // Enhanced Cashier Schema
//   const cashierSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: String,
//     password: String,
//     role: { type: String, default: 'cashier' },
//     status: { type: String, default: 'active' },
//     shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
//     shopName: String,
//     lastLogin: Date,
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
//   });

//   // Enhanced Expense Schema
//   const expenseSchema = new mongoose.Schema({
//     description: { type: String, required: true },
//     amount: { type: Number, required: true },
//     category: { type: String, default: 'General' },
//     date: { type: Date, default: Date.now },
//     shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
//     shopId: String,
//     shopName: String,
//     recordedBy: String,
//     paymentMethod: { type: String, default: 'cash' },
//     referenceNumber: String,
//     notes: String,
//     status: { type: String, default: 'completed' },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
//   });

//   // ENHANCED Transaction Schema with Complete Upfront Credit Support
//   const transactionSchema = new mongoose.Schema({
//     transactionNumber: { type: String, required: true, unique: true },
//     totalAmount: { type: Number, required: true },
//     cost: { type: Number, default: 0 },
//     profit: { type: Number, default: 0 },
//     profitMargin: { type: Number, default: 0 },
//     items: [{
//       productName: String,
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//       quantity: { type: Number, default: 1 },
//       price: Number,
//       totalPrice: Number,
//       buyingPrice: Number,
//       cost: Number,
//       profit: Number,
//       profitMargin: Number
//     }],
//     itemsCount: { type: Number, default: 0 },
//     paymentMethod: { type: String, default: 'cash' },
//     customerName: { type: String, default: 'Walk-in Customer' },
//     customerPhone: String,
//     cashierName: String,
//     cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cashier' },
//     shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
//     shopId: String,
//     shopName: String,
//     saleDate: { type: Date, default: Date.now },
//     status: { type: String, default: 'completed' },
    
//     // Enhanced Credit Fields
//     isCreditTransaction: { type: Boolean, default: false },
//     creditStatus: { type: String, enum: ['pending', 'partially_paid', 'paid', 'overdue'] },
//     recognizedRevenue: { type: Number, default: 0 },
//     outstandingRevenue: { type: Number, default: 0 },
//     amountPaid: { type: Number, default: 0 },
//     dueDate: Date,
    
//     // Credit sale classification fields
//     creditShopName: String,
//     creditShopId: String,
//     shopClassification: String,
    
//     // ENHANCED: Payment split tracking with upfront credit support
//     paymentSplit: {
//       cash: { type: Number, default: 0 },
//       bank_mpesa: { type: Number, default: 0 },
//       credit: { type: Number, default: 0 },
//       upfront_cash: { type: Number, default: 0 },        // NEW: Track upfront cash separately
//       upfront_bank_mpesa: { type: Number, default: 0 }   // NEW: Track upfront bank/mpesa separately
//     },
    
//     // Immediate revenue tracking for cashier
//     immediateRevenue: { type: Number, default: 0 },
    
//     // NEW: Upfront payment details for credit transactions
//     upfrontPaymentDetails: {
//       amount: { type: Number, default: 0 },
//       method: String,
//       split: {
//         cash: { type: Number, default: 0 },
//         bank_mpesa: { type: Number, default: 0 }
//       }
//     },
    
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
//   });

//   // ENHANCED Credit Schema with upfront payment tracking
//   const creditSchema = new mongoose.Schema({
//     transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
//     customerName: { type: String, required: true },
//     customerPhone: String,
//     customerEmail: String,
//     totalAmount: { type: Number, required: true },
//     amountPaid: { type: Number, default: 0 },
//     balanceDue: { type: Number, required: true },
//     dueDate: { type: Date, required: true },
//     status: { type: String, default: 'pending', enum: ['pending', 'partially_paid', 'paid', 'overdue'] },
//     paymentHistory: [{
//       amount: Number,
//       paymentDate: { type: Date, default: Date.now },
//       paymentMethod: String,
//       recordedBy: String,
//       cashierName: String,
//       notes: String,
//       isUpfrontPayment: { type: Boolean, default: false } // NEW: Track if payment was upfront
//     }],
//     shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
//     shopId: String,
//     shopName: String,
//     creditShopName: String,
//     creditShopId: String,
//     shopClassification: String,
//     cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cashier' },
//     cashierName: String,
//     recordedBy: String,
//     notes: String,
    
//     // NEW: Upfront payment tracking
//     upfrontPayment: {
//       amount: { type: Number, default: 0 },
//       method: String,
//       split: {
//         cash: { type: Number, default: 0 },
//         bank_mpesa: { type: Number, default: 0 }
//       }
//     },
    
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
//   });

//   // User Schema (for admin)
//   const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     role: { type: String, default: 'admin' },
//     isActive: { type: Boolean, default: true },
//     lastLogin: Date,
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
//   });

//   // Secure Code Schema
//   const secureCodeSchema = new mongoose.Schema({
//     email: { type: String, required: true },
//     code: { type: String, required: true },
//     expiresAt: { type: Date, required: true },
//     attempts: { type: Number, default: 0 },
//     used: { type: Boolean, default: false }
//   });

//   // Index for automatic expiration
//   secureCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

//   // Create or get models
//   const models = {
//     Product: mongoose.models.Product || mongoose.model('Product', productSchema),
//     Shop: mongoose.models.Shop || mongoose.model('Shop', shopSchema),
//     Cashier: mongoose.models.Cashier || mongoose.model('Cashier', cashierSchema),
//     Expense: mongoose.models.Expense || mongoose.model('Expense', expenseSchema),
//     Transaction: mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema),
//     Credit: mongoose.models.Credit || mongoose.model('Credit', creditSchema),
//     User: mongoose.models.User || mongoose.model('User', userSchema),
//     SecureCode: mongoose.models.SecureCode || mongoose.model('SecureCode', secureCodeSchema)
//   };

//   console.log('✅ All enhanced models created successfully');
//   return models;
// };

// let models = {};

// // ==================== UPDATED CALCULATION UTILITIES WITH COMPLETE UPFRONT CREDIT SUPPORT ====================

// const CalculationUtils = {
//   safeNumber: (value, defaultValue = 0) => {
//     if (value === null || value === undefined || value === '') return defaultValue;
//     const num = Number(value);
//     return isNaN(num) ? defaultValue : num;
//   },

//   formatCurrency: (amount) => {
//     const value = CalculationUtils.safeNumber(amount);
//     return `KES ${value.toLocaleString('en-KE', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     })}`;
//   },

//   calculateProfit: (revenue, cost) => {
//     return CalculationUtils.safeNumber(revenue) - CalculationUtils.safeNumber(cost);
//   },

//   calculateProfitMargin: (revenue, profit) => {
//     const safeRevenue = CalculationUtils.safeNumber(revenue);
//     const safeProfit = CalculationUtils.safeNumber(profit);
//     return safeRevenue > 0 ? (safeProfit / safeRevenue) * 100 : 0;
//   },

//   // UPDATED: Calculate COGS for transactions array - includes complete sales + credit sales made
//   calculateCOGS: (transactions) => {
//     if (!Array.isArray(transactions)) return 0;
    
//     return transactions.reduce((sum, transaction) => {
//       // Include COGS for both complete sales and credit sales
//       // Credit sales contribute to COGS when the sale is made, not when payment is received
//       const cost = CalculationUtils.safeNumber(transaction.cost);
//       return sum + cost;
//     }, 0);
//   },

//   // ENHANCED: Calculate cost from items with product data integration
//   calculateCostFromItems: async (transaction, products = []) => {
//     try {
//       // If cost is already provided and valid, use it
//       if (transaction.cost && CalculationUtils.safeNumber(transaction.cost) > 0) {
//         return CalculationUtils.safeNumber(transaction.cost);
//       }
      
//       if (transaction.totalCost && CalculationUtils.safeNumber(transaction.totalCost) > 0) {
//         return CalculationUtils.safeNumber(transaction.totalCost);
//       }

//       // Calculate cost from items
//       if (transaction.items && Array.isArray(transaction.items)) {
//         let totalCost = 0;
        
//         for (const item of transaction.items) {
//           const quantity = CalculationUtils.safeNumber(item.quantity, 1);
          
//           // Try to get cost from different sources in priority order
//           let itemCost = 0;
          
//           // Priority 1: Direct cost field in item
//           if (item.cost && CalculationUtils.safeNumber(item.cost) > 0) {
//             itemCost = CalculationUtils.safeNumber(item.cost);
//           }
//           // Priority 2: Buying price field in item
//           else if (item.buyingPrice && CalculationUtils.safeNumber(item.buyingPrice) > 0) {
//             itemCost = CalculationUtils.safeNumber(item.buyingPrice);
//           }
//           // Priority 3: Look up product buying price from products array
//           else if (item.productId && products.length > 0) {
//             const product = products.find(p => 
//               p._id && item.productId && 
//               (p._id.toString() === item.productId.toString() || 
//                (p._id && item.productId._id && p._id.toString() === item.productId._id.toString()))
//             );
            
//             if (product) {
//               itemCost = CalculationUtils.safeNumber(product.buyingPrice);
//               console.log(`📦 Found product buying price for ${product.name}: ${itemCost}`);
//             }
//           }
//           // Priority 4: Use a default cost estimation (30% of price as fallback)
//           else if (item.price && CalculationUtils.safeNumber(item.price) > 0) {
//             itemCost = CalculationUtils.safeNumber(item.price) * 0.3; // Estimate 30% cost
//             console.log(`⚠️ Using estimated cost for item: ${itemCost} (30% of price ${item.price})`);
//           }

//           totalCost += itemCost * quantity;
//         }
        
//         console.log(`🧮 Calculated cost for transaction ${transaction._id}: ${totalCost} from ${transaction.items.length} items`);
//         return totalCost;
//       }
      
//       return 0;
//     } catch (error) {
//       console.error('❌ Error calculating cost from items:', error);
//       return 0;
//     }
//   },

//   // ENHANCED: Process single transaction with comprehensive cost calculation and upfront credit support
//   processSingleTransaction: async (transaction, products = []) => {
//     try {
//       if (!transaction) return CalculationUtils.createFallbackTransaction();

//       // ENHANCED: Multiple ways to detect credit transactions
//       const isCredit = transaction.paymentMethod === 'credit' || 
//                       transaction.isCredit === true || 
//                       transaction.transactionType === 'credit' ||
//                       transaction.isCreditTransaction === true ||
//                       transaction.status === 'credit';
      
//       // Use server-calculated values when available, otherwise calculate
//       const totalAmount = CalculationUtils.safeNumber(transaction.totalAmount) || 
//                          CalculationUtils.safeNumber(transaction.amount) || 0;
      
//       // ENHANCED: Use the new cost calculation function with products data
//       const cost = await CalculationUtils.calculateCostFromItems(transaction, products);
      
//       // ENHANCED: Credit management revenue recognition logic with upfront payment support
//       const amountPaid = CalculationUtils.safeNumber(transaction.amountPaid) || 
//                         CalculationUtils.safeNumber(transaction.paidAmount) || 0;
      
//       // UPDATED: For credit transactions, recognized revenue is the amount paid immediately (upfront payment)
//       const recognizedRevenue = isCredit ? amountPaid : totalAmount;
      
//       const outstandingRevenue = isCredit ? 
//         (CalculationUtils.safeNumber(transaction.outstandingRevenue) || 
//          CalculationUtils.safeNumber(transaction.balanceDue) || 
//          Math.max(0, totalAmount - amountPaid)) : 0;

//       // Calculate profit metrics
//       const profit = recognizedRevenue - cost; // UPDATED: Profit based on recognized revenue
//       const profitMargin = CalculationUtils.calculateProfitMargin(recognizedRevenue, profit);
      
//       // Determine credit status
//       let creditStatus = 'completed';
//       if (isCredit) {
//         if (outstandingRevenue <= 0) {
//           creditStatus = 'paid';
//         } else if (amountPaid > 0) {
//           creditStatus = 'partially_paid';
//         } else {
//           creditStatus = 'pending';
//         }
        
//         // Check if overdue
//         if (transaction.dueDate && new Date(transaction.dueDate) < new Date() && outstandingRevenue > 0) {
//           creditStatus = 'overdue';
//         }
//       }

//       // ENHANCED: Calculate payment splits with upfront credit support
//       let paymentSplit = transaction.paymentSplit || {
//         cash: 0,
//         bank_mpesa: 0,
//         credit: 0,
//         upfront_cash: 0,
//         upfront_bank_mpesa: 0
//       };

//       // If paymentSplit doesn't have upfront fields, initialize them
//       if (!paymentSplit.upfront_cash && !paymentSplit.upfront_bank_mpesa) {
//         if (isCredit && transaction.upfrontPaymentDetails) {
//           paymentSplit.upfront_cash = CalculationUtils.safeNumber(transaction.upfrontPaymentDetails.split?.cash);
//           paymentSplit.upfront_bank_mpesa = CalculationUtils.safeNumber(transaction.upfrontPaymentDetails.split?.bank_mpesa);
//         }
//       }

//       return {
//         ...transaction,
//         totalAmount,
//         cost,
//         profit,
//         profitMargin,
//         isCreditTransaction: isCredit,
//         recognizedRevenue,
//         outstandingRevenue,
//         amountPaid,
//         creditStatus,
//         paymentSplit, // ENHANCED: Include updated payment split
//         itemsCount: transaction.items ? transaction.items.reduce((sum, item) => 
//           sum + CalculationUtils.safeNumber(item.quantity, 1), 0) : 0,
//         displayDate: transaction.displayDate || 
//                     new Date(transaction.saleDate || transaction.createdAt).toLocaleString('en-KE')
//       };
//     } catch (error) {
//       console.error('❌ Error processing single transaction:', error);
//       return CalculationUtils.createFallbackTransaction();
//     }
//   },

//   createFallbackTransaction: () => {
//     return {
//       totalAmount: 0,
//       cost: 0,
//       profit: 0,
//       profitMargin: 0,
//       isCreditTransaction: false,
//       recognizedRevenue: 0,
//       outstandingRevenue: 0,
//       amountPaid: 0,
//       creditStatus: 'completed',
//       itemsCount: 0,
//       displayDate: new Date().toLocaleString('en-KE')
//     };
//   },

//   calculateTransactionMetrics: (transaction) => {
//     return CalculationUtils.processSingleTransaction(transaction);
//   },

//   // UPDATED: Process comprehensive data with accurate COGS calculation and upfront credit support
//   processComprehensiveData: async (rawData, selectedShop) => {
//     const transactions = rawData.transactions || [];
//     const expenses = rawData.expenses || [];
//     const credits = rawData.credits || [];
//     const products = rawData.products || [];
//     const shops = rawData.shops || [];
//     const cashiers = rawData.cashiers || [];

//     console.log('🔄 Processing comprehensive data with enhanced upfront credit support...', {
//       transactions: transactions.length,
//       products: products.length
//     });

//     // Enhanced sales with profit calculation using the new processSingleTransaction
//     const salesWithProfit = await Promise.all(
//       transactions.map(transaction => 
//         CalculationUtils.processSingleTransaction(transaction, products)
//       )
//     );

//     // Filter transactions based on shop if provided
//     const filteredTransactions = selectedShop && selectedShop !== 'all' ? 
//       salesWithProfit.filter(t => 
//         t.shop === selectedShop || t.shopId === selectedShop
//       ) : salesWithProfit;

//     // Calculate all required metrics
//     const totalTransactions = filteredTransactions.length;
//     const creditTransactions = filteredTransactions.filter(t => t.isCreditTransaction);
//     const nonCreditTransactions = filteredTransactions.filter(t => !t.isCreditTransaction);
//     const completeTransactions = filteredTransactions.filter(t => t.status === 'completed');

//     // ENHANCED Revenue calculations with upfront credit support
//     const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.recognizedRevenue, 0);
//     const creditSales = creditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
//     const nonCreditSales = nonCreditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    
//     // UPDATED COGS CALCULATION: Sum up all transaction costs (both complete + credit sales)
//     const costOfGoodsSold = CalculationUtils.calculateCOGS(filteredTransactions);
    
//     const grossProfit = totalRevenue - costOfGoodsSold;
    
//     // Expense calculations
//     const totalExpenses = expenses.reduce((sum, e) => sum + CalculationUtils.safeNumber(e.amount), 0);
//     const netProfit = grossProfit - totalExpenses;
    
//     // ENHANCED Payment method calculations with upfront credit support
//     let totalCash = 0;
//     let totalMpesaBank = 0;
//     let totalCredit = 0;
//     let totalUpfrontCash = 0;
//     let totalUpfrontMpesaBank = 0;

//     filteredTransactions.forEach(transaction => {
//       // Use paymentSplit with upfront credit support
//       if (transaction.paymentSplit) {
//         totalCash += CalculationUtils.safeNumber(transaction.paymentSplit.cash);
//         totalMpesaBank += CalculationUtils.safeNumber(transaction.paymentSplit.bank_mpesa);
//         totalCredit += CalculationUtils.safeNumber(transaction.paymentSplit.credit);
//         totalUpfrontCash += CalculationUtils.safeNumber(transaction.paymentSplit.upfront_cash);
//         totalUpfrontMpesaBank += CalculationUtils.safeNumber(transaction.paymentSplit.upfront_bank_mpesa);
//       } else {
//         // Fallback calculation based on paymentMethod
//         if (transaction.paymentMethod === 'cash') {
//           totalCash += CalculationUtils.safeNumber(transaction.recognizedRevenue);
//         } else if (['mpesa', 'bank', 'card', 'bank_mpesa'].includes(transaction.paymentMethod)) {
//           totalMpesaBank += CalculationUtils.safeNumber(transaction.recognizedRevenue);
//         } else if (transaction.paymentMethod === 'credit') {
//           totalCredit += CalculationUtils.safeNumber(transaction.recognizedRevenue);
//         } else if (transaction.paymentMethod === 'cash_bank_mpesa') {
//           // Split evenly as fallback
//           const half = CalculationUtils.safeNumber(transaction.recognizedRevenue) / 2;
//           totalCash += half;
//           totalMpesaBank += half;
//         }
//       }
//     });

//     // ENHANCED: Include upfront payments in cash and bank_mpesa totals
//     totalCash += totalUpfrontCash;
//     totalMpesaBank += totalUpfrontMpesaBank;
    
//     // Credit calculations
//     const outstandingCredit = credits
//       .filter(credit => credit.status !== 'paid' && 
//         (!selectedShop || selectedShop === 'all' || 
//          credit.shop === selectedShop || credit.shopId === selectedShop))
//       .reduce((sum, credit) => sum + CalculationUtils.safeNumber(credit.balanceDue), 0);
    
//     const totalCreditGiven = creditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
//     const recognizedCreditRevenue = creditTransactions.reduce((sum, t) => sum + t.recognizedRevenue, 0);
//     const totalUpfrontPayments = creditTransactions.reduce((sum, t) => sum + t.amountPaid, 0);

//     // Enhanced financial stats matching the image requirements with upfront credit support
//     const financialStats = {
//       // Core metrics from image
//       totalSales: totalTransactions,
//       creditSales: creditSales,
//       nonCreditSales: nonCreditSales,
//       totalRevenue: totalRevenue,
//       totalExpenses: totalExpenses,
//       grossProfit: grossProfit,
//       netProfit: netProfit,
//       costOfGoodsSold: costOfGoodsSold,
//       totalMpesaBank: totalMpesaBank,
//       totalCash: totalCash,
//       totalCredit: totalCredit,
//       outstandingCredit: outstandingCredit,
//       totalCreditGiven: totalCreditGiven,

//       // NEW: Upfront payment metrics
//       totalUpfrontPayments: totalUpfrontPayments,
//       totalUpfrontCash: totalUpfrontCash,
//       totalUpfrontMpesaBank: totalUpfrontMpesaBank,

//       // Additional detailed metrics
//       creditSalesCount: creditTransactions.length,
//       nonCreditSalesCount: nonCreditTransactions.length,
//       completeTransactionsCount: completeTransactions.length,
//       recognizedCreditRevenue: recognizedCreditRevenue,
//       profitMargin: CalculationUtils.calculateProfitMargin(totalRevenue, netProfit),
//       creditCollectionRate: totalCreditGiven > 0 ? 
//         (recognizedCreditRevenue / totalCreditGiven) * 100 : 0,
//       totalItemsSold: filteredTransactions.reduce((sum, t) => sum + t.itemsCount, 0),
//       averageTransactionValue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,

//       // UPDATED: COGS breakdown for analysis
//       cogsBreakdown: {
//         total: costOfGoodsSold,
//         fromCreditSales: CalculationUtils.calculateCOGS(creditTransactions),
//         fromCompleteSales: CalculationUtils.calculateCOGS(nonCreditTransactions)
//       },

//       // Metadata
//       _cogsCalculation: 'complete_sales_plus_credit_sales_made',
//       _revenueCalculation: 'recognized_revenue_includes_upfront_payments',
//       _paymentTracking: 'payment_split_with_upfront_support',
//       _calculatedAt: new Date().toISOString()
//     };

//     console.log('💰 Final COGS Calculation with Upfront Credit Support:', {
//       totalTransactions,
//       totalRevenue,
//       costOfGoodsSold,
//       grossProfit,
//       netProfit,
//       totalCash,
//       totalMpesaBank,
//       totalCredit,
//       totalUpfrontPayments,
//       cogsBreakdown: financialStats.cogsBreakdown
//     });

//     // Sales performance summary
//     const salesPerformanceSummary = {
//       totalSales: financialStats.totalSales,
//       creditSales: financialStats.creditSalesCount,
//       nonCreditSales: financialStats.nonCreditSalesCount,
//       totalRevenue: financialStats.totalRevenue,
//       creditSalesRevenue: financialStats.creditSales,
//       nonCreditSalesRevenue: financialStats.nonCreditSales,
//       totalExpenses: financialStats.totalExpenses,
//       grossProfit: financialStats.grossProfit,
//       netProfit: financialStats.netProfit,
//       costOfGoodsSold: financialStats.costOfGoodsSold,
//       totalMpesaBank: financialStats.totalMpesaBank,
//       totalCash: financialStats.totalCash,
//       totalCredit: financialStats.totalCredit,
//       outstandingCredit: financialStats.outstandingCredit,
//       totalCreditGiven: financialStats.totalCreditGiven,
//       totalUpfrontPayments: financialStats.totalUpfrontPayments,
//       _cogsMethodology: 'complete_sales_plus_credit_sales_made',
//       _revenueMethodology: 'recognized_revenue_includes_upfront_payments'
//     };

//     // Calculate top products
//     const topProducts = CalculationUtils.calculateTopProducts(filteredTransactions, 10);
    
//     // Calculate shop performance
//     const shopPerformance = CalculationUtils.calculateShopPerformance(filteredTransactions, shops);

//     return {
//       salesWithProfit: filteredTransactions,
//       financialStats,
//       salesPerformanceSummary,
//       expenses,
//       credits,
//       products,
//       shops,
//       cashiers,
//       performance: {
//         topProducts,
//         shopPerformance,
//         topCashiers: shopPerformance.slice(0, 10)
//       },
//       summary: financialStats,
//       enhancedStats: {
//         salesWithProfit: filteredTransactions,
//         financialStats
//       },
//       comprehensiveReport: {
//         summary: financialStats,
//         transactions: filteredTransactions,
//         expenses,
//         products,
//         credits,
//         shops,
//         cashiers,
//         performance: {
//           topProducts,
//           shopPerformance
//         }
//       },
//       timestamp: new Date().toISOString()
//     };
//   },

//   calculateTopProducts: (transactions, limit = 10) => {
//     if (!Array.isArray(transactions)) return [];
    
//     const productMap = {};
    
//     transactions.forEach(transaction => {
//       transaction.items?.forEach(item => {
//         const productId = item.productId?.toString() || item.productName;
//         const productName = item.productName || 'Unknown Product';
        
//         if (!productMap[productId]) {
//           productMap[productId] = {
//             id: productId,
//             name: productName,
//             totalSold: 0,
//             totalRevenue: 0,
//             totalProfit: 0,
//             totalCost: 0,
//             transactions: 0
//           };
//         }
        
//         const quantity = CalculationUtils.safeNumber(item.quantity, 1);
//         const revenue = CalculationUtils.safeNumber(item.totalPrice);
//         const cost = CalculationUtils.safeNumber(item.buyingPrice) * quantity;
//         const profit = revenue - cost;
        
//         productMap[productId].totalSold += quantity;
//         productMap[productId].totalRevenue += revenue;
//         productMap[productId].totalProfit += profit;
//         productMap[productId].totalCost += cost;
//         productMap[productId].transactions += 1;
//       });
//     });
    
//     return Object.values(productMap)
//       .map(product => ({
//         ...product,
//         profitMargin: CalculationUtils.calculateProfitMargin(product.totalRevenue, product.totalProfit),
//         averagePrice: product.totalSold > 0 ? product.totalRevenue / product.totalSold : 0
//       }))
//       .sort((a, b) => b.totalRevenue - a.totalRevenue)
//       .slice(0, limit);
//   },

//   calculateShopPerformance: (transactions, shops) => {
//     if (!Array.isArray(transactions)) return [];
    
//     const shopMap = {};
    
//     transactions.forEach(transaction => {
//       const shopId = transaction.shop || transaction.shopId;
//       if (!shopId) return;
      
//       if (!shopMap[shopId]) {
//         const shop = shops.find(s => s._id.toString() === shopId.toString()) || 
//                     { name: 'Unknown Shop', location: 'Unknown' };
//         shopMap[shopId] = {
//           id: shopId,
//           name: shop.name,
//           location: shop.location,
//           revenue: 0,
//           transactions: 0,
//           profit: 0,
//           cost: 0,
//           itemsSold: 0
//         };
//       }
      
//       shopMap[shopId].revenue += CalculationUtils.safeNumber(transaction.recognizedRevenue);
//       shopMap[shopId].transactions += 1;
//       shopMap[shopId].profit += CalculationUtils.safeNumber(transaction.profit);
//       shopMap[shopId].cost += CalculationUtils.safeNumber(transaction.cost);
//       shopMap[shopId].itemsSold += CalculationUtils.safeNumber(transaction.itemsCount);
//     });
    
//     return Object.values(shopMap)
//       .map(shop => ({
//         ...shop,
//         profitMargin: CalculationUtils.calculateProfitMargin(shop.revenue, shop.profit),
//         averageTransaction: shop.transactions > 0 ? shop.revenue / shop.transactions : 0
//       }))
//       .sort((a, b) => b.revenue - a.revenue);
//   }
// };

// // ==================== EMAIL CONFIGURATION ====================

// const createEmailTransporter = () => {
//   try {
//     const emailUser = process.env.EMAIL_USER || 'chemistseridah@gmail.com';
//     const emailPass = process.env.EMAIL_PASSWORD || 'your-gmail-password';

//     console.log('📧 Configuring email transporter...');
    
//     if (!emailUser || !emailPass) {
//       throw new Error('Email credentials not configured');
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: emailUser,
//         pass: emailPass,
//       },
//       debug: false,
//       logger: false
//     });

//     return transporter;
//   } catch (error) {
//     console.error('❌ Error creating email transporter:', error.message);
//     throw error;
//   }
// };

// let emailTransporter = null;

// const initializeEmail = async () => {
//   try {
//     emailTransporter = createEmailTransporter();
//     await emailTransporter.verify();
//     console.log('✅ Email transporter is ready and verified');
//     return true;
//   } catch (error) {
//     console.error('❌ Email configuration error:', error.message);
//     console.log('⚠️ Email functionality will be disabled');
//     return false;
//   }
// };

// // ==================== SECURE CODE AUTHENTICATION ====================

// const generateSecureCode = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const sendSecureCodeEmail = async (email, code) => {
//   if (!emailTransporter) {
//     throw new Error('Email service not configured');
//   }

//   const mailOptions = {
//     from: process.env.EMAIL_USER || 'chemistseridah@gmail.com',
//     to: email,
//     subject: 'Your Secure Login Code - Seridah Chemist Management',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
//           Seridah Chemist Management - Secure Login
//         </h2>
//         <p>Hello,</p>
//         <p>Your secure login code for Seridah Chemist Management System is:</p>
//         <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 25px 0; border: 2px dashed #4CAF50; border-radius: 8px;">
//           ${code}
//         </div>
//         <p style="color: #666; font-size: 14px;">
//           This code will expire in 15 minutes for security reasons.
//         </p>
//         <p style="color: #999; font-size: 12px;">
//           If you didn't request this code, please ignore this email or contact support if you're concerned.
//         </p>
//         <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
//         <p style="color: #888; font-size: 11px;">
//           This is an automated message from Seridah Chemist Management System.
//         </p>
//       </div>
//     `
//   };

//   await emailTransporter.sendMail(mailOptions);
// };

// const generateAuthToken = (userId, email, role) => {
//   return jwt.sign(
//     { 
//       userId, 
//       email, 
//       role,
//       timestamp: Date.now()
//     },
//     process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
//     { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
//   );
// };

// // ==================== MIDDLEWARE SETUP ====================

// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false
// }));

// app.use((req, res, next) => {
//   res.removeHeader('X-Powered-By');
//   next();
// });

// app.use(compression());

// app.use(cors({
//   // origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   origin: process.env.CLIENT_URL || 'https://seridah-chemist.vercel.app',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// }));

// app.options('*', cors());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 1000,
//   message: { success: false, message: 'Too many requests' }
// });
// app.use('/api/', limiter);

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: { success: false, message: 'Too many authentication attempts' }
// });

// const emailLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 5,
//   message: { success: false, message: 'Too many email requests' }
// });

// app.use('/api/auth/request-code', emailLimiter);
// app.use('/api/auth/verify-code', authLimiter);

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// app.use(morgan('dev'));

// // ==================== DATABASE CONNECTION ====================

// const connectDB = async () => {
//   try {
//     const connectionString = process.env.MONGODB_URI || 'mongodb+srv://chemistseridah_db_user:m5pBLBogNk9Ov714@cluster0.5pw7hqj.mongodb.net/?appName=Cluster0';
    
//     console.log('🔗 Connecting to MongoDB...');
    
//     await mongoose.connect(connectionString, {
//       serverSelectionTimeoutMS: 15000,
//       socketTimeoutMS: 45000,
//       maxPoolSize: 25,
//       minPoolSize: 5,
//       retryWrites: true
//     });
    
//     console.log('✅ MongoDB connected successfully');
    
//     models = createModels();
//     await initializeEmail();
//     await createDefaultAdmin();
    
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// const createDefaultAdmin = async () => {
//   try {
//     const adminEmail = process.env.ADMIN_EMAIL || 'chemistseridah@gmail.com';
    
//     const existingAdmin = await models.User.findOne({ email: adminEmail });
//     if (!existingAdmin) {
//       await models.User.create({
//         email: adminEmail,
//         name: 'System Administrator',
//         role: 'admin'
//       });
//       console.log('✅ Default admin user created');
//     } else {
//       console.log('✅ Admin user already exists');
//     }
//   } catch (error) {
//     console.log('⚠️ Could not create admin user:', error.message);
//   }
// };

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'stanzo_session_secret_change_in_production',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://chemistseridah_db_user:m5pBLBogNk9Ov714@cluster0.5pw7hqj.mongodb.net/?appName=Cluster0',
//     collectionName: 'sessions'
//   }),
//   cookie: {
//     secure: false,
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   }
// }));

// // ==================== AUTHENTICATION MIDDLEWARE ====================

// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '') || 
//                 req.session.token;
  
//   if (!token) {
//     return res.status(401).json({ 
//       success: false,
//       message: 'No token provided' 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-change-in-production');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ 
//       success: false,
//       message: 'Invalid token' 
//     });
//   }
// };

// // ==================== ENHANCED TRANSACTION DATA FETCHING ====================

// const getAllTransactionData = async (filters = {}) => {
//   try {
//     const {
//       startDate,
//       endDate,
//       shopId,
//       cashierId,
//       paymentMethod,
//       status
//     } = filters;

//     console.log('📊 Fetching enhanced transaction data with filters:', filters);

//     // FIX: Include both completed AND credit transactions
//     let filter = { 
//       status: { $in: ['completed', 'credit'] } // Include both statuses
//     };
//     // Date filter
//     if (startDate && endDate) {
//       filter.saleDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     // Shop filter
//     if (shopId && shopId !== 'all') {
//       filter.$or = [
//         { shop: shopId },
//         { shopId: shopId }
//       ];
//     }

//     // Cashier filter
//     if (cashierId && cashierId !== 'all') {
//       filter.$or = [
//         { cashierId: cashierId },
//         { cashierName: { $regex: cashierId, $options: 'i' } }
//       ];
//     }

//     // Payment method filter
//     if (paymentMethod && paymentMethod !== 'all') {
//       if (paymentMethod === 'digital') {
//         filter.paymentMethod = { $in: ['mpesa', 'bank', 'card'] };
//       } else if (paymentMethod === 'credit') {
//         filter.paymentMethod = 'credit';
//       } else {
//         filter.paymentMethod = paymentMethod;
//       }
//     }

//     // Fetch all data in parallel
//     const [transactions, shops, cashiers, products, expenses, credits] = await Promise.all([
//       models.Transaction.find(filter)
//         .populate('shop', 'name location type')
//         .populate('cashierId', 'name email')
//         .populate('items.productId', 'name buyingPrice currentStock')
//         .sort({ saleDate: -1 })
//         .lean(),
//       models.Shop.find().lean(),
//       models.Cashier.find().lean(),
//       models.Product.find().lean(), // Ensure all products are fetched for cost calculation
//       models.Expense.find(startDate && endDate ? {
//         date: { $gte: new Date(startDate), $lte: new Date(endDate) }
//       } : {}).populate('shop', 'name').lean(),
//       models.Credit.find(startDate && endDate ? {
//         createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
//       } : {}).populate('transactionId').populate('shop').populate('cashierId').lean()
//     ]);

//     console.log(`✅ Enhanced transaction data fetched: ${transactions.length} transactions, ${products.length} products, ${credits.length} credits`);

//     // Process data using enhanced utility
//     const processedData = await CalculationUtils.processComprehensiveData({
//       transactions,
//       shops,
//       cashiers,
//       products, // Pass products for cost calculation
//       expenses,
//       credits
//     }, shopId);

//     return processedData;

//   } catch (error) {
//     console.error('❌ Error in getAllTransactionData:', error);
//     throw error;
//   }
// };

// // ==================== ENHANCED CREDIT SALE WITH COMPLETE UPFRONT PAYMENT SUPPORT ====================

// // ENHANCED TRANSACTION CREATION WITH COMPLETE UPFRONT CREDIT SUPPORT
// app.post('/api/transactions', async (req, res) => {
//   try {
//     const transactionData = req.body;
    
//     console.log('💳 Creating transaction with complete upfront credit support:', {
//       paymentMethod: transactionData.paymentMethod,
//       totalAmount: transactionData.totalAmount,
//       amountPaidNow: transactionData.amountPaidNow,
//       isCreditPayment: transactionData.isCreditPayment,
//       originalCreditId: transactionData.originalCreditId,
//       upfrontPaymentMethod: transactionData.upfrontPaymentMethod
//     });

//     // Check for duplicate transaction
//     if (transactionData.transactionNumber) {
//       const existingTransaction = await models.Transaction.findOne({ 
//         transactionNumber: transactionData.transactionNumber 
//       });
      
//       if (existingTransaction) {
//         console.log('⚠️ Duplicate transaction detected:', transactionData.transactionNumber);
//         return res.status(409).json({
//           success: false,
//           message: 'Transaction with this number already exists'
//         });
//       }
//     }

//     // Handle credit payment (part payment of existing credit)
//     if (transactionData.isCreditPayment && transactionData.originalCreditId) {
//       return await handleCreditPayment(transactionData, res);
//     }

//     // Auto-populate shop and cashier information
//     if (transactionData.shop) {
//       const shop = await models.Shop.findById(transactionData.shop);
//       if (shop) {
//         transactionData.shopName = shop.name;
//         transactionData.shopId = shop._id;
//       }
//     }

//     if (transactionData.cashierId) {
//       const cashier = await models.Cashier.findById(transactionData.cashierId);
//       if (cashier) {
//         transactionData.cashierName = cashier.name;
//       }
//     }

//     // Calculate detailed metrics for each item and reduce stock
//     const items = transactionData.items || [];
//     let totalAmount = 0;
//     let totalCost = 0;

//     const enhancedItems = await Promise.all(items.map(async (item) => {
//       const quantity = CalculationUtils.safeNumber(item.quantity, 1);
//       const price = CalculationUtils.safeNumber(item.price);
//       const buyingPrice = CalculationUtils.safeNumber(item.buyingPrice);
//       const itemTotalPrice = price * quantity;
//       const itemCost = buyingPrice * quantity;
//       const itemProfit = itemTotalPrice - itemCost;
//       const itemProfitMargin = itemTotalPrice > 0 ? (itemProfit / itemTotalPrice) * 100 : 0;

//       totalAmount += itemTotalPrice;
//       totalCost += itemCost;

//       // REDUCE STOCK FOR THE PRODUCT (only for new sales, not credit payments)
//       if (item.productId && !transactionData.isCreditPayment) {
//         try {
//           const product = await models.Product.findById(item.productId);
//           if (product) {
//             const currentStock = CalculationUtils.safeNumber(product.currentStock);
//             const newStock = Math.max(0, currentStock - quantity);
            
//             await models.Product.findByIdAndUpdate(item.productId, {
//               currentStock: newStock,
//               updatedAt: new Date()
//             });
            
//             console.log(`📦 Stock reduced for ${product.name}: ${currentStock} -> ${newStock} (sold: ${quantity})`);
//           }
//         } catch (stockError) {
//           console.error('❌ Error reducing stock for product:', item.productId, stockError);
//         }
//       }

//       return {
//         ...item,
//         quantity,
//         price,
//         totalPrice: itemTotalPrice,
//         buyingPrice,
//         cost: itemCost,
//         profit: itemProfit,
//         profitMargin: itemProfitMargin
//       };
//     }));

//     // ENHANCED: Handle partial payment for credit sales with upfront payment support
//     const amountPaidNow = CalculationUtils.safeNumber(transactionData.amountPaidNow) || 0;
//     const isCreditTransaction = transactionData.paymentMethod === 'credit';
    
//     let recognizedRevenue = totalAmount;
//     let outstandingRevenue = 0;
//     let amountPaid = totalAmount;
//     let creditStatus = 'completed';

//     if (isCreditTransaction) {
//       // For credit sales with partial payment
//       amountPaid = amountPaidNow;
//       recognizedRevenue = amountPaidNow;
//       outstandingRevenue = Math.max(0, totalAmount - amountPaidNow);
      
//       // Determine credit status based on payment
//       if (outstandingRevenue <= 0) {
//         creditStatus = 'paid';
//       } else if (amountPaidNow > 0) {
//         creditStatus = 'partially_paid';
//       } else {
//         creditStatus = 'pending';
//       }
//     }

//     const profit = recognizedRevenue - totalCost;
//     const profitMargin = recognizedRevenue > 0 ? (profit / recognizedRevenue) * 100 : 0;

//     transactionData.totalAmount = totalAmount;
//     transactionData.cost = totalCost;
//     transactionData.profit = profit;
//     transactionData.profitMargin = profitMargin;
//     transactionData.itemsCount = items.reduce((sum, item) => sum + CalculationUtils.safeNumber(item.quantity, 1), 0);
//     transactionData.items = enhancedItems;

//     // ENHANCED: Initialize payment split with upfront credit support
//     transactionData.paymentSplit = {
//       cash: 0,
//       bank_mpesa: 0,
//       credit: 0,
//       upfront_cash: 0,
//       upfront_bank_mpesa: 0
//     };

//     // Handle credit transactions with upfront payment support
//     if (isCreditTransaction) {
//       transactionData.isCreditTransaction = true;
//       transactionData.creditStatus = creditStatus;
//       transactionData.recognizedRevenue = recognizedRevenue;
//       transactionData.outstandingRevenue = outstandingRevenue;
//       transactionData.amountPaid = amountPaid;
//       transactionData.status = 'credit';
      
//       // Track immediate revenue for cashier dashboard
//       transactionData.immediateRevenue = amountPaidNow;
      
//       // Store credit shop classification
//       transactionData.creditShopName = transactionData.creditShopName || transactionData.shopName;
//       transactionData.creditShopId = transactionData.creditShopId || transactionData.shopId;
//       transactionData.shopClassification = transactionData.shopClassification || transactionData.shopName;
      
//       // ENHANCED: Track upfront payment details
//       transactionData.upfrontPaymentDetails = {
//         amount: amountPaidNow,
//         method: transactionData.upfrontPaymentMethod || 'cash',
//         split: {
//           cash: 0,
//           bank_mpesa: 0
//         }
//       };

//       // ENHANCED: Update payment split for credit transactions with upfront payment support
//       if (amountPaidNow > 0) {
//         // For credit sales with upfront payment, track the payment method
//         if (transactionData.upfrontPaymentMethod === 'cash') {
//           transactionData.paymentSplit.upfront_cash = amountPaidNow;
//           transactionData.upfrontPaymentDetails.split.cash = amountPaidNow;
//         } else if (transactionData.upfrontPaymentMethod === 'bank_mpesa') {
//           transactionData.paymentSplit.upfront_bank_mpesa = amountPaidNow;
//           transactionData.upfrontPaymentDetails.split.bank_mpesa = amountPaidNow;
//         } else if (transactionData.upfrontPaymentMethod === 'cash_bank_mpesa' && transactionData.upfrontPaymentSplit) {
//           transactionData.paymentSplit.upfront_cash = CalculationUtils.safeNumber(transactionData.upfrontPaymentSplit.cash);
//           transactionData.paymentSplit.upfront_bank_mpesa = CalculationUtils.safeNumber(transactionData.upfrontPaymentSplit.bank_mpesa);
//           transactionData.upfrontPaymentDetails.split.cash = CalculationUtils.safeNumber(transactionData.upfrontPaymentSplit.cash);
//           transactionData.upfrontPaymentDetails.split.bank_mpesa = CalculationUtils.safeNumber(transactionData.upfrontPaymentSplit.bank_mpesa);
//         }
//       }
      
//       // CREDIT UPDATE: Only show the remaining balance (outstandingRevenue) on credit side
//       transactionData.paymentSplit.credit = outstandingRevenue;
      
//       // Set due date if not provided (default 30 days)
//       if (!transactionData.dueDate) {
//         transactionData.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
//       }
//     } else {
//       transactionData.isCreditTransaction = false;
//       transactionData.recognizedRevenue = recognizedRevenue;
//       transactionData.outstandingRevenue = 0;
//       transactionData.amountPaid = amountPaid;
//       transactionData.status = 'completed';
//       transactionData.immediateRevenue = totalAmount;
      
//       // ENHANCED: Update payment split for non-credit transactions
//       if (transactionData.paymentMethod === 'cash') {
//         transactionData.paymentSplit.cash = totalAmount;
//       } else if (['mpesa', 'bank', 'card', 'bank_mpesa'].includes(transactionData.paymentMethod)) {
//         transactionData.paymentSplit.bank_mpesa = totalAmount;
//       } else if (transactionData.paymentMethod === 'cash_bank_mpesa' && transactionData.paymentSplit) {
//         // Use provided split
//         transactionData.paymentSplit.cash = CalculationUtils.safeNumber(transactionData.paymentSplit.cash);
//         transactionData.paymentSplit.bank_mpesa = CalculationUtils.safeNumber(transactionData.paymentSplit.bank_mpesa);
//       }
//     }

//     // Generate transaction number if not provided
//     if (!transactionData.transactionNumber) {
//       transactionData.transactionNumber = `TXN-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 5)}`;
//     }

//     const transaction = new models.Transaction(transactionData);
//     await transaction.save();
    
//     await transaction.populate('shop', 'name location type');
//     await transaction.populate('cashierId', 'name email');
//     await transaction.populate('items.productId', 'name buyingPrice');

//     // Create credit record ONLY if this is a credit transaction AND doesn't already exist
//     if (isCreditTransaction && !transactionData.isCreditPayment) {
//       // Check if credit record already exists to prevent duplication
//       const existingCredit = await models.Credit.findOne({ 
//         transactionId: transaction._id 
//       });
      
//       if (!existingCredit) {
//         const creditData = {
//           transactionId: transaction._id,
//           customerName: transactionData.customerName || 'Unknown Customer',
//           customerPhone: transactionData.customerPhone,
//           customerEmail: transactionData.customerEmail,
//           totalAmount: totalAmount,
//           amountPaid: amountPaidNow,
//           balanceDue: outstandingRevenue, // This now shows only the remaining balance
//           dueDate: transactionData.dueDate,
//           status: creditStatus,
//           shop: transactionData.shop,
//           shopId: transactionData.shopId,
//           shopName: transactionData.shopName,
//           creditShopName: transactionData.creditShopName || transactionData.shopName,
//           creditShopId: transactionData.creditShopId || transactionData.shopId,
//           shopClassification: transactionData.shopClassification || transactionData.shopName,
//           cashierId: transactionData.cashierId,
//           cashierName: transactionData.cashierName,
//           recordedBy: transactionData.recordedBy || 'System',
//           notes: `Credit transaction created for ${transactionData.customerName}`,
//           // NEW: Store upfront payment details in credit record
//           upfrontPayment: {
//             amount: amountPaidNow,
//             method: transactionData.upfrontPaymentMethod || 'cash',
//             split: {
//               cash: transactionData.paymentSplit.upfront_cash || 0,
//               bank_mpesa: transactionData.paymentSplit.upfront_bank_mpesa || 0
//             }
//           }
//         };

//         // Add initial payment to history if partial payment was made
//         if (amountPaidNow > 0) {
//           creditData.paymentHistory = [{
//             amount: amountPaidNow,
//             paymentDate: new Date(),
//             paymentMethod: transactionData.upfrontPaymentMethod || 'cash',
//             recordedBy: transactionData.recordedBy || 'System',
//             cashierName: transactionData.cashierName,
//             notes: `Initial upfront payment for credit sale`,
//             isUpfrontPayment: true // NEW: Mark as upfront payment
//           }];
//         }

//         const credit = await models.Credit.create(creditData);
//         console.log('✅ Credit record created with upfront payment support:', {
//           creditId: credit._id,
//           totalAmount: credit.totalAmount,
//           amountPaid: credit.amountPaid,
//           balanceDue: credit.balanceDue, // This now shows only the remaining balance
//           status: credit.status,
//           upfrontPayment: credit.upfrontPayment
//         });
//       } else {
//         console.log('⚠️ Credit record already exists for transaction:', transaction._id);
//       }
//     }

//     console.log('✅ Transaction created successfully with upfront credit support:', {
//       transactionId: transaction._id,
//       totalAmount: totalAmount,
//       amountPaid: amountPaid,
//       recognizedRevenue: recognizedRevenue,
//       outstandingRevenue: outstandingRevenue, // This is what will be displayed on credit side
//       immediateRevenue: transactionData.immediateRevenue,
//       cost: totalCost,
//       profit: profit,
//       paymentMethod: transactionData.paymentMethod,
//       isCredit: isCreditTransaction,
//       paymentSplit: transactionData.paymentSplit, // ENHANCED: Includes upfront payment tracking
//       upfrontPaymentDetails: transactionData.upfrontPaymentDetails,
//       itemsSold: transactionData.itemsCount
//     });

//     res.status(201).json({
//       success: true,
//       data: transaction,
//       message: `Transaction created successfully${isCreditTransaction ? ' with credit record' : ''}`,
//       creditDetails: isCreditTransaction ? {
//         totalAmount,
//         amountPaid: amountPaidNow,
//         balanceDue: outstandingRevenue, // Show only balance due
//         status: creditStatus,
//         upfrontPayment: transactionData.upfrontPaymentDetails
//       } : null
//     });
//   } catch (error) {
//     console.error('Error creating transaction:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create transaction',
//       error: error.message
//     });
//   }
// });

// // Handle credit payment (part payment of existing credit)
// async function handleCreditPayment(transactionData, res) {
//   try {
//     console.log('💰 Processing credit payment:', {
//       originalCreditId: transactionData.originalCreditId,
//       paymentAmount: transactionData.totalAmount,
//       paymentMethod: transactionData.paymentMethod
//     });

//     // Find the original credit record
//     const originalCredit = await models.Credit.findById(transactionData.originalCreditId)
//       .populate('transactionId')
//       .populate('shop', 'name location type');

//     if (!originalCredit) {
//       return res.status(404).json({
//         success: false,
//         message: 'Original credit record not found'
//       });
//     }

//     const paymentAmount = CalculationUtils.safeNumber(transactionData.totalAmount);
//     const currentAmountPaid = CalculationUtils.safeNumber(originalCredit.amountPaid);
//     const newAmountPaid = currentAmountPaid + paymentAmount;
//     const totalAmount = CalculationUtils.safeNumber(originalCredit.totalAmount);
//     const newBalanceDue = Math.max(0, totalAmount - newAmountPaid);

//     // Update the credit record
//     originalCredit.amountPaid = newAmountPaid;
//     originalCredit.balanceDue = newBalanceDue; // This now shows only the remaining balance
    
//     // Update status
//     let newStatus = originalCredit.status;
//     if (newBalanceDue <= 0) {
//       newStatus = 'paid';
//     } else if (newAmountPaid > 0) {
//       newStatus = 'partially_paid';
//     }
//     originalCredit.status = newStatus;

//     // Add payment to history
//     originalCredit.paymentHistory.push({
//       amount: paymentAmount,
//       paymentMethod: transactionData.paymentMethod,
//       recordedBy: transactionData.recordedBy || 'System',
//       cashierName: transactionData.cashierName || 'Cashier',
//       paymentDate: new Date(),
//       notes: `Credit payment of ${CalculationUtils.formatCurrency(paymentAmount)}`
//     });

//     originalCredit.updatedAt = new Date();
//     await originalCredit.save();

//     // Update the original transaction
//     if (originalCredit.transactionId) {
//       await models.Transaction.findByIdAndUpdate(originalCredit.transactionId, {
//         amountPaid: newAmountPaid,
//         recognizedRevenue: newAmountPaid,
//         outstandingRevenue: newBalanceDue, // This now shows only the remaining balance
//         creditStatus: newStatus,
//         updatedAt: new Date()
//       });
//     }

//     // ENHANCED: Payment split for credit payments
//     const paymentSplit = {
//       cash: 0,
//       bank_mpesa: 0,
//       credit: 0,
//       upfront_cash: 0,
//       upfront_bank_mpesa: 0
//     };

//     if (transactionData.paymentMethod === 'cash') {
//       paymentSplit.cash = paymentAmount;
//     } else if (['mpesa', 'bank', 'card', 'bank_mpesa'].includes(transactionData.paymentMethod)) {
//       paymentSplit.bank_mpesa = paymentAmount;
//     } else if (transactionData.paymentMethod === 'cash_bank_mpesa' && transactionData.paymentSplit) {
//       paymentSplit.cash = CalculationUtils.safeNumber(transactionData.paymentSplit.cash);
//       paymentSplit.bank_mpesa = CalculationUtils.safeNumber(transactionData.paymentSplit.bank_mpesa);
//     }

//     // Create a new transaction record for the payment
//     const paymentTransactionData = {
//       ...transactionData,
//       isCreditPayment: true,
//       originalCreditId: originalCredit._id,
//       transactionNumber: `PAY-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 5)}`,
//       // For credit payments, the revenue should be recognized immediately
//       recognizedRevenue: paymentAmount,
//       outstandingRevenue: 0,
//       amountPaid: paymentAmount,
//       immediateRevenue: paymentAmount, // Track immediate revenue
//       isCreditTransaction: false, // This is a payment, not a new credit
//       creditStatus: null,
//       status: 'completed',
//       paymentSplit: paymentSplit // Include payment split
//     };

//     const paymentTransaction = new models.Transaction(paymentTransactionData);
//     await paymentTransaction.save();

//     console.log('✅ Credit payment processed successfully:', {
//       creditId: originalCredit._id,
//       paymentAmount,
//       newAmountPaid,
//       newBalanceDue, // This now shows only the remaining balance
//       status: newStatus,
//       paymentTransactionId: paymentTransaction._id,
//       paymentSplit: paymentSplit
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         credit: originalCredit,
//         paymentTransaction: paymentTransaction
//       },
//       message: `Credit payment of ${CalculationUtils.formatCurrency(paymentAmount)} recorded successfully. New balance: ${CalculationUtils.formatCurrency(newBalanceDue)}`
//     });

//   } catch (error) {
//     console.error('❌ Error processing credit payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to process credit payment',
//       error: error.message
//     });
//   }
// }

// // ==================== COMPLETE API ENDPOINTS ====================

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     app: process.env.APP_NAME || 'Seridah Chemist Management',
//     version: process.env.APP_VERSION || '1.0.0',
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
//     email: emailTransporter ? 'configured' : 'disabled',
//     authentication: 'email-based-secure-code',
//     cogsCalculation: 'complete_sales_plus_credit_sales_made',
//     creditPartialPayment: 'supported',
//     immediateRevenueTracking: 'enabled',
//     upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//     creditDisplayLogic: 'balance_due_only'
//   });
// });

// // ==================== AUTHENTICATION ROUTES ====================

// // Request secure login code
// app.post('/api/auth/request-code',
//   [
//     body('email').isEmail().normalizeEmail()
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid email address',
//           details: errors.array()
//         });
//       }

//       const { email } = req.body;
//       console.log('📧 Secure code request for:', email);

//       const user = await models.User.findOne({ email }) || 
//                    await models.Cashier.findOne({ email });

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: 'No account found with this email address'
//         });
//       }

//       const secureCode = generateSecureCode();
//       const expiresAt = new Date();
//       expiresAt.setMinutes(expiresAt.getMinutes() + 15);

//       const hashedCode = await bcrypt.hash(secureCode, 10);
      
//       await models.SecureCode.findOneAndUpdate(
//         { email },
//         {
//           code: hashedCode,
//           expiresAt,
//           attempts: 0,
//           used: false
//         },
//         { upsert: true, new: true }
//       );

//       if (!emailTransporter) {
//         return res.json({
//           success: true,
//           message: 'Secure code generated (email service disabled)',
//           developmentMode: true,
//           secureCode: secureCode,
//           expiresIn: 15
//         });
//       }

//       try {
//         await sendSecureCodeEmail(email, secureCode);
//         res.json({
//           success: true,
//           message: 'Secure code sent to your email',
//           expiresIn: 15
//         });
//       } catch (emailError) {
//         console.error('❌ Failed to send email:', emailError);
//         await models.SecureCode.deleteOne({ email });
//         res.status(500).json({
//           success: false,
//           message: 'Failed to send secure code. Please try again later.'
//         });
//       }

//     } catch (error) {
//       console.error('❌ Error requesting secure code:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to process request. Please try again later.',
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   }
// );

// // Verify secure login code
// app.post('/api/auth/verify-code',
//   [
//     body('email').isEmail().normalizeEmail(),
//     body('code').isLength({ min: 6, max: 6 }).isNumeric()
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid input data',
//           details: errors.array()
//         });
//       }

//       const { email, code } = req.body;
//       console.log('🔐 Secure code verification for:', email);

//       // Find the secure code
//       const secureCode = await models.SecureCode.findOne({ email });
//       if (!secureCode) {
//         return res.status(404).json({
//           success: false,
//           message: 'No secure code found for this email. Please request a new code.'
//         });
//       }

//       // Check if code is expired
//       if (new Date() > secureCode.expiresAt) {
//         await models.SecureCode.deleteOne({ email });
//         return res.status(400).json({
//           success: false,
//           message: 'Secure code has expired. Please request a new code.'
//         });
//       }

//       // Check if code is already used
//       if (secureCode.used) {
//         return res.status(400).json({
//           success: false,
//           message: 'Secure code has already been used. Please request a new code.'
//         });
//       }

//       // Check attempts
//       if (secureCode.attempts >= 5) {
//         await models.SecureCode.deleteOne({ email });
//         return res.status(400).json({
//           success: false,
//           message: 'Too many failed attempts. Please request a new code.'
//         });
//       }

//       // Verify code
//       const isValidCode = await bcrypt.compare(code, secureCode.code);
//       if (!isValidCode) {
//         secureCode.attempts += 1;
//         await secureCode.save();
        
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid secure code',
//           attemptsRemaining: 5 - secureCode.attempts
//         });
//       }

//       // Code is valid - mark as used
//       secureCode.used = true;
//       await secureCode.save();

//       // Find user
//       const user = await models.User.findOne({ email }) || 
//                    await models.Cashier.findOne({ email });

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: 'User account not found'
//         });
//       }

//       // Update last login
//       user.lastLogin = new Date();
//       await user.save();

//       // Generate token
//       const token = generateAuthToken(user._id, user.email, user.role);

//       const userData = {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         lastLogin: user.lastLogin
//       };

//       // Add shop info for cashiers
//       if (user.role === 'cashier' && user.shopId) {
//         userData.shopId = user.shopId;
//         userData.shopName = user.shopName;
//       }

//       req.session.user = userData;
//       req.session.token = token;

//       console.log('✅ Secure code verification successful for:', email);

//       res.json({
//         success: true,
//         user: userData,
//         token: token,
//         message: 'Login successful'
//       });

//     } catch (error) {
//       console.error('❌ Error verifying secure code:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to verify code. Please try again.',
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   }
// );

// // Cashier login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }

//     const cashier = await models.Cashier.findOne({ email: email.toLowerCase().trim() })
//       .populate('shopId', 'name location');
    
//     if (!cashier || cashier.status !== 'active') {
//       return res.status(404).json({
//         success: false,
//         message: 'Cashier account not found or inactive'
//       });
//     }

//     let isPasswordValid = false;
//     if (cashier.password) {
//       if (cashier.password.startsWith('$2b$')) {
//         isPasswordValid = await bcrypt.compare(password, cashier.password);
//       } else {
//         isPasswordValid = cashier.password === password;
//       }
//     }

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid password'
//       });
//     }

//     cashier.lastLogin = new Date();
//     await cashier.save();

//     const token = generateAuthToken(cashier._id, cashier.email, cashier.role);

//     const userData = {
//       _id: cashier._id,
//       name: cashier.name,
//       email: cashier.email,
//       phone: cashier.phone,
//       role: cashier.role,
//       status: cashier.status,
//       lastLogin: cashier.lastLogin,
//       shopId: cashier.shopId?._id || null,
//       shopName: cashier.shopId?.name || cashier.shopName || null
//     };

//     req.session.user = userData;
//     req.session.token = token;

//     res.json({
//       success: true,
//       user: userData,
//       token: token,
//       message: 'Cashier login successful'
//     });

//   } catch (error) {
//     console.error('❌ Cashier login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login. Please try again.'
//     });
//   }
// });
// // Add this to your server code for debugging
// app.post('/api/debug/credit-transaction', async (req, res) => {
//   try {
//     const transactionData = req.body;
    
//     console.log('🔍 DEBUG - Transaction data received:', {
//       paymentMethod: transactionData.paymentMethod,
//       totalAmount: transactionData.totalAmount,
//       amountPaidNow: transactionData.amountPaidNow,
//       upfrontPaymentMethod: transactionData.upfrontPaymentMethod,
//       upfrontPaymentSplit: transactionData.upfrontPaymentSplit,
//       isCreditTransaction: transactionData.paymentMethod === 'credit'
//     });

//     // Simulate what should happen
//     const amountPaidNow = CalculationUtils.safeNumber(transactionData.amountPaidNow) || 0;
//     const totalAmount = CalculationUtils.safeNumber(transactionData.totalAmount);
//     const balanceDue = Math.max(0, totalAmount - amountPaidNow);

//     console.log('🔍 DEBUG - Expected credit record:', {
//       totalAmount,
//       amountPaid: amountPaidNow,
//       balanceDue, // This should be the remaining balance only
//       upfrontPayment: {
//         amount: amountPaidNow,
//         method: transactionData.upfrontPaymentMethod,
//         split: transactionData.upfrontPaymentSplit
//       }
//     });

//     res.json({
//       success: true,
//       debug: {
//         received: {
//           amountPaidNow: transactionData.amountPaidNow,
//           upfrontPaymentMethod: transactionData.upfrontPaymentMethod,
//           upfrontPaymentSplit: transactionData.upfrontPaymentSplit
//         },
//         expected: {
//           totalAmount,
//           amountPaid: amountPaidNow,
//           balanceDue,
//           upfrontPayment: {
//             amount: amountPaidNow,
//             method: transactionData.upfrontPaymentMethod,
//             split: transactionData.upfrontPaymentSplit
//           }
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Debug error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Debug failed',
//       error: error.message
//     });
//   }
// });
// // ==================== COMBINED TRANSACTION ENDPOINTS ====================

// app.get('/api/transactions/combined', async (req, res) => {
//   try {
//     const {
//       startDate,
//       endDate,
//       shopId,
//       cashierId,
//       paymentMethod,
//       dataType = 'all'
//     } = req.query;

//     console.log('🚀 Processing enhanced combined transaction endpoint...', req.query);

//     const startTime = Date.now();
    
//     const filters = {
//       startDate,
//       endDate,
//       shopId,
//       cashierId,
//       paymentMethod
//     };

//     const transactionData = await getAllTransactionData(filters);
//     const processingTime = Date.now() - startTime;

//     console.log(`✅ Enhanced combined transaction data generated in ${processingTime}ms`);

//     let responseData = {
//       success: true,
//       data: transactionData,
//       processingTime,
//       message: 'Combined transaction data fetched successfully',
//       cogsMethodology: 'complete_sales_plus_credit_sales_made',
//       creditPartialPayment: 'supported',
//       immediateRevenueTracking: 'enabled',
//       upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//       creditDisplayLogic: 'balance_due_only'
//     };

//     if (dataType !== 'all') {
//       switch (dataType) {
//         case 'basic':
//           responseData.data = {
//             transactions: transactionData.salesWithProfit,
//             summary: transactionData.summary
//           };
//           break;
//         case 'enhanced':
//           responseData.data = {
//             transactions: transactionData.salesWithProfit,
//             summary: transactionData.financialStats,
//             credits: transactionData.credits
//           };
//           break;
//         case 'sales':
//           responseData.data = {
//             transactions: transactionData.salesWithProfit,
//             summary: transactionData.summary,
//             performance: transactionData.performance
//           };
//           break;
//         case 'withCredits':
//           responseData.data = {
//             transactions: transactionData.salesWithProfit,
//             credits: transactionData.credits,
//             summary: {
//               ...transactionData.summary,
//               creditSummary: {
//                 totalCredits: transactionData.credits.length,
//                 totalCreditAmount: transactionData.summary.totalCreditGiven,
//                 outstandingCredit: transactionData.summary.outstandingCredit,
//                 recognizedCreditRevenue: transactionData.summary.recognizedCreditRevenue,
//                 totalUpfrontPayments: transactionData.summary.totalUpfrontPayments // NEW: Include upfront payments
//               }
//             }
//           };
//           break;
//         case 'optimized':
//           responseData.data = {
//             comprehensiveReport: transactionData.comprehensiveReport,
//             salesSummary: {
//               financialStats: transactionData.financialStats,
//               topProducts: transactionData.performance.topProducts,
//               topCashiers: transactionData.performance.topCashiers
//             },
//             enhancedStats: transactionData.enhancedStats,
//             filteredTransactions: transactionData.salesWithProfit
//           };
//           break;
//         case 'metrics-only':
//           responseData.data = {
//             metrics: transactionData.financialStats,
//             period: {
//               startDate: startDate || 'All time',
//               endDate: endDate || 'All time'
//             }
//           };
//           break;
//       }
//     }

//     res.json(responseData);

//   } catch (error) {
//     console.error('❌ Error in enhanced combined transaction endpoint:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch combined transaction data',
//       error: error.message,
//       processingTime: 0
//     });
//   }
// });

// // SPECIFIC METRICS ENDPOINT - Returns exactly the 12 metrics shown in the image with upfront credit support
// app.get('/api/transactions/metrics', async (req, res) => {
//   try {
//     const {
//       startDate,
//       endDate,
//       shopId,
//       cashierId
//     } = req.query;

//     console.log('📈 Fetching specific transaction metrics with upfront credit support...', req.query);

//     const filters = {
//       startDate,
//       endDate,
//       shopId,
//       cashierId
//     };

//     const transactionData = await getAllTransactionData(filters);

//     // Extract exactly the 12 metrics shown in the image with upfront credit support
//     const metrics = {
//       // 1. Total Sales
//       totalSales: {
//         amount: transactionData.financialStats.totalRevenue,
//         count: transactionData.financialStats.totalSales,
//         description: `${transactionData.financialStats.totalSales} transactions`
//       },
      
//       // 2. Credit Sales
//       creditSales: {
//         amount: transactionData.financialStats.creditSales,
//         count: transactionData.financialStats.creditSalesCount,
//         description: `${transactionData.financialStats.creditSalesCount} credit transactions`
//       },
      
//       // 3. Non-Credit Sales
//       nonCreditSales: {
//         amount: transactionData.financialStats.nonCreditSales,
//         count: transactionData.financialStats.nonCreditSalesCount,
//         description: `${transactionData.financialStats.nonCreditSalesCount} complete transaction/skell immediately`
//       },
      
//       // 4. Total Revenue
//       totalRevenue: {
//         amount: transactionData.financialStats.totalRevenue,
//         description: 'From credit & non-credit sales (includes upfront payments)'
//       },
      
//       // 5. Expenses
//       expenses: {
//         amount: transactionData.financialStats.totalExpenses,
//         description: 'Total operational costs'
//       },
      
//       // 6. Gross Profit
//       grossProfit: {
//         amount: transactionData.financialStats.grossProfit,
//         description: 'Revenue - Cost of Goods'
//       },
      
//       // 7. Net Profit
//       netProfit: {
//         amount: transactionData.financialStats.netProfit,
//         description: 'After all expenses'
//       },
      
//       // 8. Cost of Goods Sold
//       costOfGoodsSold: {
//         amount: transactionData.financialStats.costOfGoodsSold,
//         description: 'For credit & non-credit sales'
//       },
      
//       // 9. Total Mpesa/Bank
//       totalMpesaBank: {
//         amount: transactionData.financialStats.totalMpesaBank,
//         description: 'Digital payments (includes upfront credit payments)'
//       },
      
//       // 10. Total Cash
//       totalCash: {
//         amount: transactionData.financialStats.totalCash,
//         description: 'Cash payments (includes upfront credit payments)'
//       },
      
//       // 11. Outstanding Credit
//       outstandingCredit: {
//         amount: transactionData.financialStats.outstandingCredit,
//         description: 'Unpaid credit balance only'
//       },
      
//       // 12. Total Credit Given
//       totalCreditGiven: {
//         amount: transactionData.financialStats.totalCreditGiven,
//         description: 'Total credit extended'
//       },

//       // NEW: Upfront Payment Metrics
//       upfrontPayments: {
//         amount: transactionData.financialStats.totalUpfrontPayments,
//         description: 'Upfront payments on credit sales'
//       }
//     };

//     res.json({
//       success: true,
//       data: metrics,
//       period: {
//         startDate: startDate || 'All time',
//         endDate: endDate || 'All time'
//       },
//       message: 'Transaction metrics fetched successfully',
//       cogsCalculation: 'complete_sales_plus_credit_sales_made',
//       creditPartialPayment: 'supported',
//       immediateRevenueTracking: 'enabled',
//       upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//       creditDisplayLogic: 'balance_due_only'
//     });

//   } catch (error) {
//     console.error('❌ Error fetching transaction metrics:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transaction metrics',
//       error: error.message
//     });
//   }
// });

// // ENHANCED TRANSACTIONS WITH CREDIT DETAILS
// app.get('/api/transactions/with-credits', async (req, res) => {
//   try {
//     const {
//       startDate,
//       endDate,
//       shopId,
//       cashierId,
//       includeCreditDetails = 'true'
//     } = req.query;

//     const filters = {
//       startDate,
//       endDate,
//       shopId,
//       cashierId
//     };

//     const transactionData = await getAllTransactionData(filters);

//     // Enhance transactions with credit information
//     const transactionsWithCredits = transactionData.salesWithProfit.map(transaction => {
//       const creditInfo = transactionData.credits.find(credit => 
//         credit.transactionId && credit.transactionId._id && 
//         credit.transactionId._id.toString() === transaction._id.toString()
//       );

//       return {
//         ...transaction,
//         creditDetails: creditInfo ? {
//           creditId: creditInfo._id,
//           customerName: creditInfo.customerName,
//           customerPhone: creditInfo.customerPhone,
//           totalAmount: creditInfo.totalAmount,
//           amountPaid: creditInfo.amountPaid,
//           balanceDue: creditInfo.balanceDue, // This now shows only the remaining balance
//           dueDate: creditInfo.dueDate,
//           status: creditInfo.status,
//           paymentHistory: creditInfo.paymentHistory,
//           shopClassification: creditInfo.shopClassification,
//           upfrontPayment: creditInfo.upfrontPayment // NEW: Include upfront payment details
//         } : null
//       };
//     });

//     res.json({
//       success: true,
//       data: {
//         transactions: transactionsWithCredits,
//         summary: transactionData.financialStats,
//         credits: includeCreditDetails === 'true' ? transactionData.credits : [],
//         metrics: transactionData.financialStats
//       },
//       message: 'Transactions with credit details fetched successfully',
//       cogsMethodology: 'complete_sales_plus_credit_sales_made',
//       creditPartialPayment: 'supported',
//       immediateRevenueTracking: 'enabled',
//       upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//       creditDisplayLogic: 'balance_due_only'
//     });

//   } catch (error) {
//     console.error('❌ Error fetching transactions with credits:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions with credit details',
//       error: error.message
//     });
//   }
// });

// // ==================== CASHIER-SPECIFIC ENDPOINTS ====================

// // Enhanced cashier dashboard metrics endpoint with upfront credit support
// app.get('/api/cashier/dashboard-metrics', async (req, res) => {
//   try {
//     const { cashierId, shopId, startDate, endDate } = req.query;

//     if (!cashierId || !shopId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cashier ID and Shop ID are required'
//       });
//     }

//     console.log('📊 Fetching cashier-specific dashboard metrics with upfront credit support...', {
//       cashierId,
//       shopId,
//       startDate,
//       endDate
//     });

//     const filters = {
//       cashierId,
//       shopId,
//       startDate: startDate || new Date().toISOString().split('T')[0],
//       endDate: endDate || new Date().toISOString()
//     };

//     const transactionData = await getAllTransactionData(filters);
//     const financialStats = transactionData.financialStats;

//     // Enhanced cashier-specific metrics with upfront credit support
//     const cashierMetrics = {
//       // Core metrics for cashier dashboard
//       totalSales: financialStats.totalRevenue,
//       totalTransactions: financialStats.totalSales,
//       creditSales: financialStats.creditSales,
//       nonCreditSales: financialStats.nonCreditSales,
//       totalCash: financialStats.totalCash,
//       totalMpesaBank: financialStats.totalMpesaBank,
//       totalCredit: financialStats.totalCredit,
//       outstandingCredit: financialStats.outstandingCredit,
      
//       // NEW: Upfront payment metrics
//       totalUpfrontPayments: financialStats.totalUpfrontPayments,
//       totalUpfrontCash: financialStats.totalUpfrontCash,
//       totalUpfrontMpesaBank: financialStats.totalUpfrontMpesaBank,
      
//       // Performance metrics
//       itemsSold: financialStats.totalItemsSold,
//       averageTransaction: financialStats.averageTransactionValue,
//       profitMargin: financialStats.profitMargin,
      
//       // Credit performance
//       creditTransactions: financialStats.creditSalesCount,
//       creditCollectionRate: financialStats.creditCollectionRate,
//       recognizedCreditRevenue: financialStats.recognizedCreditRevenue,
      
//       // Immediate revenue tracking
//       immediateRevenue: financialStats.totalRevenue, // This includes all recognized revenue
//       creditImmediateRevenue: financialStats.recognizedCreditRevenue, // Credit portion of immediate revenue
      
//       // Metadata
//       period: {
//         startDate: filters.startDate,
//         endDate: filters.endDate
//       },
//       cashierId,
//       shopId,
//       upfrontCreditSupport: true // NEW: Indicate support
//     };

//     res.json({
//       success: true,
//       data: cashierMetrics,
//       message: 'Cashier dashboard metrics fetched successfully',
//       upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//       creditDisplayLogic: 'balance_due_only'
//     });

//   } catch (error) {
//     console.error('❌ Error fetching cashier dashboard metrics:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch cashier dashboard metrics',
//       error: error.message
//     });
//   }
// });

// // ==================== BASIC CRUD ENDPOINTS ====================

// // Products API
// app.get('/api/products', async (req, res) => {
//   try {
//     const products = await models.Product.find()
//       .populate('shop', 'name location type')
//       .sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: products,
//       count: products.length
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch products',
//       error: error.message
//     });
//   }
// });

// app.post('/api/products', async (req, res) => {
//   try {
//     const productData = req.body;
    
//     // Auto-populate shop information if shop ID is provided
//     if (productData.shop) {
//       const shop = await models.Shop.findById(productData.shop);
//       if (shop) {
//         productData.shopName = shop.name;
//         productData.shopId = shop._id;
//       }
//     }

//     const product = new models.Product(productData);
//     await product.save();
    
//     await product.populate('shop', 'name location type');
    
//     res.status(201).json({
//       success: true,
//       data: product,
//       message: 'Product created successfully'
//     });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create product',
//       error: error.message
//     });
//   }
// });

// app.put('/api/products/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const product = await models.Product.findByIdAndUpdate(
//       id,
//       { ...updateData, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     ).populate('shop', 'name location type');

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: product,
//       message: 'Product updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update product',
//       error: error.message
//     });
//   }
// });

// app.delete('/api/products/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await models.Product.findByIdAndDelete(id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Product deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete product',
//       error: error.message
//     });
//   }
// });

// // Shops API
// app.get('/api/shops', async (req, res) => {
//   try {
//     const shops = await models.Shop.find().sort({ createdAt: -1 });
//     res.json({
//       success: true,
//       data: shops,
//       count: shops.length
//     });
//   } catch (error) {
//     console.error('Error fetching shops:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch shops',
//       error: error.message
//     });
//   }
// });

// app.post('/api/shops', async (req, res) => {
//   try {
//     const shopData = req.body;

//     const shop = new models.Shop(shopData);
//     await shop.save();
    
//     res.status(201).json({
//       success: true,
//       data: shop,
//       message: 'Shop created successfully'
//     });
//   } catch (error) {
//     console.error('Error creating shop:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create shop',
//       error: error.message
//     });
//   }
// });

// app.put('/api/shops/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const shop = await models.Shop.findByIdAndUpdate(
//       id,
//       { ...updateData, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     );

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: 'Shop not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: shop,
//       message: 'Shop updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating shop:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update shop',
//       error: error.message
//     });
//   }
// });

// app.delete('/api/shops/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const shop = await models.Shop.findByIdAndDelete(id);

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: 'Shop not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Shop deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting shop:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete shop',
//       error: error.message
//     });
//   }
// });

// // Cashiers API
// app.get('/api/cashiers', async (req, res) => {
//   try {
//     const cashiers = await models.Cashier.find()
//       .populate('shopId', 'name location')
//       .sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: cashiers,
//       count: cashiers.length
//     });
//   } catch (error) {
//     console.error('Error fetching cashiers:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch cashiers',
//       error: error.message
//     });
//   }
// });

// app.post('/api/cashiers', async (req, res) => {
//   try {
//     const cashierData = req.body;

//     // Hash password if provided
//     if (cashierData.password) {
//       cashierData.password = await bcrypt.hash(cashierData.password, 10);
//     }

//     const cashier = new models.Cashier(cashierData);
//     await cashier.save();
    
//     await cashier.populate('shopId', 'name location');
    
//     res.status(201).json({
//       success: true,
//       data: cashier,
//       message: 'Cashier created successfully'
//     });
//   } catch (error) {
//     console.error('Error creating cashier:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create cashier',
//       error: error.message
//     });
//   }
// });

// app.put('/api/cashiers/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Hash password if provided
//     if (updateData.password) {
//       updateData.password = await bcrypt.hash(updateData.password, 10);
//     }

//     const cashier = await models.Cashier.findByIdAndUpdate(
//       id,
//       { ...updateData, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     ).populate('shopId', 'name location');

//     if (!cashier) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cashier not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: cashier,
//       message: 'Cashier updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating cashier:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update cashier',
//       error: error.message
//     });
//   }
// });

// app.delete('/api/cashiers/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const cashier = await models.Cashier.findByIdAndDelete(id);

//     if (!cashier) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cashier not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Cashier deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting cashier:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete cashier',
//       error: error.message
//     });
//   }
// });

// // Expenses API
// app.get('/api/expenses', async (req, res) => {
//   try {
//     const expenses = await models.Expense.find()
//       .populate('shop', 'name location')
//       .sort({ date: -1 });
    
//     res.json({
//       success: true,
//       data: expenses,
//       count: expenses.length
//     });
//   } catch (error) {
//     console.error('Error fetching expenses:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch expenses',
//       error: error.message
//     });
//   }
// });

// app.post('/api/expenses', async (req, res) => {
//   try {
//     const expenseData = req.body;
    
//     console.log('💰 Creating expense:', {
//       category: expenseData.category,
//       amount: expenseData.amount,
//       description: expenseData.description,
//       paymentMethod: expenseData.paymentMethod
//     });

//     // Auto-populate shop information if shop ID is provided
//     if (expenseData.shop) {
//       const shop = await models.Shop.findById(expenseData.shop);
//       if (shop) {
//         expenseData.shopName = shop.name;
//         expenseData.shopId = shop._id;
//       }
//     }

//     // Set default values if not provided
//     if (!expenseData.date) {
//       expenseData.date = new Date();
//     }
//     if (!expenseData.category) {
//       expenseData.category = 'General';
//     }
//     if (!expenseData.paymentMethod) {
//       expenseData.paymentMethod = 'cash';
//     }
//     if (!expenseData.status) {
//       expenseData.status = 'completed';
//     }

//     // Validate required fields
//     if (!expenseData.description || !expenseData.amount) {
//       return res.status(400).json({
//         success: false,
//         message: 'Description and amount are required fields'
//       });
//     }

//     const expense = new models.Expense(expenseData);
//     await expense.save();
    
//     await expense.populate('shop', 'name location');

//     console.log('✅ Expense created successfully:', {
//       expenseId: expense._id,
//       amount: expense.amount,
//       category: expense.category,
//       description: expense.description
//     });

//     res.status(201).json({
//       success: true,
//       data: expense,
//       message: 'Expense created successfully'
//     });
//   } catch (error) {
//     console.error('❌ Error creating expense:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create expense',
//       error: error.message
//     });
//   }
// });

// app.put('/api/expenses/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const expense = await models.Expense.findByIdAndUpdate(
//       id,
//       { ...updateData, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     ).populate('shop', 'name location');

//     if (!expense) {
//       return res.status(404).json({
//         success: false,
//         message: 'Expense not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: expense,
//       message: 'Expense updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating expense:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update expense',
//       error: error.message
//     });
//   }
// });

// app.delete('/api/expenses/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const expense = await models.Expense.findByIdAndDelete(id);

//     if (!expense) {
//       return res.status(404).json({
//         success: false,
//         message: 'Expense not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Expense deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting expense:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete expense',
//       error: error.message
//     });
//   }
// });

// // ==================== ENHANCED CREDIT API ENDPOINTS ====================

// // Create credit record - WITH DEDUPLICATION CHECK
// app.post('/api/credits', async (req, res) => {
//   try {
//     const creditData = req.body;
    
//     console.log('💳 Creating credit record with deduplication check:', {
//       transactionId: creditData.transactionId,
//       customerName: creditData.customerName
//     });

//     // Check for duplicate credit record
//     if (creditData.transactionId) {
//       const existingCredit = await models.Credit.findOne({ 
//         transactionId: creditData.transactionId 
//       });
      
//       if (existingCredit) {
//         console.log('⚠️ Credit record already exists for transaction:', creditData.transactionId);
//         return res.status(409).json({
//           success: false,
//           message: 'Credit record already exists for this transaction',
//           data: existingCredit
//         });
//       }
//     }

//     // Auto-populate shop and cashier information if not provided
//     if (creditData.transactionId) {
//       const transaction = await models.Transaction.findById(creditData.transactionId);
//       if (transaction) {
//         if (!creditData.shop) creditData.shop = transaction.shop;
//         if (!creditData.shopId) creditData.shopId = transaction.shopId;
//         if (!creditData.shopName) creditData.shopName = transaction.shopName;
//         if (!creditData.cashierId) creditData.cashierId = transaction.cashierId;
//         if (!creditData.cashierName) creditData.cashierName = transaction.cashierName;
//       }
//     }

//     // Set default values
//     if (!creditData.status) {
//       creditData.status = creditData.balanceDue > 0 ? 'pending' : 'paid';
//     }

//     if (!creditData.dueDate) {
//       creditData.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default
//     }

//     // Initialize payment history if partial payment
//     if (!creditData.paymentHistory && creditData.amountPaid > 0) {
//       creditData.paymentHistory = [{
//         amount: creditData.amountPaid,
//         paymentDate: new Date(),
//         paymentMethod: 'initial',
//         recordedBy: creditData.recordedBy || 'System',
//         cashierName: creditData.cashierName,
//         notes: 'Initial payment',
//         isUpfrontPayment: true // NEW: Mark as upfront payment
//       }];
//     }

//     const credit = new models.Credit(creditData);
//     await credit.save();
    
//     await credit.populate('transactionId');
//     await credit.populate('shop', 'name location type');
//     await credit.populate('cashierId', 'name email');

//     console.log('✅ Credit record created successfully with no duplication:', {
//       creditId: credit._id,
//       customerName: credit.customerName,
//       totalAmount: credit.totalAmount,
//       balanceDue: credit.balanceDue, // This now shows only the remaining balance
//       status: credit.status,
//       upfrontPayment: credit.upfrontPayment // NEW: Log upfront payment details
//     });

//     res.status(201).json({
//       success: true,
//       data: credit,
//       message: 'Credit record created successfully'
//     });
//   } catch (error) {
//     console.error('❌ Error creating credit record:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create credit record',
//       error: error.message
//     });
//   }
// });

// // Enhanced Credits API
// app.get('/api/credits', async (req, res) => {
//   try {
//     const { shopId, status, cashierId, startDate, endDate, includeTransactions = 'false' } = req.query;
    
//     let filter = {};
//     if (shopId && shopId !== 'all') {
//       filter.$or = [
//         { shop: shopId },
//         { shopId: shopId },
//         { creditShopId: shopId }
//       ];
//     }
//     if (status && status !== 'all') filter.status = status;
//     if (cashierId && cashierId !== 'all') {
//       filter.$or = [
//         { cashierId: cashierId },
//         { cashierName: { $regex: cashierId, $options: 'i' } }
//       ];
//     }
    
//     if (startDate && endDate) {
//       filter.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     const credits = await models.Credit.find(filter)
//       .populate('transactionId')
//       .populate('shop', 'name location type')
//       .populate('cashierId', 'name email')
//       .sort({ dueDate: 1 });

//     // Include transaction details if requested
//     let enhancedCredits = credits;
//     if (includeTransactions === 'true') {
//       enhancedCredits = await Promise.all(credits.map(async (credit) => {
//         if (credit.transactionId) {
//           const transaction = await models.Transaction.findById(credit.transactionId)
//             .populate('shop', 'name location type')
//             .populate('cashierId', 'name email')
//             .populate('items.productId', 'name buyingPrice');
//           return {
//             ...credit.toObject(),
//             transactionDetails: transaction
//           };
//         }
//         return credit;
//       }));
//     }

//     res.json({
//       success: true,
//       data: enhancedCredits,
//       count: credits.length,
//       summary: {
//         totalCredits: credits.length,
//         totalCreditAmount: credits.reduce((sum, c) => sum + CalculationUtils.safeNumber(c.totalAmount), 0),
//         totalPaid: credits.reduce((sum, c) => sum + CalculationUtils.safeNumber(c.amountPaid), 0),
//         totalOutstanding: credits.reduce((sum, c) => sum + CalculationUtils.safeNumber(c.balanceDue), 0), // This now shows only the remaining balance
//         totalUpfrontPayments: credits.reduce((sum, c) => sum + CalculationUtils.safeNumber(c.upfrontPayment?.amount || 0), 0), // NEW: Upfront payments
//         overdueCount: credits.filter(c => 
//           c.dueDate && new Date(c.dueDate) < new Date() && c.balanceDue > 0
//         ).length
//       },
//       upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//       creditDisplayLogic: 'balance_due_only'
//     });
//   } catch (error) {
//     console.error('Error fetching credits:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch credits',
//       error: error.message
//     });
//   }
// });

// // Update credit record
// app.put('/api/credits/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const credit = await models.Credit.findByIdAndUpdate(
//       id,
//       { ...updateData, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     )
//       .populate('transactionId')
//       .populate('shop', 'name location type')
//       .populate('cashierId', 'name email');

//     if (!credit) {
//       return res.status(404).json({
//         success: false,
//         message: 'Credit record not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: credit,
//       message: 'Credit record updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating credit record:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update credit record',
//       error: error.message
//     });
//   }
// });

// // Delete credit record
// app.delete('/api/credits/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const credit = await models.Credit.findByIdAndDelete(id);

//     if (!credit) {
//       return res.status(404).json({
//         success: false,
//         message: 'Credit record not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Credit record deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting credit record:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete credit record',
//       error: error.message
//     });
//   }
// });

// // Get credit by ID
// app.get('/api/credits/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { includeTransaction = 'false' } = req.query;

//     let credit = await models.Credit.findById(id)
//       .populate('shop', 'name location type')
//       .populate('cashierId', 'name email');

//     if (!credit) {
//       return res.status(404).json({
//         success: false,
//         message: 'Credit record not found'
//       });
//     }

//     // Include transaction details if requested
//     if (includeTransaction === 'true' && credit.transactionId) {
//       const transaction = await models.Transaction.findById(credit.transactionId)
//         .populate('shop', 'name location type')
//         .populate('cashierId', 'name email')
//         .populate('items.productId', 'name buyingPrice');
      
//       credit = credit.toObject();
//       credit.transactionDetails = transaction;
//     }

//     res.json({
//       success: true,
//       data: credit,
//       upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//       creditDisplayLogic: 'balance_due_only'
//     });
//   } catch (error) {
//     console.error('Error fetching credit record:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch credit record',
//       error: error.message
//     });
//   }
// });

// // ENHANCED: Handle credit payment with proper state management
// app.patch('/api/credits/:id/payment', async (req, res) => {
//   try {
//     const { amount, paymentMethod, recordedBy, cashierName, notes } = req.body;
    
//     if (!amount || !paymentMethod) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields: amount, paymentMethod'
//       });
//     }

//     const credit = await models.Credit.findById(req.params.id);
//     if (!credit) {
//       return res.status(404).json({
//         success: false,
//         message: 'Credit record not found'
//       });
//     }

//     const paymentAmount = CalculationUtils.safeNumber(amount);
//     const currentAmountPaid = CalculationUtils.safeNumber(credit.amountPaid);
//     const newAmountPaid = currentAmountPaid + paymentAmount;
//     const totalAmount = CalculationUtils.safeNumber(credit.totalAmount);
//     const newBalanceDue = Math.max(0, totalAmount - newAmountPaid);

//     // Add payment to history
//     credit.paymentHistory.push({
//       amount: paymentAmount,
//       paymentMethod,
//       recordedBy: recordedBy || 'System',
//       cashierName: cashierName || credit.cashierName,
//       paymentDate: new Date(),
//       notes: notes || `Payment of ${CalculationUtils.formatCurrency(paymentAmount)}`
//     });

//     // Update amounts
//     credit.amountPaid = newAmountPaid;
//     credit.balanceDue = newBalanceDue; // This now shows only the remaining balance

//     // Update status
//     let newStatus = credit.status;
//     if (newBalanceDue <= 0) {
//       newStatus = 'paid';
//     } else if (newAmountPaid > 0) {
//       newStatus = 'partially_paid';
//     } else {
//       newStatus = 'pending';
//     }
//     credit.status = newStatus;

//     credit.updatedAt = new Date();
//     await credit.save();

//     // Update corresponding transaction to reflect payment
//     if (credit.transactionId) {
//       await models.Transaction.findByIdAndUpdate(credit.transactionId, {
//         amountPaid: newAmountPaid,
//         recognizedRevenue: newAmountPaid,
//         outstandingRevenue: newBalanceDue, // This now shows only the remaining balance
//         creditStatus: newStatus,
//         updatedAt: new Date()
//       });
//     }

//     await credit.populate('transactionId');
//     await credit.populate('shop', 'name location type');
//     await credit.populate('cashierId', 'name email');

//     console.log('✅ Payment recorded successfully for credit:', {
//       creditId: req.params.id,
//       paymentAmount,
//       newAmountPaid,
//       newBalanceDue, // This now shows only the remaining balance
//       status: newStatus
//     });

//     res.json({
//       success: true,
//       data: credit,
//       message: `Payment of ${CalculationUtils.formatCurrency(paymentAmount)} recorded successfully`
//     });
//   } catch (error) {
//     console.error('Error recording payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to record payment',
//       error: error.message
//     });
//   }
// });

// // ==================== ADDITIONAL UTILITY ENDPOINTS ====================

// // Shop performance endpoint
// app.get('/api/transactions/shop-performance/:shopId', async (req, res) => {
//   try {
//     const { shopId } = req.params;
//     const { startDate, endDate } = req.query;
    
//     const shop = await models.Shop.findById(shopId);
//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: 'Shop not found'
//       });
//     }

//     const filters = { shopId, startDate, endDate };
//     const transactionData = await getAllTransactionData(filters);

//     res.json({
//       success: true,
//       data: {
//         performance: transactionData.financialStats,
//         transactions: transactionData.salesWithProfit,
//         credits: transactionData.credits,
//         expenses: transactionData.expenses,
//         shopDetails: shop
//       },
//       message: 'Shop performance data fetched successfully',
//       cogsMethodology: 'complete_sales_plus_credit_sales_made',
//       creditPartialPayment: 'supported',
//       immediateRevenueTracking: 'enabled',
//       upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//       creditDisplayLogic: 'balance_due_only'
//     });

//   } catch (error) {
//     console.error('❌ Error fetching shop performance:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch shop performance data',
//       error: error.message
//     });
//   }
// });

// // Debug endpoint
// app.get('/api/debug/database', async (req, res) => {
//   try {
//     const counts = {
//       products: await models.Product.countDocuments(),
//       shops: await models.Shop.countDocuments(),
//       cashiers: await models.Cashier.countDocuments(),
//       expenses: await models.Expense.countDocuments(),
//       transactions: await models.Transaction.countDocuments(),
//       users: await models.User.countDocuments(),
//       secureCodes: await models.SecureCode.countDocuments(),
//       credits: await models.Credit.countDocuments()
//     };
    
//     res.json({
//       success: true,
//       counts,
//       database: mongoose.connection.name,
//       status: 'connected',
//       cogsCalculation: 'complete_sales_plus_credit_sales_made',
//       creditPartialPayment: 'supported',
//       immediateRevenueTracking: 'enabled',
//       upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//       creditDisplayLogic: 'balance_due_only'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Database check failed',
//       error: error.message
//     });
//   }
// });

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({
//     message: process.env.APP_NAME || 'Stanzo Shop Management API',
//     version: process.env.APP_VERSION || '1.0.0',
//     status: 'running',
//     timestamp: new Date().toISOString(),
//     endpoints: {
//       metrics: '/api/transactions/metrics',
//       combined: '/api/transactions/combined',
//       withCredits: '/api/transactions/with-credits',
//       cashierMetrics: '/api/cashier/dashboard-metrics'
//     },
//     cogsCalculation: 'complete_sales_plus_credit_sales_made',
//     creditPartialPayment: 'supported',
//     immediateRevenueTracking: 'enabled',
//     upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
//     creditDisplayLogic: 'balance_due_only'
//   });
// });

// // 404 handler
// app.use('/api/*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint not found'
//   });
// });

// // ==================== SERVER START ====================

// const startServer = async () => {
//   try {
//     console.log('🚀 Starting Complete Stanzo Shop Management Server...');
//     console.log(`📋 App: ${process.env.APP_NAME || 'Stanzo Shop Management'}`);
    
//     await connectDB();
    
//     const server = app.listen(PORT, () => {
//       console.log(`\n🎉 Complete Server Started Successfully!`);
//       console.log('='.repeat(60));
//       console.log(`📍 Port: ${PORT}`);
//       console.log(`🔗 URL: http://localhost:${PORT}`);
//       console.log(`📊 Database: ${mongoose.connection.name}`);
//       console.log(`🧮 COGS Calculation: Complete Sales + Credit Sales Made`);
//       console.log(`💳 Credit Partial Payment: SUPPORTED ✅`);
//       console.log(`💰 Immediate Revenue Tracking: ENABLED ✅`);
//       console.log(`🎯 Upfront Credit Support: FULLY ENABLED ✅`); // NEW: Indicate the update
//       console.log(`📈 Credit Display: BALANCE DUE ONLY ✅`);
//       console.log(`🔧 ALL ENDPOINTS AVAILABLE:`);
//       console.log(`   - GET  /api/shops ✅`);
//       console.log(`   - GET  /api/products ✅`);
//       console.log(`   - GET  /api/cashiers ✅`);
//       console.log(`   - GET  /api/expenses ✅`);
//       console.log(`   - GET  /api/credits ✅`);
//       console.log(`   - GET  /api/transactions/combined ✅`);
//       console.log(`   - GET  /api/cashier/dashboard-metrics ✅`);
//       console.log(`   - POST /api/transactions ✅ (Upfront Credit Supported)`);
//       console.log(`   - POST /api/credits ✅ (No Duplication)`);
//       console.log('='.repeat(60));
//     });

//     return server;

//   } catch (error) {
//     console.error('💥 Server startup failed:', error);
//     process.exit(1);
//   }
// };

// // Start the server
// startServer();

// module.exports = app;




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

// ==================== ENHANCED MODELS ====================

const createModels = () => {
  console.log('🔧 Creating enhanced models...');
  
  // Enhanced Product Schema
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

  // Enhanced Shop Schema
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

  // Enhanced Cashier Schema
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

  // Enhanced Expense Schema
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

  // ENHANCED Transaction Schema with Complete Upfront Credit Support
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
    
    // Enhanced Credit Fields
    isCreditTransaction: { type: Boolean, default: false },
    creditStatus: { type: String, enum: ['pending', 'partially_paid', 'paid', 'overdue'] },
    recognizedRevenue: { type: Number, default: 0 },
    outstandingRevenue: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    dueDate: Date,
    
    // Credit sale classification fields
    creditShopName: String,
    creditShopId: String,
    shopClassification: String,
    
    // ENHANCED: Payment split tracking with upfront credit support
    paymentSplit: {
      cash: { type: Number, default: 0 },
      bank_mpesa: { type: Number, default: 0 },
      credit: { type: Number, default: 0 },
      upfront_cash: { type: Number, default: 0 },        // NEW: Track upfront cash separately
      upfront_bank_mpesa: { type: Number, default: 0 }   // NEW: Track upfront bank/mpesa separately
    },
    
    // Immediate revenue tracking for cashier
    immediateRevenue: { type: Number, default: 0 },
    
    // NEW: Upfront payment details for credit transactions
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

  // ENHANCED Credit Schema with upfront payment tracking
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
      isUpfrontPayment: { type: Boolean, default: false } // NEW: Track if payment was upfront
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
    
    // NEW: Upfront payment tracking
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

  // User Schema (for admin)
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

  // Index for automatic expiration
  secureCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  // Create or get models
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

// Initialize models immediately
let models = createModels();

// ==================== UPDATED CALCULATION UTILITIES WITH COMPLETE UPFRONT CREDIT SUPPORT ====================

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

  // UPDATED: Calculate COGS for transactions array - includes complete sales + credit sales made
  calculateCOGS: (transactions) => {
    if (!Array.isArray(transactions)) return 0;
    
    return transactions.reduce((sum, transaction) => {
      // Include COGS for both complete sales and credit sales
      // Credit sales contribute to COGS when the sale is made, not when payment is received
      const cost = CalculationUtils.safeNumber(transaction.cost);
      return sum + cost;
    }, 0);
  },

  // ENHANCED: Calculate cost from items with product data integration
  calculateCostFromItems: async (transaction, products = []) => {
    try {
      // If cost is already provided and valid, use it
      if (transaction.cost && CalculationUtils.safeNumber(transaction.cost) > 0) {
        return CalculationUtils.safeNumber(transaction.cost);
      }
      
      if (transaction.totalCost && CalculationUtils.safeNumber(transaction.totalCost) > 0) {
        return CalculationUtils.safeNumber(transaction.totalCost);
      }

      // Calculate cost from items
      if (transaction.items && Array.isArray(transaction.items)) {
        let totalCost = 0;
        
        for (const item of transaction.items) {
          const quantity = CalculationUtils.safeNumber(item.quantity, 1);
          
          // Try to get cost from different sources in priority order
          let itemCost = 0;
          
          // Priority 1: Direct cost field in item
          if (item.cost && CalculationUtils.safeNumber(item.cost) > 0) {
            itemCost = CalculationUtils.safeNumber(item.cost);
          }
          // Priority 2: Buying price field in item
          else if (item.buyingPrice && CalculationUtils.safeNumber(item.buyingPrice) > 0) {
            itemCost = CalculationUtils.safeNumber(item.buyingPrice);
          }
          // Priority 3: Look up product buying price from products array
          else if (item.productId && products.length > 0) {
            const product = products.find(p => 
              p._id && item.productId && 
              (p._id.toString() === item.productId.toString() || 
               (p._id && item.productId._id && p._id.toString() === item.productId._id.toString()))
            );
            
            if (product) {
              itemCost = CalculationUtils.safeNumber(product.buyingPrice);
              console.log(`📦 Found product buying price for ${product.name}: ${itemCost}`);
            }
          }
          // Priority 4: Use a default cost estimation (30% of price as fallback)
          else if (item.price && CalculationUtils.safeNumber(item.price) > 0) {
            itemCost = CalculationUtils.safeNumber(item.price) * 0.3; // Estimate 30% cost
            console.log(`⚠️ Using estimated cost for item: ${itemCost} (30% of price ${item.price})`);
          }

          totalCost += itemCost * quantity;
        }
        
        console.log(`🧮 Calculated cost for transaction ${transaction._id}: ${totalCost} from ${transaction.items.length} items`);
        return totalCost;
      }
      
      return 0;
    } catch (error) {
      console.error('❌ Error calculating cost from items:', error);
      return 0;
    }
  },

  // ENHANCED: Process single transaction with comprehensive cost calculation and upfront credit support
  processSingleTransaction: async (transaction, products = []) => {
    try {
      if (!transaction) return CalculationUtils.createFallbackTransaction();

      // ENHANCED: Multiple ways to detect credit transactions
      const isCredit = transaction.paymentMethod === 'credit' || 
                      transaction.isCredit === true || 
                      transaction.transactionType === 'credit' ||
                      transaction.isCreditTransaction === true ||
                      transaction.status === 'credit';
      
      // Use server-calculated values when available, otherwise calculate
      const totalAmount = CalculationUtils.safeNumber(transaction.totalAmount) || 
                         CalculationUtils.safeNumber(transaction.amount) || 0;
      
      // ENHANCED: Use the new cost calculation function with products data
      const cost = await CalculationUtils.calculateCostFromItems(transaction, products);
      
      // ENHANCED: Credit management revenue recognition logic with upfront payment support
      const amountPaid = CalculationUtils.safeNumber(transaction.amountPaid) || 
                        CalculationUtils.safeNumber(transaction.paidAmount) || 0;
      
      // UPDATED: For credit transactions, recognized revenue is the amount paid immediately (upfront payment)
      const recognizedRevenue = isCredit ? amountPaid : totalAmount;
      
      const outstandingRevenue = isCredit ? 
        (CalculationUtils.safeNumber(transaction.outstandingRevenue) || 
         CalculationUtils.safeNumber(transaction.balanceDue) || 
         Math.max(0, totalAmount - amountPaid)) : 0;

      // Calculate profit metrics
      const profit = recognizedRevenue - cost; // UPDATED: Profit based on recognized revenue
      const profitMargin = CalculationUtils.calculateProfitMargin(recognizedRevenue, profit);
      
      // Determine credit status
      let creditStatus = 'completed';
      if (isCredit) {
        if (outstandingRevenue <= 0) {
          creditStatus = 'paid';
        } else if (amountPaid > 0) {
          creditStatus = 'partially_paid';
        } else {
          creditStatus = 'pending';
        }
        
        // Check if overdue
        if (transaction.dueDate && new Date(transaction.dueDate) < new Date() && outstandingRevenue > 0) {
          creditStatus = 'overdue';
        }
      }

      // ENHANCED: Calculate payment splits with upfront credit support
      let paymentSplit = transaction.paymentSplit || {
        cash: 0,
        bank_mpesa: 0,
        credit: 0,
        upfront_cash: 0,
        upfront_bank_mpesa: 0
      };

      // If paymentSplit doesn't have upfront fields, initialize them
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
        paymentSplit, // ENHANCED: Include updated payment split
        itemsCount: transaction.items ? transaction.items.reduce((sum, item) => 
          sum + CalculationUtils.safeNumber(item.quantity, 1), 0) : 0,
        displayDate: transaction.displayDate || 
                    new Date(transaction.saleDate || transaction.createdAt).toLocaleString('en-KE')
      };
    } catch (error) {
      console.error('❌ Error processing single transaction:', error);
      return CalculationUtils.createFallbackTransaction();
    }
  },

  createFallbackTransaction: () => {
    return {
      totalAmount: 0,
      cost: 0,
      profit: 0,
      profitMargin: 0,
      isCreditTransaction: false,
      recognizedRevenue: 0,
      outstandingRevenue: 0,
      amountPaid: 0,
      creditStatus: 'completed',
      itemsCount: 0,
      displayDate: new Date().toLocaleString('en-KE')
    };
  },

  calculateTransactionMetrics: (transaction) => {
    return CalculationUtils.processSingleTransaction(transaction);
  },

  // UPDATED: Process comprehensive data with accurate COGS calculation and upfront credit support
  processComprehensiveData: async (rawData, selectedShop) => {
    const transactions = rawData.transactions || [];
    const expenses = rawData.expenses || [];
    const credits = rawData.credits || [];
    const products = rawData.products || [];
    const shops = rawData.shops || [];
    const cashiers = rawData.cashiers || [];

    console.log('🔄 Processing comprehensive data with enhanced upfront credit support...', {
      transactions: transactions.length,
      products: products.length
    });

    // Enhanced sales with profit calculation using the new processSingleTransaction
    const salesWithProfit = await Promise.all(
      transactions.map(transaction => 
        CalculationUtils.processSingleTransaction(transaction, products)
      )
    );

    // Filter transactions based on shop if provided
    const filteredTransactions = selectedShop && selectedShop !== 'all' ? 
      salesWithProfit.filter(t => 
        t.shop === selectedShop || t.shopId === selectedShop
      ) : salesWithProfit;

    // Calculate all required metrics
    const totalTransactions = filteredTransactions.length;
    const creditTransactions = filteredTransactions.filter(t => t.isCreditTransaction);
    const nonCreditTransactions = filteredTransactions.filter(t => !t.isCreditTransaction);
    const completeTransactions = filteredTransactions.filter(t => t.status === 'completed');

    // ENHANCED Revenue calculations with upfront credit support
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.recognizedRevenue, 0);
    const creditSales = creditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const nonCreditSales = nonCreditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    
    // UPDATED COGS CALCULATION: Sum up all transaction costs (both complete + credit sales)
    const costOfGoodsSold = CalculationUtils.calculateCOGS(filteredTransactions);
    
    const grossProfit = totalRevenue - costOfGoodsSold;
    
    // Expense calculations
    const totalExpenses = expenses.reduce((sum, e) => sum + CalculationUtils.safeNumber(e.amount), 0);
    const netProfit = grossProfit - totalExpenses;
    
    // ENHANCED Payment method calculations with upfront credit support
    let totalCash = 0;
    let totalMpesaBank = 0;
    let totalCredit = 0;
    let totalUpfrontCash = 0;
    let totalUpfrontMpesaBank = 0;

    filteredTransactions.forEach(transaction => {
      // Use paymentSplit with upfront credit support
      if (transaction.paymentSplit) {
        totalCash += CalculationUtils.safeNumber(transaction.paymentSplit.cash);
        totalMpesaBank += CalculationUtils.safeNumber(transaction.paymentSplit.bank_mpesa);
        totalCredit += CalculationUtils.safeNumber(transaction.paymentSplit.credit);
        totalUpfrontCash += CalculationUtils.safeNumber(transaction.paymentSplit.upfront_cash);
        totalUpfrontMpesaBank += CalculationUtils.safeNumber(transaction.paymentSplit.upfront_bank_mpesa);
      } else {
        // Fallback calculation based on paymentMethod
        if (transaction.paymentMethod === 'cash') {
          totalCash += CalculationUtils.safeNumber(transaction.recognizedRevenue);
        } else if (['mpesa', 'bank', 'card', 'bank_mpesa'].includes(transaction.paymentMethod)) {
          totalMpesaBank += CalculationUtils.safeNumber(transaction.recognizedRevenue);
        } else if (transaction.paymentMethod === 'credit') {
          totalCredit += CalculationUtils.safeNumber(transaction.recognizedRevenue);
        } else if (transaction.paymentMethod === 'cash_bank_mpesa') {
          // Split evenly as fallback
          const half = CalculationUtils.safeNumber(transaction.recognizedRevenue) / 2;
          totalCash += half;
          totalMpesaBank += half;
        }
      }
    });

    // ENHANCED: Include upfront payments in cash and bank_mpesa totals
    totalCash += totalUpfrontCash;
    totalMpesaBank += totalUpfrontMpesaBank;
    
    // Credit calculations
    const outstandingCredit = credits
      .filter(credit => credit.status !== 'paid' && 
        (!selectedShop || selectedShop === 'all' || 
         credit.shop === selectedShop || credit.shopId === selectedShop))
      .reduce((sum, credit) => sum + CalculationUtils.safeNumber(credit.balanceDue), 0);
    
    const totalCreditGiven = creditTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const recognizedCreditRevenue = creditTransactions.reduce((sum, t) => sum + t.recognizedRevenue, 0);
    const totalUpfrontPayments = creditTransactions.reduce((sum, t) => sum + t.amountPaid, 0);

    // Enhanced financial stats matching the image requirements with upfront credit support
    const financialStats = {
      // Core metrics from image
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

      // NEW: Upfront payment metrics
      totalUpfrontPayments: totalUpfrontPayments,
      totalUpfrontCash: totalUpfrontCash,
      totalUpfrontMpesaBank: totalUpfrontMpesaBank,

      // Additional detailed metrics
      creditSalesCount: creditTransactions.length,
      nonCreditSalesCount: nonCreditTransactions.length,
      completeTransactionsCount: completeTransactions.length,
      recognizedCreditRevenue: recognizedCreditRevenue,
      profitMargin: CalculationUtils.calculateProfitMargin(totalRevenue, netProfit),
      creditCollectionRate: totalCreditGiven > 0 ? 
        (recognizedCreditRevenue / totalCreditGiven) * 100 : 0,
      totalItemsSold: filteredTransactions.reduce((sum, t) => sum + t.itemsCount, 0),
      averageTransactionValue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,

      // UPDATED: COGS breakdown for analysis
      cogsBreakdown: {
        total: costOfGoodsSold,
        fromCreditSales: CalculationUtils.calculateCOGS(creditTransactions),
        fromCompleteSales: CalculationUtils.calculateCOGS(nonCreditTransactions)
      },

      // Metadata
      _cogsCalculation: 'complete_sales_plus_credit_sales_made',
      _revenueCalculation: 'recognized_revenue_includes_upfront_payments',
      _paymentTracking: 'payment_split_with_upfront_support',
      _calculatedAt: new Date().toISOString()
    };

    console.log('💰 Final COGS Calculation with Upfront Credit Support:', {
      totalTransactions,
      totalRevenue,
      costOfGoodsSold,
      grossProfit,
      netProfit,
      totalCash,
      totalMpesaBank,
      totalCredit,
      totalUpfrontPayments,
      cogsBreakdown: financialStats.cogsBreakdown
    });

    // Sales performance summary
    const salesPerformanceSummary = {
      totalSales: financialStats.totalSales,
      creditSales: financialStats.creditSalesCount,
      nonCreditSales: financialStats.nonCreditSalesCount,
      totalRevenue: financialStats.totalRevenue,
      creditSalesRevenue: financialStats.creditSales,
      nonCreditSalesRevenue: financialStats.nonCreditSales,
      totalExpenses: financialStats.totalExpenses,
      grossProfit: financialStats.grossProfit,
      netProfit: financialStats.netProfit,
      costOfGoodsSold: financialStats.costOfGoodsSold,
      totalMpesaBank: financialStats.totalMpesaBank,
      totalCash: financialStats.totalCash,
      totalCredit: financialStats.totalCredit,
      outstandingCredit: financialStats.outstandingCredit,
      totalCreditGiven: financialStats.totalCreditGiven,
      totalUpfrontPayments: financialStats.totalUpfrontPayments,
      _cogsMethodology: 'complete_sales_plus_credit_sales_made',
      _revenueMethodology: 'recognized_revenue_includes_upfront_payments'
    };

    // Calculate top products
    const topProducts = CalculationUtils.calculateTopProducts(filteredTransactions, 10);
    
    // Calculate shop performance
    const shopPerformance = CalculationUtils.calculateShopPerformance(filteredTransactions, shops);

    return {
      salesWithProfit: filteredTransactions,
      financialStats,
      salesPerformanceSummary,
      expenses,
      credits,
      products,
      shops,
      cashiers,
      performance: {
        topProducts,
        shopPerformance,
        topCashiers: shopPerformance.slice(0, 10)
      },
      summary: financialStats,
      enhancedStats: {
        salesWithProfit: filteredTransactions,
        financialStats
      },
      comprehensiveReport: {
        summary: financialStats,
        transactions: filteredTransactions,
        expenses,
        products,
        credits,
        shops,
        cashiers,
        performance: {
          topProducts,
          shopPerformance
        }
      },
      timestamp: new Date().toISOString()
    };
  },

  calculateTopProducts: (transactions, limit = 10) => {
    if (!Array.isArray(transactions)) return [];
    
    const productMap = {};
    
    transactions.forEach(transaction => {
      transaction.items?.forEach(item => {
        const productId = item.productId?.toString() || item.productName;
        const productName = item.productName || 'Unknown Product';
        
        if (!productMap[productId]) {
          productMap[productId] = {
            id: productId,
            name: productName,
            totalSold: 0,
            totalRevenue: 0,
            totalProfit: 0,
            totalCost: 0,
            transactions: 0
          };
        }
        
        const quantity = CalculationUtils.safeNumber(item.quantity, 1);
        const revenue = CalculationUtils.safeNumber(item.totalPrice);
        const cost = CalculationUtils.safeNumber(item.buyingPrice) * quantity;
        const profit = revenue - cost;
        
        productMap[productId].totalSold += quantity;
        productMap[productId].totalRevenue += revenue;
        productMap[productId].totalProfit += profit;
        productMap[productId].totalCost += cost;
        productMap[productId].transactions += 1;
      });
    });
    
    return Object.values(productMap)
      .map(product => ({
        ...product,
        profitMargin: CalculationUtils.calculateProfitMargin(product.totalRevenue, product.totalProfit),
        averagePrice: product.totalSold > 0 ? product.totalRevenue / product.totalSold : 0
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  },

  calculateShopPerformance: (transactions, shops) => {
    if (!Array.isArray(transactions)) return [];
    
    const shopMap = {};
    
    transactions.forEach(transaction => {
      const shopId = transaction.shop || transaction.shopId;
      if (!shopId) return;
      
      if (!shopMap[shopId]) {
        const shop = shops.find(s => s._id.toString() === shopId.toString()) || 
                    { name: 'Unknown Shop', location: 'Unknown' };
        shopMap[shopId] = {
          id: shopId,
          name: shop.name,
          location: shop.location,
          revenue: 0,
          transactions: 0,
          profit: 0,
          cost: 0,
          itemsSold: 0
        };
      }
      
      shopMap[shopId].revenue += CalculationUtils.safeNumber(transaction.recognizedRevenue);
      shopMap[shopId].transactions += 1;
      shopMap[shopId].profit += CalculationUtils.safeNumber(transaction.profit);
      shopMap[shopId].cost += CalculationUtils.safeNumber(transaction.cost);
      shopMap[shopId].itemsSold += CalculationUtils.safeNumber(transaction.itemsCount);
    });
    
    return Object.values(shopMap)
      .map(shop => ({
        ...shop,
        profitMargin: CalculationUtils.calculateProfitMargin(shop.revenue, shop.profit),
        averageTransaction: shop.transactions > 0 ? shop.revenue / shop.transactions : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }
};

// ==================== EMAIL CONFIGURATION ====================

const createEmailTransporter = () => {
  try {
    const emailUser = process.env.EMAIL_USER || 'chemistseridah@gmail.com';
    const emailPass = process.env.EMAIL_PASSWORD || 'your-gmail-password';

    console.log('📧 Configuring email transporter...');
    
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

// ==================== SECURE CODE AUTHENTICATION ====================

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

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://seridah-chemist.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://back-pos-five.vercel.app'
    ];
    
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
    
    // Re-initialize models with connection
    models = createModels();
    await initializeEmail();
    await createDefaultAdmin();
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
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

// ==================== AUTHENTICATION MIDDLEWARE ====================

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

// ==================== ENHANCED TRANSACTION DATA FETCHING ====================

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

    console.log('📊 Fetching enhanced transaction data with filters:', filters);

    // FIX: Include both completed AND credit transactions
    let filter = { 
      status: { $in: ['completed', 'credit'] } // Include both statuses
    };
    // Date filter
    if (startDate && endDate) {
      filter.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Shop filter
    if (shopId && shopId !== 'all') {
      filter.$or = [
        { shop: shopId },
        { shopId: shopId }
      ];
    }

    // Cashier filter
    if (cashierId && cashierId !== 'all') {
      filter.$or = [
        { cashierId: cashierId },
        { cashierName: { $regex: cashierId, $options: 'i' } }
      ];
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== 'all') {
      if (paymentMethod === 'digital') {
        filter.paymentMethod = { $in: ['mpesa', 'bank', 'card'] };
      } else if (paymentMethod === 'credit') {
        filter.paymentMethod = 'credit';
      } else {
        filter.paymentMethod = paymentMethod;
      }
    }

    // Fetch all data in parallel
    const [transactions, shops, cashiers, products, expenses, credits] = await Promise.all([
      models.Transaction.find(filter)
        .populate('shop', 'name location type')
        .populate('cashierId', 'name email')
        .populate('items.productId', 'name buyingPrice currentStock')
        .sort({ saleDate: -1 })
        .lean(),
      models.Shop.find().lean(),
      models.Cashier.find().lean(),
      models.Product.find().lean(), // Ensure all products are fetched for cost calculation
      models.Expense.find(startDate && endDate ? {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      } : {}).populate('shop', 'name').lean(),
      models.Credit.find(startDate && endDate ? {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      } : {}).populate('transactionId').populate('shop').populate('cashierId').lean()
    ]);

    console.log(`✅ Enhanced transaction data fetched: ${transactions.length} transactions, ${products.length} products, ${credits.length} credits`);

    // Process data using enhanced utility
    const processedData = await CalculationUtils.processComprehensiveData({
      transactions,
      shops,
      cashiers,
      products, // Pass products for cost calculation
      expenses,
      credits
    }, shopId);

    return processedData;

  } catch (error) {
    console.error('❌ Error in getAllTransactionData:', error);
    throw error;
  }
};

// ==================== AUTHENTICATION ROUTES ====================

// Request secure login code
app.post('/api/auth/request-code',
  [
    body('email').isEmail().normalizeEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email address',
          details: errors.array()
        });
      }

      const { email } = req.body;
      console.log('📧 Secure code request for:', email);

      // Use the globally initialized models
      const user = await models.User.findOne({ email }) || 
                   await models.Cashier.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address'
        });
      }

      const secureCode = generateSecureCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      const hashedCode = await bcrypt.hash(secureCode, 10);
      
      await models.SecureCode.findOneAndUpdate(
        { email },
        {
          code: hashedCode,
          expiresAt,
          attempts: 0,
          used: false
        },
        { upsert: true, new: true }
      );

      if (!emailTransporter) {
        return res.json({
          success: true,
          message: 'Secure code generated (email service disabled)',
          developmentMode: true,
          secureCode: secureCode,
          expiresIn: 15
        });
      }

      try {
        await sendSecureCodeEmail(email, secureCode);
        res.json({
          success: true,
          message: 'Secure code sent to your email',
          expiresIn: 15
        });
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        await models.SecureCode.deleteOne({ email });
        res.status(500).json({
          success: false,
          message: 'Failed to send secure code. Please try again later.'
        });
      }

    } catch (error) {
      console.error('❌ Error requesting secure code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process request. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Verify secure login code
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
      console.log('🔐 Secure code verification for:', email);

      // Find the secure code
      const secureCode = await models.SecureCode.findOne({ email });
      if (!secureCode) {
        return res.status(404).json({
          success: false,
          message: 'No secure code found for this email. Please request a new code.'
        });
      }

      // Check if code is expired
      if (new Date() > secureCode.expiresAt) {
        await models.SecureCode.deleteOne({ email });
        return res.status(400).json({
          success: false,
          message: 'Secure code has expired. Please request a new code.'
        });
      }

      // Check if code is already used
      if (secureCode.used) {
        return res.status(400).json({
          success: false,
          message: 'Secure code has already been used. Please request a new code.'
        });
      }

      // Check attempts
      if (secureCode.attempts >= 5) {
        await models.SecureCode.deleteOne({ email });
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new code.'
        });
      }

      // Verify code
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

      // Code is valid - mark as used
      secureCode.used = true;
      await secureCode.save();

      // Find user
      const user = await models.User.findOne({ email }) || 
                   await models.Cashier.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateAuthToken(user._id, user.email, user.role);

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      };

      // Add shop info for cashiers
      if (user.role === 'cashier' && user.shopId) {
        userData.shopId = user.shopId;
        userData.shopName = user.shopName;
      }

      req.session.user = userData;
      req.session.token = token;

      console.log('✅ Secure code verification successful for:', email);

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

// Cashier login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const cashier = await models.Cashier.findOne({ email: email.toLowerCase().trim() })
      .populate('shopId', 'name location');
    
    if (!cashier || cashier.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Cashier account not found or inactive'
      });
    }

    let isPasswordValid = false;
    if (cashier.password) {
      if (cashier.password.startsWith('$2b$')) {
        isPasswordValid = await bcrypt.compare(password, cashier.password);
      } else {
        isPasswordValid = cashier.password === password;
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    cashier.lastLogin = new Date();
    await cashier.save();

    const token = generateAuthToken(cashier._id, cashier.email, cashier.role);

    const userData = {
      _id: cashier._id,
      name: cashier.name,
      email: cashier.email,
      phone: cashier.phone,
      role: cashier.role,
      status: cashier.status,
      lastLogin: cashier.lastLogin,
      shopId: cashier.shopId?._id || null,
      shopName: cashier.shopId?.name || cashier.shopName || null
    };

    req.session.user = userData;
    req.session.token = token;

    res.json({
      success: true,
      user: userData,
      token: token,
      message: 'Cashier login successful'
    });

  } catch (error) {
    console.error('❌ Cashier login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
});

// ==================== ENHANCED CREDIT SALE WITH COMPLETE UPFRONT PAYMENT SUPPORT ====================

// ENHANCED TRANSACTION CREATION WITH COMPLETE UPFRONT CREDIT SUPPORT
app.post('/api/transactions', async (req, res) => {
  try {
    const transactionData = req.body;
    
    console.log('💳 Creating transaction with complete upfront credit support:', {
      paymentMethod: transactionData.paymentMethod,
      totalAmount: transactionData.totalAmount,
      amountPaidNow: transactionData.amountPaidNow,
      isCreditPayment: transactionData.isCreditPayment,
      originalCreditId: transactionData.originalCreditId,
      upfrontPaymentMethod: transactionData.upfrontPaymentMethod
    });

    // Check for duplicate transaction
    if (transactionData.transactionNumber) {
      const existingTransaction = await models.Transaction.findOne({ 
        transactionNumber: transactionData.transactionNumber 
      });
      
      if (existingTransaction) {
        console.log('⚠️ Duplicate transaction detected:', transactionData.transactionNumber);
        return res.status(409).json({
          success: false,
          message: 'Transaction with this number already exists'
        });
      }
    }

    // Handle credit payment (part payment of existing credit)
    if (transactionData.isCreditPayment && transactionData.originalCreditId) {
      return await handleCreditPayment(transactionData, res);
    }

    // Auto-populate shop and cashier information
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

    // Calculate detailed metrics for each item and reduce stock
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

      // REDUCE STOCK FOR THE PRODUCT (only for new sales, not credit payments)
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
            
            console.log(`📦 Stock reduced for ${product.name}: ${currentStock} -> ${newStock} (sold: ${quantity})`);
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

    // ENHANCED: Handle partial payment for credit sales with upfront payment support
    const amountPaidNow = CalculationUtils.safeNumber(transactionData.amountPaidNow) || 0;
    const isCreditTransaction = transactionData.paymentMethod === 'credit';
    
    let recognizedRevenue = totalAmount;
    let outstandingRevenue = 0;
    let amountPaid = totalAmount;
    let creditStatus = 'completed';

    if (isCreditTransaction) {
      // For credit sales with partial payment
      amountPaid = amountPaidNow;
      recognizedRevenue = amountPaidNow;
      outstandingRevenue = Math.max(0, totalAmount - amountPaidNow);
      
      // Determine credit status based on payment
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

    // ENHANCED: Initialize payment split with upfront credit support
    transactionData.paymentSplit = {
      cash: 0,
      bank_mpesa: 0,
      credit: 0,
      upfront_cash: 0,
      upfront_bank_mpesa: 0
    };

    // Handle credit transactions with upfront payment support
    if (isCreditTransaction) {
      transactionData.isCreditTransaction = true;
      transactionData.creditStatus = creditStatus;
      transactionData.recognizedRevenue = recognizedRevenue;
      transactionData.outstandingRevenue = outstandingRevenue;
      transactionData.amountPaid = amountPaid;
      transactionData.status = 'credit';
      
      // Track immediate revenue for cashier dashboard
      transactionData.immediateRevenue = amountPaidNow;
      
      // Store credit shop classification
      transactionData.creditShopName = transactionData.creditShopName || transactionData.shopName;
      transactionData.creditShopId = transactionData.creditShopId || transactionData.shopId;
      transactionData.shopClassification = transactionData.shopClassification || transactionData.shopName;
      
      // ENHANCED: Track upfront payment details
      transactionData.upfrontPaymentDetails = {
        amount: amountPaidNow,
        method: transactionData.upfrontPaymentMethod || 'cash',
        split: {
          cash: 0,
          bank_mpesa: 0
        }
      };

      // ENHANCED: Update payment split for credit transactions with upfront payment support
      if (amountPaidNow > 0) {
        // For credit sales with upfront payment, track the payment method
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
      
      // CREDIT UPDATE: Only show the remaining balance (outstandingRevenue) on credit side
      transactionData.paymentSplit.credit = outstandingRevenue;
      
      // Set due date if not provided (default 30 days)
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
      
      // ENHANCED: Update payment split for non-credit transactions
      if (transactionData.paymentMethod === 'cash') {
        transactionData.paymentSplit.cash = totalAmount;
      } else if (['mpesa', 'bank', 'card', 'bank_mpesa'].includes(transactionData.paymentMethod)) {
        transactionData.paymentSplit.bank_mpesa = totalAmount;
      } else if (transactionData.paymentMethod === 'cash_bank_mpesa' && transactionData.paymentSplit) {
        // Use provided split
        transactionData.paymentSplit.cash = CalculationUtils.safeNumber(transactionData.paymentSplit.cash);
        transactionData.paymentSplit.bank_mpesa = CalculationUtils.safeNumber(transactionData.paymentSplit.bank_mpesa);
      }
    }

    // Generate transaction number if not provided
    if (!transactionData.transactionNumber) {
      transactionData.transactionNumber = `TXN-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 5)}`;
    }

    const transaction = new models.Transaction(transactionData);
    await transaction.save();
    
    await transaction.populate('shop', 'name location type');
    await transaction.populate('cashierId', 'name email');
    await transaction.populate('items.productId', 'name buyingPrice');

    // Create credit record ONLY if this is a credit transaction AND doesn't already exist
    if (isCreditTransaction && !transactionData.isCreditPayment) {
      // Check if credit record already exists to prevent duplication
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
          balanceDue: outstandingRevenue, // This now shows only the remaining balance
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
          // NEW: Store upfront payment details in credit record
          upfrontPayment: {
            amount: amountPaidNow,
            method: transactionData.upfrontPaymentMethod || 'cash',
            split: {
              cash: transactionData.paymentSplit.upfront_cash || 0,
              bank_mpesa: transactionData.paymentSplit.upfront_bank_mpesa || 0
            }
          }
        };

        // Add initial payment to history if partial payment was made
        if (amountPaidNow > 0) {
          creditData.paymentHistory = [{
            amount: amountPaidNow,
            paymentDate: new Date(),
            paymentMethod: transactionData.upfrontPaymentMethod || 'cash',
            recordedBy: transactionData.recordedBy || 'System',
            cashierName: transactionData.cashierName,
            notes: `Initial upfront payment for credit sale`,
            isUpfrontPayment: true // NEW: Mark as upfront payment
          }];
        }

        const credit = await models.Credit.create(creditData);
        console.log('✅ Credit record created with upfront payment support:', {
          creditId: credit._id,
          totalAmount: credit.totalAmount,
          amountPaid: credit.amountPaid,
          balanceDue: credit.balanceDue, // This now shows only the remaining balance
          status: credit.status,
          upfrontPayment: credit.upfrontPayment
        });
      } else {
        console.log('⚠️ Credit record already exists for transaction:', transaction._id);
      }
    }

    console.log('✅ Transaction created successfully with upfront credit support:', {
      transactionId: transaction._id,
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      recognizedRevenue: recognizedRevenue,
      outstandingRevenue: outstandingRevenue, // This is what will be displayed on credit side
      immediateRevenue: transactionData.immediateRevenue,
      cost: totalCost,
      profit: profit,
      paymentMethod: transactionData.paymentMethod,
      isCredit: isCreditTransaction,
      paymentSplit: transactionData.paymentSplit, // ENHANCED: Includes upfront payment tracking
      upfrontPaymentDetails: transactionData.upfrontPaymentDetails,
      itemsSold: transactionData.itemsCount
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: `Transaction created successfully${isCreditTransaction ? ' with credit record' : ''}`,
      creditDetails: isCreditTransaction ? {
        totalAmount,
        amountPaid: amountPaidNow,
        balanceDue: outstandingRevenue, // Show only balance due
        status: creditStatus,
        upfrontPayment: transactionData.upfrontPaymentDetails
      } : null
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

// Handle credit payment (part payment of existing credit)
async function handleCreditPayment(transactionData, res) {
  try {
    console.log('💰 Processing credit payment:', {
      originalCreditId: transactionData.originalCreditId,
      paymentAmount: transactionData.totalAmount,
      paymentMethod: transactionData.paymentMethod
    });

    // Find the original credit record
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

    // Update the credit record
    originalCredit.amountPaid = newAmountPaid;
    originalCredit.balanceDue = newBalanceDue; // This now shows only the remaining balance
    
    // Update status
    let newStatus = originalCredit.status;
    if (newBalanceDue <= 0) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partially_paid';
    }
    originalCredit.status = newStatus;

    // Add payment to history
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

    // Update the original transaction
    if (originalCredit.transactionId) {
      await models.Transaction.findByIdAndUpdate(originalCredit.transactionId, {
        amountPaid: newAmountPaid,
        recognizedRevenue: newAmountPaid,
        outstandingRevenue: newBalanceDue, // This now shows only the remaining balance
        creditStatus: newStatus,
        updatedAt: new Date()
      });
    }

    // ENHANCED: Payment split for credit payments
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

    // Create a new transaction record for the payment
    const paymentTransactionData = {
      ...transactionData,
      isCreditPayment: true,
      originalCreditId: originalCredit._id,
      transactionNumber: `PAY-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 5)}`,
      // For credit payments, the revenue should be recognized immediately
      recognizedRevenue: paymentAmount,
      outstandingRevenue: 0,
      amountPaid: paymentAmount,
      immediateRevenue: paymentAmount, // Track immediate revenue
      isCreditTransaction: false, // This is a payment, not a new credit
      creditStatus: null,
      status: 'completed',
      paymentSplit: paymentSplit // Include payment split
    };

    const paymentTransaction = new models.Transaction(paymentTransactionData);
    await paymentTransaction.save();

    console.log('✅ Credit payment processed successfully:', {
      creditId: originalCredit._id,
      paymentAmount,
      newAmountPaid,
      newBalanceDue, // This now shows only the remaining balance
      status: newStatus,
      paymentTransactionId: paymentTransaction._id,
      paymentSplit: paymentSplit
    });

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

// ==================== COMPLETE API ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: process.env.APP_NAME || 'Seridah Chemist Management',
    version: process.env.APP_VERSION || '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    email: emailTransporter ? 'configured' : 'disabled',
    authentication: 'email-based-secure-code',
    cogsCalculation: 'complete_sales_plus_credit_sales_made',
    creditPartialPayment: 'supported',
    immediateRevenueTracking: 'enabled',
    upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
    creditDisplayLogic: 'balance_due_only'
  });
});

// ==================== COMBINED TRANSACTION ENDPOINTS ====================

app.get('/api/transactions/combined', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      shopId,
      cashierId,
      paymentMethod,
      dataType = 'all'
    } = req.query;

    console.log('🚀 Processing enhanced combined transaction endpoint...', req.query);

    const startTime = Date.now();
    
    const filters = {
      startDate,
      endDate,
      shopId,
      cashierId,
      paymentMethod
    };

    const transactionData = await getAllTransactionData(filters);
    const processingTime = Date.now() - startTime;

    console.log(`✅ Enhanced combined transaction data generated in ${processingTime}ms`);

    let responseData = {
      success: true,
      data: transactionData,
      processingTime,
      message: 'Combined transaction data fetched successfully',
      cogsMethodology: 'complete_sales_plus_credit_sales_made',
      creditPartialPayment: 'supported',
      immediateRevenueTracking: 'enabled',
      upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
      creditDisplayLogic: 'balance_due_only'
    };

    if (dataType !== 'all') {
      switch (dataType) {
        case 'basic':
          responseData.data = {
            transactions: transactionData.salesWithProfit,
            summary: transactionData.summary
          };
          break;
        case 'enhanced':
          responseData.data = {
            transactions: transactionData.salesWithProfit,
            summary: transactionData.financialStats,
            credits: transactionData.credits
          };
          break;
        case 'sales':
          responseData.data = {
            transactions: transactionData.salesWithProfit,
            summary: transactionData.summary,
            performance: transactionData.performance
          };
          break;
        case 'withCredits':
          responseData.data = {
            transactions: transactionData.salesWithProfit,
            credits: transactionData.credits,
            summary: {
              ...transactionData.summary,
              creditSummary: {
                totalCredits: transactionData.credits.length,
                totalCreditAmount: transactionData.summary.totalCreditGiven,
                outstandingCredit: transactionData.summary.outstandingCredit,
                recognizedCreditRevenue: transactionData.summary.recognizedCreditRevenue,
                totalUpfrontPayments: transactionData.summary.totalUpfrontPayments // NEW: Include upfront payments
              }
            }
          };
          break;
        case 'optimized':
          responseData.data = {
            comprehensiveReport: transactionData.comprehensiveReport,
            salesSummary: {
              financialStats: transactionData.financialStats,
              topProducts: transactionData.performance.topProducts,
              topCashiers: transactionData.performance.topCashiers
            },
            enhancedStats: transactionData.enhancedStats,
            filteredTransactions: transactionData.salesWithProfit
          };
          break;
        case 'metrics-only':
          responseData.data = {
            metrics: transactionData.financialStats,
            period: {
              startDate: startDate || 'All time',
              endDate: endDate || 'All time'
            }
          };
          break;
      }
    }

    res.json(responseData);

  } catch (error) {
    console.error('❌ Error in enhanced combined transaction endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch combined transaction data',
      error: error.message,
      processingTime: 0
    });
  }
});

// SPECIFIC METRICS ENDPOINT - Returns exactly the 12 metrics shown in the image with upfront credit support
app.get('/api/transactions/metrics', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      shopId,
      cashierId
    } = req.query;

    console.log('📈 Fetching specific transaction metrics with upfront credit support...', req.query);

    const filters = {
      startDate,
      endDate,
      shopId,
      cashierId
    };

    const transactionData = await getAllTransactionData(filters);

    // Extract exactly the 12 metrics shown in the image with upfront credit support
    const metrics = {
      // 1. Total Sales
      totalSales: {
        amount: transactionData.financialStats.totalRevenue,
        count: transactionData.financialStats.totalSales,
        description: `${transactionData.financialStats.totalSales} transactions`
      },
      
      // 2. Credit Sales
      creditSales: {
        amount: transactionData.financialStats.creditSales,
        count: transactionData.financialStats.creditSalesCount,
        description: `${transactionData.financialStats.creditSalesCount} credit transactions`
      },
      
      // 3. Non-Credit Sales
      nonCreditSales: {
        amount: transactionData.financialStats.nonCreditSales,
        count: transactionData.financialStats.nonCreditSalesCount,
        description: `${transactionData.financialStats.nonCreditSalesCount} complete transaction/skell immediately`
      },
      
      // 4. Total Revenue
      totalRevenue: {
        amount: transactionData.financialStats.totalRevenue,
        description: 'From credit & non-credit sales (includes upfront payments)'
      },
      
      // 5. Expenses
      expenses: {
        amount: transactionData.financialStats.totalExpenses,
        description: 'Total operational costs'
      },
      
      // 6. Gross Profit
      grossProfit: {
        amount: transactionData.financialStats.grossProfit,
        description: 'Revenue - Cost of Goods'
      },
      
      // 7. Net Profit
      netProfit: {
        amount: transactionData.financialStats.netProfit,
        description: 'After all expenses'
      },
      
      // 8. Cost of Goods Sold
      costOfGoodsSold: {
        amount: transactionData.financialStats.costOfGoodsSold,
        description: 'For credit & non-credit sales'
      },
      
      // 9. Total Mpesa/Bank
      totalMpesaBank: {
        amount: transactionData.financialStats.totalMpesaBank,
        description: 'Digital payments (includes upfront credit payments)'
      },
      
      // 10. Total Cash
      totalCash: {
        amount: transactionData.financialStats.totalCash,
        description: 'Cash payments (includes upfront credit payments)'
      },
      
      // 11. Outstanding Credit
      outstandingCredit: {
        amount: transactionData.financialStats.outstandingCredit,
        description: 'Unpaid credit balance only'
      },
      
      // 12. Total Credit Given
      totalCreditGiven: {
        amount: transactionData.financialStats.totalCreditGiven,
        description: 'Total credit extended'
      },

      // NEW: Upfront Payment Metrics
      upfrontPayments: {
        amount: transactionData.financialStats.totalUpfrontPayments,
        description: 'Upfront payments on credit sales'
      }
    };

    res.json({
      success: true,
      data: metrics,
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'All time'
      },
      message: 'Transaction metrics fetched successfully',
      cogsCalculation: 'complete_sales_plus_credit_sales_made',
      creditPartialPayment: 'supported',
      immediateRevenueTracking: 'enabled',
      upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
      creditDisplayLogic: 'balance_due_only'
    });

  } catch (error) {
    console.error('❌ Error fetching transaction metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction metrics',
      error: error.message
    });
  }
});

// ENHANCED TRANSACTIONS WITH CREDIT DETAILS
app.get('/api/transactions/with-credits', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      shopId,
      cashierId,
      includeCreditDetails = 'true'
    } = req.query;

    const filters = {
      startDate,
      endDate,
      shopId,
      cashierId
    };

    const transactionData = await getAllTransactionData(filters);

    // Enhance transactions with credit information
    const transactionsWithCredits = transactionData.salesWithProfit.map(transaction => {
      const creditInfo = transactionData.credits.find(credit => 
        credit.transactionId && credit.transactionId._id && 
        credit.transactionId._id.toString() === transaction._id.toString()
      );

      return {
        ...transaction,
        creditDetails: creditInfo ? {
          creditId: creditInfo._id,
          customerName: creditInfo.customerName,
          customerPhone: creditInfo.customerPhone,
          totalAmount: creditInfo.totalAmount,
          amountPaid: creditInfo.amountPaid,
          balanceDue: creditInfo.balanceDue, // This now shows only the remaining balance
          dueDate: creditInfo.dueDate,
          status: creditInfo.status,
          paymentHistory: creditInfo.paymentHistory,
          shopClassification: creditInfo.shopClassification,
          upfrontPayment: creditInfo.upfrontPayment // NEW: Include upfront payment details
        } : null
      };
    });

    res.json({
      success: true,
      data: {
        transactions: transactionsWithCredits,
        summary: transactionData.financialStats,
        credits: includeCreditDetails === 'true' ? transactionData.credits : [],
        metrics: transactionData.financialStats
      },
      message: 'Transactions with credit details fetched successfully',
      cogsMethodology: 'complete_sales_plus_credit_sales_made',
      creditPartialPayment: 'supported',
      immediateRevenueTracking: 'enabled',
      upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
      creditDisplayLogic: 'balance_due_only'
    });

  } catch (error) {
    console.error('❌ Error fetching transactions with credits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions with credit details',
      error: error.message
    });
  }
});

// ==================== CASHIER-SPECIFIC ENDPOINTS ====================

// Enhanced cashier dashboard metrics endpoint with upfront credit support
app.get('/api/cashier/dashboard-metrics', async (req, res) => {
  try {
    const { cashierId, shopId, startDate, endDate } = req.query;

    if (!cashierId || !shopId) {
      return res.status(400).json({
        success: false,
        message: 'Cashier ID and Shop ID are required'
      });
    }

    console.log('📊 Fetching cashier-specific dashboard metrics with upfront credit support...', {
      cashierId,
      shopId,
      startDate,
      endDate
    });

    const filters = {
      cashierId,
      shopId,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString()
    };

    const transactionData = await getAllTransactionData(filters);
    const financialStats = transactionData.financialStats;

    // Enhanced cashier-specific metrics with upfront credit support
    const cashierMetrics = {
      // Core metrics for cashier dashboard
      totalSales: financialStats.totalRevenue,
      totalTransactions: financialStats.totalSales,
      creditSales: financialStats.creditSales,
      nonCreditSales: financialStats.nonCreditSales,
      totalCash: financialStats.totalCash,
      totalMpesaBank: financialStats.totalMpesaBank,
      totalCredit: financialStats.totalCredit,
      outstandingCredit: financialStats.outstandingCredit,
      
      // NEW: Upfront payment metrics
      totalUpfrontPayments: financialStats.totalUpfrontPayments,
      totalUpfrontCash: financialStats.totalUpfrontCash,
      totalUpfrontMpesaBank: financialStats.totalUpfrontMpesaBank,
      
      // Performance metrics
      itemsSold: financialStats.totalItemsSold,
      averageTransaction: financialStats.averageTransactionValue,
      profitMargin: financialStats.profitMargin,
      
      // Credit performance
      creditTransactions: financialStats.creditSalesCount,
      creditCollectionRate: financialStats.creditCollectionRate,
      recognizedCreditRevenue: financialStats.recognizedCreditRevenue,
      
      // Immediate revenue tracking
      immediateRevenue: financialStats.totalRevenue, // This includes all recognized revenue
      creditImmediateRevenue: financialStats.recognizedCreditRevenue, // Credit portion of immediate revenue
      
      // Metadata
      period: {
        startDate: filters.startDate,
        endDate: filters.endDate
      },
      cashierId,
      shopId,
      upfrontCreditSupport: true // NEW: Indicate support
    };

    res.json({
      success: true,
      data: cashierMetrics,
      message: 'Cashier dashboard metrics fetched successfully',
      upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
      creditDisplayLogic: 'balance_due_only'
    });

  } catch (error) {
    console.error('❌ Error fetching cashier dashboard metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cashier dashboard metrics',
      error: error.message
    });
  }
});

// ==================== BASIC CRUD ENDPOINTS ====================

// Products API
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
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    
    // Auto-populate shop information if shop ID is provided
    if (productData.shop) {
      const shop = await models.Shop.findById(productData.shop);
      if (shop) {
        productData.shopName = shop.name;
        productData.shopId = shop._id;
      }
    }

    const product = new models.Product(productData);
    await product.save();
    
    await product.populate('shop', 'name location type');
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await models.Product.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('shop', 'name location type');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await models.Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// Shops API
app.get('/api/shops', async (req, res) => {
  try {
    const shops = await models.Shop.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: shops,
      count: shops.length
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shops',
      error: error.message
    });
  }
});

app.post('/api/shops', async (req, res) => {
  try {
    const shopData = req.body;

    const shop = new models.Shop(shopData);
    await shop.save();
    
    res.status(201).json({
      success: true,
      data: shop,
      message: 'Shop created successfully'
    });
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create shop',
      error: error.message
    });
  }
});

app.put('/api/shops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const shop = await models.Shop.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.json({
      success: true,
      data: shop,
      message: 'Shop updated successfully'
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shop',
      error: error.message
    });
  }
});

app.delete('/api/shops/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await models.Shop.findByIdAndDelete(id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shop',
      error: error.message
    });
  }
});

// Cashiers API
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
    console.error('Error fetching cashiers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cashiers',
      error: error.message
    });
  }
});

app.post('/api/cashiers', async (req, res) => {
  try {
    const cashierData = req.body;

    // Hash password if provided
    if (cashierData.password) {
      cashierData.password = await bcrypt.hash(cashierData.password, 10);
    }

    const cashier = new models.Cashier(cashierData);
    await cashier.save();
    
    await cashier.populate('shopId', 'name location');
    
    res.status(201).json({
      success: true,
      data: cashier,
      message: 'Cashier created successfully'
    });
  } catch (error) {
    console.error('Error creating cashier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create cashier',
      error: error.message
    });
  }
});

app.put('/api/cashiers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const cashier = await models.Cashier.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('shopId', 'name location');

    if (!cashier) {
      return res.status(404).json({
        success: false,
        message: 'Cashier not found'
      });
    }

    res.json({
      success: true,
      data: cashier,
      message: 'Cashier updated successfully'
    });
  } catch (error) {
    console.error('Error updating cashier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cashier',
      error: error.message
    });
  }
});

app.delete('/api/cashiers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cashier = await models.Cashier.findByIdAndDelete(id);

    if (!cashier) {
      return res.status(404).json({
        success: false,
        message: 'Cashier not found'
      });
    }

    res.json({
      success: true,
      message: 'Cashier deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cashier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete cashier',
      error: error.message
    });
  }
});

// Expenses API
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
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message
    });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const expenseData = req.body;
    
    console.log('💰 Creating expense:', {
      category: expenseData.category,
      amount: expenseData.amount,
      description: expenseData.description,
      paymentMethod: expenseData.paymentMethod
    });

    // Auto-populate shop information if shop ID is provided
    if (expenseData.shop) {
      const shop = await models.Shop.findById(expenseData.shop);
      if (shop) {
        expenseData.shopName = shop.name;
        expenseData.shopId = shop._id;
      }
    }

    // Set default values if not provided
    if (!expenseData.date) {
      expenseData.date = new Date();
    }
    if (!expenseData.category) {
      expenseData.category = 'General';
    }
    if (!expenseData.paymentMethod) {
      expenseData.paymentMethod = 'cash';
    }
    if (!expenseData.status) {
      expenseData.status = 'completed';
    }

    // Validate required fields
    if (!expenseData.description || !expenseData.amount) {
      return res.status(400).json({
        success: false,
        message: 'Description and amount are required fields'
      });
    }

    const expense = new models.Expense(expenseData);
    await expense.save();
    
    await expense.populate('shop', 'name location');

    console.log('✅ Expense created successfully:', {
      expenseId: expense._id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description
    });

    res.status(201).json({
      success: true,
      data: expense,
      message: 'Expense created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message
    });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const expense = await models.Expense.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('shop', 'name location');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: expense,
      message: 'Expense updated successfully'
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message
    });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await models.Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message
    });
  }
});

// ==================== ENHANCED CREDIT API ENDPOINTS ====================

// Create credit record - WITH DEDUPLICATION CHECK
app.post('/api/credits', async (req, res) => {
  try {
    const creditData = req.body;
    
    console.log('💳 Creating credit record with deduplication check:', {
      transactionId: creditData.transactionId,
      customerName: creditData.customerName
    });

    // Check for duplicate credit record
    if (creditData.transactionId) {
      const existingCredit = await models.Credit.findOne({ 
        transactionId: creditData.transactionId 
      });
      
      if (existingCredit) {
        console.log('⚠️ Credit record already exists for transaction:', creditData.transactionId);
        return res.status(409).json({
          success: false,
          message: 'Credit record already exists for this transaction',
          data: existingCredit
        });
      }
    }

    // Auto-populate shop and cashier information if not provided
    if (creditData.transactionId) {
      const transaction = await models.Transaction.findById(creditData.transactionId);
      if (transaction) {
        if (!creditData.shop) creditData.shop = transaction.shop;
        if (!creditData.shopId) creditData.shopId = transaction.shopId;
        if (!creditData.shopName) creditData.shopName = transaction.shopName;
        if (!creditData.cashierId) creditData.cashierId = transaction.cashierId;
        if (!creditData.cashierName) creditData.cashierName = transaction.cashierName;
      }
    }

    // Set default values
    if (!creditData.status) {
      creditData.status = creditData.balanceDue > 0 ? 'pending' : 'paid';
    }

    if (!creditData.dueDate) {
      creditData.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default
    }

    // Initialize payment history if partial payment
    if (!creditData.paymentHistory && creditData.amountPaid > 0) {
      creditData.paymentHistory = [{
        amount: creditData.amountPaid,
        paymentDate: new Date(),
        paymentMethod: 'initial',
        recordedBy: creditData.recordedBy || 'System',
        cashierName: creditData.cashierName,
        notes: 'Initial payment',
        isUpfrontPayment: true // NEW: Mark as upfront payment
      }];
    }

    const credit = new models.Credit(creditData);
    await credit.save();
    
    await credit.populate('transactionId');
    await credit.populate('shop', 'name location type');
    await credit.populate('cashierId', 'name email');

    console.log('✅ Credit record created successfully with no duplication:', {
      creditId: credit._id,
      customerName: credit.customerName,
      totalAmount: credit.totalAmount,
      balanceDue: credit.balanceDue, // This now shows only the remaining balance
      status: credit.status,
      upfrontPayment: credit.upfrontPayment // NEW: Log upfront payment details
    });

    res.status(201).json({
      success: true,
      data: credit,
      message: 'Credit record created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating credit record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create credit record',
      error: error.message
    });
  }
});

// Enhanced Credits API
app.get('/api/credits', async (req, res) => {
  try {
    const { shopId, status, cashierId, startDate, endDate, includeTransactions = 'false' } = req.query;
    
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

    // Include transaction details if requested
    let enhancedCredits = credits;
    if (includeTransactions === 'true') {
      enhancedCredits = await Promise.all(credits.map(async (credit) => {
        if (credit.transactionId) {
          const transaction = await models.Transaction.findById(credit.transactionId)
            .populate('shop', 'name location type')
            .populate('cashierId', 'name email')
            .populate('items.productId', 'name buyingPrice');
          return {
            ...credit.toObject(),
            transactionDetails: transaction
          };
        }
        return credit;
      }));
    }

    res.json({
      success: true,
      data: enhancedCredits,
      count: credits.length,
      summary: {
        totalCredits: credits.length,
        totalCreditAmount: credits.reduce((sum, c) => sum + CalculationUtils.safeNumber(c.totalAmount), 0),
        totalPaid: credits.reduce((sum, c) => sum + CalculationUtils.safeNumber(c.amountPaid), 0),
        totalOutstanding: credits.reduce((sum, c) => sum + CalculationUtils.safeNumber(c.balanceDue), 0), // This now shows only the remaining balance
        totalUpfrontPayments: credits.reduce((sum, c) => sum + CalculationUtils.safeNumber(c.upfrontPayment?.amount || 0), 0), // NEW: Upfront payments
        overdueCount: credits.filter(c => 
          c.dueDate && new Date(c.dueDate) < new Date() && c.balanceDue > 0
        ).length
      },
      upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
      creditDisplayLogic: 'balance_due_only'
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credits',
      error: error.message
    });
  }
});

// Update credit record
app.put('/api/credits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const credit = await models.Credit.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('transactionId')
      .populate('shop', 'name location type')
      .populate('cashierId', 'name email');

    if (!credit) {
      return res.status(404).json({
        success: false,
        message: 'Credit record not found'
      });
    }

    res.json({
      success: true,
      data: credit,
      message: 'Credit record updated successfully'
    });
  } catch (error) {
    console.error('Error updating credit record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update credit record',
      error: error.message
    });
  }
});

// Delete credit record
app.delete('/api/credits/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const credit = await models.Credit.findByIdAndDelete(id);

    if (!credit) {
      return res.status(404).json({
        success: false,
        message: 'Credit record not found'
      });
    }

    res.json({
      success: true,
      message: 'Credit record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting credit record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete credit record',
      error: error.message
    });
  }
});

// Get credit by ID
app.get('/api/credits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { includeTransaction = 'false' } = req.query;

    let credit = await models.Credit.findById(id)
      .populate('shop', 'name location type')
      .populate('cashierId', 'name email');

    if (!credit) {
      return res.status(404).json({
        success: false,
        message: 'Credit record not found'
      });
    }

    // Include transaction details if requested
    if (includeTransaction === 'true' && credit.transactionId) {
      const transaction = await models.Transaction.findById(credit.transactionId)
        .populate('shop', 'name location type')
        .populate('cashierId', 'name email')
        .populate('items.productId', 'name buyingPrice');
      
      credit = credit.toObject();
      credit.transactionDetails = transaction;
    }

    res.json({
      success: true,
      data: credit,
      upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
      creditDisplayLogic: 'balance_due_only'
    });
  } catch (error) {
    console.error('Error fetching credit record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit record',
      error: error.message
    });
  }
});

// ENHANCED: Handle credit payment with proper state management
app.patch('/api/credits/:id/payment', async (req, res) => {
  try {
    const { amount, paymentMethod, recordedBy, cashierName, notes } = req.body;
    
    if (!amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, paymentMethod'
      });
    }

    const credit = await models.Credit.findById(req.params.id);
    if (!credit) {
      return res.status(404).json({
        success: false,
        message: 'Credit record not found'
      });
    }

    const paymentAmount = CalculationUtils.safeNumber(amount);
    const currentAmountPaid = CalculationUtils.safeNumber(credit.amountPaid);
    const newAmountPaid = currentAmountPaid + paymentAmount;
    const totalAmount = CalculationUtils.safeNumber(credit.totalAmount);
    const newBalanceDue = Math.max(0, totalAmount - newAmountPaid);

    // Add payment to history
    credit.paymentHistory.push({
      amount: paymentAmount,
      paymentMethod,
      recordedBy: recordedBy || 'System',
      cashierName: cashierName || credit.cashierName,
      paymentDate: new Date(),
      notes: notes || `Payment of ${CalculationUtils.formatCurrency(paymentAmount)}`
    });

    // Update amounts
    credit.amountPaid = newAmountPaid;
    credit.balanceDue = newBalanceDue; // This now shows only the remaining balance

    // Update status
    let newStatus = credit.status;
    if (newBalanceDue <= 0) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partially_paid';
    } else {
      newStatus = 'pending';
    }
    credit.status = newStatus;

    credit.updatedAt = new Date();
    await credit.save();

    // Update corresponding transaction to reflect payment
    if (credit.transactionId) {
      await models.Transaction.findByIdAndUpdate(credit.transactionId, {
        amountPaid: newAmountPaid,
        recognizedRevenue: newAmountPaid,
        outstandingRevenue: newBalanceDue, // This now shows only the remaining balance
        creditStatus: newStatus,
        updatedAt: new Date()
      });
    }

    await credit.populate('transactionId');
    await credit.populate('shop', 'name location type');
    await credit.populate('cashierId', 'name email');

    console.log('✅ Payment recorded successfully for credit:', {
      creditId: req.params.id,
      paymentAmount,
      newAmountPaid,
      newBalanceDue, // This now shows only the remaining balance
      status: newStatus
    });

    res.json({
      success: true,
      data: credit,
      message: `Payment of ${CalculationUtils.formatCurrency(paymentAmount)} recorded successfully`
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message
    });
  }
});

// ==================== ADDITIONAL UTILITY ENDPOINTS ====================

// Shop performance endpoint
app.get('/api/transactions/shop-performance/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { startDate, endDate } = req.query;
    
    const shop = await models.Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const filters = { shopId, startDate, endDate };
    const transactionData = await getAllTransactionData(filters);

    res.json({
      success: true,
      data: {
        performance: transactionData.financialStats,
        transactions: transactionData.salesWithProfit,
        credits: transactionData.credits,
        expenses: transactionData.expenses,
        shopDetails: shop
      },
      message: 'Shop performance data fetched successfully',
      cogsMethodology: 'complete_sales_plus_credit_sales_made',
      creditPartialPayment: 'supported',
      immediateRevenueTracking: 'enabled',
      upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
      creditDisplayLogic: 'balance_due_only'
    });

  } catch (error) {
    console.error('❌ Error fetching shop performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop performance data',
      error: error.message
    });
  }
});

// Debug endpoint
app.get('/api/debug/database', async (req, res) => {
  try {
    const counts = {
      products: await models.Product.countDocuments(),
      shops: await models.Shop.countDocuments(),
      cashiers: await models.Cashier.countDocuments(),
      expenses: await models.Expense.countDocuments(),
      transactions: await models.Transaction.countDocuments(),
      users: await models.User.countDocuments(),
      secureCodes: await models.SecureCode.countDocuments(),
      credits: await models.Credit.countDocuments()
    };
    
    res.json({
      success: true,
      counts,
      database: mongoose.connection.name,
      status: 'connected',
      cogsCalculation: 'complete_sales_plus_credit_sales_made',
      creditPartialPayment: 'supported',
      immediateRevenueTracking: 'enabled',
      upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
      creditDisplayLogic: 'balance_due_only'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database check failed',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: process.env.APP_NAME || 'Stanzo Shop Management API',
    version: process.env.APP_VERSION || '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      metrics: '/api/transactions/metrics',
      combined: '/api/transactions/combined',
      withCredits: '/api/transactions/with-credits',
      cashierMetrics: '/api/cashier/dashboard-metrics'
    },
    cogsCalculation: 'complete_sales_plus_credit_sales_made',
    creditPartialPayment: 'supported',
    immediateRevenueTracking: 'enabled',
    upfrontCreditSupport: 'fully_enabled', // NEW: Indicate upfront credit support
    creditDisplayLogic: 'balance_due_only'
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
    console.log('🚀 Starting Complete Stanzo Shop Management Server...');
    console.log(`📋 App: ${process.env.APP_NAME || 'Stanzo Shop Management'}`);
    
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`\n🎉 Complete Server Started Successfully!`);
      console.log('='.repeat(60));
      console.log(`📍 Port: ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🧮 COGS Calculation: Complete Sales + Credit Sales Made`);
      console.log(`💳 Credit Partial Payment: SUPPORTED ✅`);
      console.log(`💰 Immediate Revenue Tracking: ENABLED ✅`);
      console.log(`🎯 Upfront Credit Support: FULLY ENABLED ✅`); // NEW: Indicate the update
      console.log(`📈 Credit Display: BALANCE DUE ONLY ✅`);
      console.log(`🔧 ALL ENDPOINTS AVAILABLE:`);
      console.log(`   - GET  /api/shops ✅`);
      console.log(`   - GET  /api/products ✅`);
      console.log(`   - GET  /api/cashiers ✅`);
      console.log(`   - GET  /api/expenses ✅`);
      console.log(`   - GET  /api/credits ✅`);
      console.log(`   - GET  /api/transactions/combined ✅`);
      console.log(`   - GET  /api/cashier/dashboard-metrics ✅`);
      console.log(`   - POST /api/transactions ✅ (Upfront Credit Supported)`);
      console.log(`   - POST /api/credits ✅ (No Duplication)`);
      console.log('='.repeat(60));
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