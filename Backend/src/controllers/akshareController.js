const akshareService = require('../services/akshareService');
const moment = require('moment');

// 获取股票日线数据
const getStockDaily = async (req, res, next) => {
  try {
    const { 
      symbol,
      start = moment().subtract(1, 'year').format('YYYYMMDD'),
      end = moment().format('YYYYMMDD'),
      adjust = 'qfq'
    } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: '股票代码不能为空'
      });
    }

    const data = await akshareService.getStockDaily(symbol, start, end, adjust);

    res.status(200).json({
      success: true,
      data: {
        symbol,
        start,
        end,
        adjust,
        records: data
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取股票基本信息
const getStockInfo = async (req, res, next) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: '股票代码不能为空'
      });
    }

    const data = await akshareService.getStockInfo(symbol);

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

// 获取涨停股票列表
const getLimitUpStocks = async (req, res, next) => {
  try {
    const { date } = req.query;

    const data = await akshareService.getLimitUpStocks(date);

    res.status(200).json({
      success: true,
      data: data,
      meta: {
        date: date || moment().format('YYYY-MM-DD'),
        total: data.length,
        note: "字段标记为'--'表示AKShare API无法直接提供该数据"
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取跌停股票列表
const getLimitDownStocks = async (req, res, next) => {
  try {
    const { date } = req.query;

    const data = await akshareService.getLimitDownStocks(date);

    res.status(200).json({
      success: true,
      data: data,
      meta: {
        date: date || moment().format('YYYY-MM-DD'),
        total: data.length,
        note: "字段标记为'--'表示AKShare API无法直接提供该数据"
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取实时股票数据
const getStockRealtime = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const symbols = symbol ? symbol.split(',') : [];

    const data = await akshareService.getStockRealtime(symbols);

    res.status(200).json({
      success: true,
      data: data,
      meta: {
        symbols: symbols,
        total: data.length,
        note: "字段标记为'--'表示AKShare API无法直接提供该数据"
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取股票列表
const getStockList = async (req, res, next) => {
  try {
    const { market = 'all' } = req.query;

    const data = await akshareService.getStockList(market);

    res.status(200).json({
      success: true,
      data: data,
      meta: {
        market: market,
        total: data.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStockDaily,
  getStockInfo,
  getLimitUpStocks,
  getLimitDownStocks,
  getStockRealtime,
  getStockList
};