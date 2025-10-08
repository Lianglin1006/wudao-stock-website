const axios = require('axios');

// 使用免费的股票数据API - Alpha Vantage或者其他可用的API
// 这里我们先创建一个模拟的数据服务，返回真实格式的数据

// 模拟真实股票数据的生成函数
const generateRealisticStockData = (symbol, start, end) => {
  const startDate = new Date(start.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
  const endDate = new Date(end.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
  const data = [];
  
  let currentDate = new Date(startDate);
  let basePrice = 50 + Math.random() * 100; // 基础价格在50-150之间
  
  while (currentDate <= endDate) {
    // 跳过周末
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const dailyChange = (Math.random() - 0.5) * 0.1; // -5% 到 +5% 的日变化
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.02);
      const close = basePrice * (1 + dailyChange);
      const high = Math.max(open, close) * (1 + Math.random() * 0.03);
      const low = Math.min(open, close) * (1 - Math.random() * 0.03);
      const volume = Math.floor(Math.random() * 1000000 + 100000);
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: volume,
        amount: Number((volume * close).toFixed(2)),
        pct_change: Number((dailyChange * 100).toFixed(2)),
        turnover: Number((Math.random() * 10).toFixed(2))
      });
      
      basePrice = close; // 更新基础价格
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

// 生成涨停股票数据
const generateLimitUpStocks = () => {
  const stocks = [];
  const stockCodes = ['000001', '000002', '300001', '300014', '600000', '600036', '002594'];
  const stockNames = ['平安银行', '万科A', '特锐德', '亿纬锂能', '浦发银行', '招商银行', '比亚迪'];
  
  for (let i = 0; i < stockCodes.length; i++) {
    stocks.push({
      code: stockCodes[i],
      name: stockNames[i],
      price: Number((Math.random() * 100 + 10).toFixed(2)),
      change: 10.00, // 涨停
      limit_time: `${String(9 + Math.floor(Math.random() * 6)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      reason: '热点概念+政策利好',
      market_cap: Number((Math.random() * 1000 + 100).toFixed(0)),
      turnover: Number((Math.random() * 50 + 5).toFixed(1))
    });
  }
  
  return stocks;
};

// 获取股票日线数据
const getStockDaily = async (symbol, start = '20240101', end = '20241201', adjust = 'qfq') => {
  try {
    // 由于外部API不可用，我们返回模拟的真实格式数据
    console.log(`获取股票 ${symbol} 的数据 (${start} 到 ${end})`);
    
    const data = generateRealisticStockData(symbol, start, end);
    
    return data;
  } catch (error) {
    console.error(`获取股票 ${symbol} 日线数据失败:`, error.message);
    throw new Error(`获取股票数据失败: ${error.message}`);
  }
};

// 获取股票基本信息
const getStockInfo = async (symbol) => {
  try {
    // 返回模拟的股票基本信息
    const stockNames = {
      '000001': '平安银行',
      '000002': '万科A',
      '300001': '特锐德',
      '300014': '亿纬锂能',
      '600000': '浦发银行',
      '600036': '招商银行',
      '002594': '比亚迪'
    };
    
    return {
      symbol,
      name: stockNames[symbol] || `股票${symbol}`,
      market: symbol.startsWith('6') ? '上海' : (symbol.startsWith('3') || symbol.startsWith('0')) ? '深圳' : '未知',
      industry: '金融',
      list_date: '2000-01-01'
    };
  } catch (error) {
    console.error(`获取股票 ${symbol} 信息失败:`, error.message);
    throw new Error(`获取股票信息失败: ${error.message}`);
  }
};

// 获取涨停股票列表
const getLimitUpStocks = async (date) => {
  try {
    console.log(`获取涨停股票列表 (日期: ${date || '今日'})`);
    
    const data = generateLimitUpStocks();
    
    return data;
  } catch (error) {
    console.error('获取涨停股票列表失败:', error.message);
    throw new Error(`获取涨停股票列表失败: ${error.message}`);
  }
};

// 获取跌停股票列表
const getLimitDownStocks = async (date) => {
  try {
    console.log(`获取跌停股票列表 (日期: ${date || '今日'})`);
    
    // 返回少量跌停股票数据
    const data = [
      {
        code: '000003',
        name: '万科B',
        price: 45.67,
        change: -10.00,
        limit_time: '09:30',
        reason: '业绩下滑+市场调整',
        market_cap: 456,
        turnover: 12.3
      }
    ];
    
    return data;
  } catch (error) {
    console.error('获取跌停股票列表失败:', error.message);
    throw new Error(`获取跌停股票列表失败: ${error.message}`);
  }
};

// 获取实时股票数据
const getStockRealtime = async (symbol) => {
  try {
    console.log(`获取股票 ${symbol} 实时数据`);
    
    const basePrice = 50 + Math.random() * 100;
    const change = (Math.random() - 0.5) * 0.2; // -10% 到 +10%
    
    return {
      symbol,
      name: `股票${symbol}`,
      price: Number(basePrice.toFixed(2)),
      change: Number((change * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 1000000 + 100000),
      turnover: Number((Math.random() * 10).toFixed(2)),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`获取股票 ${symbol} 实时数据失败:`, error.message);
    throw new Error(`获取实时股票数据失败: ${error.message}`);
  }
};

// 获取股票列表
const getStockList = async () => {
  try {
    console.log('获取股票列表');
    
    const stocks = [
      { code: '000001', name: '平安银行', market: '深圳' },
      { code: '000002', name: '万科A', market: '深圳' },
      { code: '300001', name: '特锐德', market: '深圳' },
      { code: '300014', name: '亿纬锂能', market: '深圳' },
      { code: '600000', name: '浦发银行', market: '上海' },
      { code: '600036', name: '招商银行', market: '上海' },
      { code: '002594', name: '比亚迪', market: '深圳' }
    ];
    
    return stocks;
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