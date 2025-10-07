const express = require('express');
const router = express.Router();
const akshareController = require('../controllers/akshareController');

// 获取股票日线数据
router.get('/stock/daily', akshareController.getStockDaily);

// 获取股票基本信息
router.get('/stock/info/:symbol', akshareController.getStockInfo);

// 获取涨停股票列表
router.get('/stock/limit-up', akshareController.getLimitUpStocks);

// 获取跌停股票列表
router.get('/stock/limit-down', akshareController.getLimitDownStocks);

// 获取实时股票数据
router.get('/stock/realtime/:symbol', akshareController.getStockRealtime);

// 获取股票列表
router.get('/stock/list', akshareController.getStockList);

module.exports = router;