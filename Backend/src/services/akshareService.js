const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

// Python AKShare客户端路径
const AKSHARE_CLIENT_PATH = path.join(__dirname, 'akshare_client.py');

// 调用Python AKShare客户端的通用函数
const callAKShareClient = (command, ...args) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [AKSHARE_CLIENT_PATH, command, ...args]);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`AKShare客户端错误: ${stderr}`);
        reject(new Error(`AKShare客户端执行失败: ${stderr}`));
        return;
      }
      
      try {
        const result = JSON.parse(stdout);
        if (result.success) {
          resolve(result.data);
        } else {
          reject(new Error(result.error));
        }
      } catch (error) {
        console.error('解析AKShare响应失败:', error);
        reject(new Error('解析响应数据失败'));
      }
    });
    
    pythonProcess.on('error', (error) => {
      console.error('启动Python进程失败:', error);
      reject(error);
    });
  });
};

// 模拟真实股票数据的生成函数（作为备用）
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

// AKShare服务接口实现
const akshareService = {
  // 获取股票日线数据
  async getStockDaily(symbol, start, end) {
    try {
      // 尝试从AKShare获取真实数据
      const data = await callAKShareClient('stock_daily', symbol, start, end);
      return data;
    } catch (error) {
      console.warn('AKShare获取日线数据失败，使用模拟数据:', error.message);
      // 如果AKShare失败，返回模拟数据
      return generateRealisticStockData(symbol, start, end);
    }
  },

  // 获取股票基本信息
  async getStockInfo(symbol) {
    try {
      // 尝试从AKShare获取真实数据
      const data = await callAKShareClient('stock_info', symbol);
      return data;
    } catch (error) {
      console.warn('AKShare获取股票信息失败，使用模拟数据:', error.message);
      // 如果AKShare失败，返回模拟数据，标记不可用字段为"--"
      return {
        code: symbol,
        name: `股票${symbol}`,
        industry: '--',
        market: symbol.startsWith('6') ? '上海' : '深圳',
        list_date: '--',
        market_cap: '--',
        pe_ratio: '--',
        pb_ratio: '--',
        dividend_yield: '--',
        roe: '--',
        debt_ratio: '--'
      };
    }
  },

  // 获取涨停股票池
  async getLimitUpStocks(date = null) {
    try {
      // 尝试从AKShare获取真实数据
      const data = await callAKShareClient('limit_up', date || new Date().toISOString().split('T')[0].replace(/-/g, ''));
      return data;
    } catch (error) {
      console.warn('AKShare获取涨停股票失败，使用模拟数据:', error.message);
      // 如果AKShare失败，返回模拟数据，标记不可用字段为"--"
      return [
        {
          code: '000001',
          name: '平安银行',
          price: 12.50,
          change_percent: 10.00,
          latest_price: 12.50,
          turnover: 850000000,
          market_cap: 242000000000,
          industry: '银行',
          limit_up_type: '--',
          first_limit_time: '--',
          last_limit_time: '--',
          open_times: '--',
          limit_up_fund: '--',
          continuous_limit_up: '--'
        },
        {
          code: '300750',
          name: '宁德时代',
          price: 185.60,
          change_percent: 10.00,
          latest_price: 185.60,
          turnover: 1200000000,
          market_cap: 815000000000,
          industry: '电池',
          limit_up_type: '--',
          first_limit_time: '--',
          last_limit_time: '--',
          open_times: '--',
          limit_up_fund: '--',
          continuous_limit_up: '--'
        }
      ];
    }
  },

  // 获取跌停股票池
  async getLimitDownStocks(date = null) {
    try {
      // 尝试从AKShare获取真实数据
      const data = await callAKShareClient('limit_down', date || new Date().toISOString().split('T')[0].replace(/-/g, ''));
      return data;
    } catch (error) {
      console.warn('AKShare获取跌停股票失败，使用模拟数据:', error.message);
      // 如果AKShare失败，返回模拟数据，标记不可用字段为"--"
      return [
        {
          code: '002415',
          name: '海康威视',
          price: 28.50,
          change_percent: -10.00,
          latest_price: 28.50,
          turnover: 450000000,
          market_cap: 265000000000,
          industry: '安防',
          limit_down_type: '--',
          first_limit_time: '--',
          last_limit_time: '--',
          open_times: '--',
          continuous_limit_down: '--'
        }
      ];
    }
  },

  // 获取实时股票数据
  async getStockRealtime(symbols = []) {
    try {
      // 尝试从AKShare获取真实数据
      const data = await callAKShareClient('realtime');
      return data;
    } catch (error) {
      console.warn('AKShare获取实时数据失败，使用模拟数据:', error.message);
      // 如果AKShare失败，返回模拟数据，标记不可用字段为"--"
      const mockData = [];
      const defaultSymbols = symbols.length > 0 ? symbols : ['000001', '000002', '600000', '600036'];
      
      defaultSymbols.forEach(symbol => {
        const basePrice = 50 + Math.random() * 100;
        const change = (Math.random() - 0.5) * 0.1;
        
        mockData.push({
          code: symbol,
          name: `股票${symbol}`,
          current_price: Number((basePrice * (1 + change)).toFixed(2)),
          change_amount: Number((basePrice * change).toFixed(2)),
          change_percent: Number((change * 100).toFixed(2)),
          open: Number((basePrice * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
          high: Number((basePrice * (1 + Math.random() * 0.05)).toFixed(2)),
          low: Number((basePrice * (1 - Math.random() * 0.05)).toFixed(2)),
          volume: Math.floor(Math.random() * 1000000 + 100000),
          turnover: Number((Math.random() * 1000000000).toFixed(0)),
          pe_ratio: '--',
          pb_ratio: '--',
          market_cap: '--',
          circulation_market_cap: '--',
          amplitude: '--',
          volume_ratio: '--',
          five_minute_change: '--',
          sixty_day_change: '--',
          year_to_date_change: '--'
        });
      });
      
      return mockData;
    }
  },

  // 获取股票列表
  async getStockList(market = 'all') {
    try {
      // 尝试从AKShare获取真实数据
      const data = await callAKShareClient('stock_list', market);
      return data;
    } catch (error) {
      console.warn('AKShare获取股票列表失败，使用模拟数据:', error.message);
      // 如果AKShare失败，返回模拟数据
      return [
        { code: '000001', name: '平安银行', market: '深圳' },
        { code: '000002', name: '万科A', market: '深圳' },
        { code: '000858', name: '五粮液', market: '深圳' },
        { code: '002415', name: '海康威视', market: '深圳' },
        { code: '300750', name: '宁德时代', market: '深圳' },
        { code: '600000', name: '浦发银行', market: '上海' },
        { code: '600036', name: '招商银行', market: '上海' },
        { code: '600519', name: '贵州茅台', market: '上海' },
        { code: '600887', name: '伊利股份', market: '上海' },
        { code: '601318', name: '中国平安', market: '上海' }
      ];
    }
  }
};

module.exports = akshareService;