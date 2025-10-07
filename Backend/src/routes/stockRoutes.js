const express = require('express');
const router = express.Router();
const {
  getLimitUpStocks,
  getStockDetail,
  getStockHistory,
  getSectorInfo,
  searchStocks
} = require('../controllers/stockController');
const {
  validateLimitUpStocksQuery,
  validateStockDetail,
  validateDate,
  handleValidationErrors
} = require('../middleware/validation');

// 获取涨停股票列表
// GET /api/v1/stocks/limit-up?date=2024-01-01&groupBySector=true&page=1&limit=50
router.get('/limit-up', validateLimitUpStocksQuery, getLimitUpStocks);

// 获取股票详情
// GET /api/v1/stocks/detail/:stockCode?date=2024-01-01
router.get('/detail/:stockCode', validateStockDetail, getStockDetail);

// 获取股票历史涨停记录
// GET /api/v1/stocks/history/:stockCode?startDate=2024-01-01&endDate=2024-01-31
router.get('/history/:stockCode', [
  validateDate('startDate'),
  validateDate('endDate'),
  handleValidationErrors
], getStockHistory);

// 获取题材信息
// GET /api/v1/stocks/sectors?date=2024-01-01
router.get('/sectors', [
  validateDate(),
  handleValidationErrors
], getSectorInfo);

// 搜索股票
// GET /api/v1/stocks/search?keyword=平安&limit=10
router.get('/search', [
  handleValidationErrors
], searchStocks);

module.exports = router;