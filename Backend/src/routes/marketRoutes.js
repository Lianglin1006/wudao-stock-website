const express = require('express');
const router = express.Router();
const {
  getMarketSentiment,
  getMarketSentimentTrend,
  getMarketOverview
} = require('../controllers/marketController');
const {
  validateMarketSentimentQuery,
  validateDate,
  handleValidationErrors
} = require('../middleware/validation');

// 获取市场情绪指标
// GET /api/v1/market/sentiment?date=2024-01-01&includeShenzhenShanghai=true&includeChiNext=true&includeStar=true&includeBSE=true
router.get('/sentiment', validateMarketSentimentQuery, getMarketSentiment);

// 获取市场情绪历史趋势
// GET /api/v1/market/sentiment/trend?startDate=2024-01-01&endDate=2024-01-31&limit=30
router.get('/sentiment/trend', [
  validateDate('startDate'),
  validateDate('endDate'),
  handleValidationErrors
], getMarketSentimentTrend);

// 获取市场统计概览
// GET /api/v1/market/overview?date=2024-01-01
router.get('/overview', [
  validateDate(),
  handleValidationErrors
], getMarketOverview);

module.exports = router;