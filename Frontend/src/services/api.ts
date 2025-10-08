import axios from 'axios';

// API 基础配置 - 通过后端调用
const API_BASE_URL = 'https://wudao-stock-website.onrender.com/api/v1';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 股票数据接口
export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
  pct_change: number;
  turnover: number;
}

// 获取股票日线数据
export const getStockDaily = async (
  symbol: string,
  start: string = '20240101',
  end: string = '20241201',
  adjust: string = 'qfq'
): Promise<StockData[]> => {
  try {
    const response = await apiClient.get('/akshare/stock/daily', {
      params: {
        symbol,
        start,
        end,
        adjust,
      },
    });
    return response.data.data.records || [];
  } catch (error) {
    console.error('获取股票数据失败:', error);
    throw error;
  }
};

// 获取股票基本信息
export const getStockInfo = async (symbol: string) => {
  try {
    const response = await apiClient.get('/akshare/stock/info', {
      params: { symbol },
    });
    return response.data;
  } catch (error) {
    console.error('获取股票信息失败:', error);
    throw error;
  }
};

// 获取涨停股票列表
export const getLimitUpStocks = async (date?: string) => {
  try {
    const response = await apiClient.get('/akshare/stock/limit-up', {
      params: date ? { date } : {},
    });
    return response.data;
  } catch (error) {
    console.error('获取涨停股票列表失败:', error);
    throw error;
  }
};

// 获取跌停股票列表
export const getLimitDownStocks = async (date?: string) => {
  try {
    const response = await apiClient.get('/akshare/stock/limit-down', {
      params: date ? { date } : {},
    });
    return response.data;
  } catch (error) {
    console.error('获取跌停股票列表失败:', error);
    throw error;
  }
};

export default apiClient;