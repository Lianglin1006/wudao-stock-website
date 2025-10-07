const axios = require('axios');

// AKShare API 基础配置
const AKSHARE_BASE_URL = 'https://akshare-api.onrender.com';

// 创建 axios 实例
const akshareClient = axios.create({
  baseURL: AKSHARE_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取股票日线数据
const getStockDaily = async (symbol, start = '20240101', end = '20241201', adjust = 'qfq') => {
  try {
    const response = await akshareClient.get('/cn/stock/daily', {
      params: {
        symbol,
        start,
        end,
        adjust,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`获取股票 ${symbol} 日线数据失败:`, error.message);
    throw new Error(`获取股票数据失败: ${error.message}`);
  }
};

// 获取股票基本信息
const getStockInfo = async (symbol) => {
  try {
    const response = await akshareClient.get('/cn/stock/info', {
      params: { symbol },
    });
    return response.data;
  } catch (error) {
    console.error(`获取股票 ${symbol} 信息失败:`, error.message);
    throw new Error(`获取股票信息失败: ${error.message}`);
  }
};

// 获取涨停股票列表
const getLimitUpStocks = async (date) => {
  try {
    const response = await akshareClient.get('/cn/stock/limit_up', {
      params: date ? { date } : {},
    });
    return response.data;
  } catch (error) {
    console.error('获取涨停股票列表失败:', error.message);
    throw new Error(`获取涨停股票列表失败: ${error.message}`);
  }
};

// 获取跌停股票列表
const getLimitDownStocks = async (date) => {
  try {
    const response = await akshareClient.get('/cn/stock/limit_down', {
      params: date ? { date } : {},
    });
    return response.data;
  } catch (error) {
    console.error('获取跌停股票列表失败:', error.message);
    throw new Error(`获取跌停股票列表失败: ${error.message}`);
  }
};

// 获取实时股票数据
const getStockRealtime = async (symbol) => {
  try {
    const response = await akshareClient.get('/cn/stock/realtime', {
      params: { symbol },
    });
    return response.data;
  } catch (error) {
    console.error(`获取股票 ${symbol} 实时数据失败:`, error.message);
    throw new Error(`获取实时股票数据失败: ${error.message}`);
  }
};

// 获取股票列表
const getStockList = async () => {
  try {
    const response = await akshareClient.get('/cn/stock/list');
    return response.data;
  } catch (error) {
    console.error('获取股票列表失败:', error.message);
    throw new Error(`获取股票列表失败: ${error.message}`);
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