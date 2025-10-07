import { useState, useEffect } from 'react';
import { getStockDaily, getLimitUpStocks, getLimitDownStocks, StockData } from '../services/api';
import { Stock } from '../utils/mockData';

export interface UseStockDataReturn {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

// 将API数据转换为应用所需的Stock格式
const transformApiDataToStock = (apiData: any[], index: number): Stock => {
  // 这里需要根据实际API返回的数据结构进行调整
  const latestData = apiData[apiData.length - 1] || {};
  
  return {
    id: (index + 1).toString(),
    code: `${300000 + index}`, // 临时生成股票代码
    name: `股票${index + 1}`, // 临时生成股票名称
    price: latestData.close || 0,
    change: latestData.pct_change || 0,
    limitTime: '09:30', // 临时数据
    boards: Math.floor(Math.random() * 5) + 1,
    reason: '热点概念', // 临时数据
    marketCap: Math.random() * 100 + 10,
    sealAmount: Math.random() * 10 + 1,
    sealRatio: Math.floor(Math.random() * 100),
    sealFlowRatio: Math.floor(Math.random() * 100),
    highestBoards: Math.floor(Math.random() * 10) + 1,
    turnover: Math.random() * 10 + 1,
    turnoverRate: Math.random() * 10,
    pe: Math.random() * 50 + 10,
    risk: Math.random() > 0.8 ? '高' : '无',
    sector: '科技'
  };
};

export const useStockData = (date?: Date): UseStockDataReturn => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 获取一些示例股票的数据
      const stockCodes = ['000001', '000002', '300001', '300014', '600000'];
      const stockDataPromises = stockCodes.map(code => 
        getStockDaily(code, '20240101', '20241201', 'qfq')
          .catch(err => {
            console.warn(`获取股票 ${code} 数据失败:`, err);
            return []; // 返回空数组作为fallback
          })
      );
      
      const stockDataResults = await Promise.all(stockDataPromises);
      
      // 转换数据格式
      const transformedStocks = stockDataResults
        .filter(data => data.length > 0) // 过滤掉空数据
        .map((data, index) => transformApiDataToStock(data, index));
      
      setStocks(transformedStocks);
    } catch (err) {
      console.error('获取股票数据失败:', err);
      setError('获取股票数据失败，请稍后重试');
      // 如果API调用失败，可以fallback到mock数据
      // setStocks(mockStocks);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchStockData();
  };

  useEffect(() => {
    fetchStockData();
  }, [date]);

  return {
    stocks,
    loading,
    error,
    refreshData
  };
};

// 获取涨停股票数据的Hook
export const useLimitUpStocks = (date?: string) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLimitUpStocks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getLimitUpStocks(date);
      setStocks(data);
    } catch (err) {
      console.error('获取涨停股票数据失败:', err);
      setError('获取涨停股票数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimitUpStocks();
  }, [date]);

  return {
    stocks,
    loading,
    error,
    refresh: fetchLimitUpStocks
  };
};