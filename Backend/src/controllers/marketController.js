const MarketSentiment = require('../models/MarketSentiment');
const Stock = require('../models/Stock');
const moment = require('moment');

// 获取市场情绪指标
const getMarketSentiment = async (req, res, next) => {
  try {
    const { 
      date = moment().format('YYYY-MM-DD'),
      includeShenzhenShanghai = true,
      includeChiNext = true,
      includeStar = true,
      includeBSE = true
    } = req.query;

    // 查找指定日期的市场情绪数据
    let marketSentiment = await MarketSentiment.findOne({
      date: new Date(date)
    });

    // 如果没有预存的数据，则实时计算
    if (!marketSentiment) {
      marketSentiment = await calculateMarketSentiment(
        date,
        {
          includeShenzhenShanghai: includeShenzhenShanghai === 'true',
          includeChiNext: includeChiNext === 'true',
          includeStar: includeStar === 'true',
          includeBSE: includeBSE === 'true'
        }
      );
    }

    res.status(200).json({
      success: true,
      data: marketSentiment
    });
  } catch (error) {
    next(error);
  }
};

// 计算市场情绪指标（实时计算函数）
const calculateMarketSentiment = async (date, marketFilter) => {
  const currentDate = new Date(date);
  const previousDate = new Date(currentDate);
  previousDate.setDate(previousDate.getDate() - 1);

  // 构建市场筛选条件
  const markets = [];
  if (marketFilter.includeShenzhenShanghai) {
    markets.push('深市', '沪市');
  }
  if (marketFilter.includeChiNext) {
    markets.push('创业板');
  }
  if (marketFilter.includeStar) {
    markets.push('科创板');
  }
  if (marketFilter.includeBSE) {
    markets.push('北证');
  }

  const marketQuery = markets.length > 0 ? { market: { $in: markets } } : {};

  // 获取当日和前一日的股票数据
  const [currentStocks, previousStocks] = await Promise.all([
    Stock.find({ date: currentDate, ...marketQuery }),
    Stock.find({ date: previousDate, ...marketQuery })
  ]);

  // 计算各项指标
  const currentLimitUpCount = currentStocks.length;
  const previousLimitUpCount = previousStocks.length;
  const limitUpCountChange = currentLimitUpCount - previousLimitUpCount;

  // 计算最高连板数
  const maxLimitUpCount = Math.max(...currentStocks.map(s => s.consecutiveLimitUps), 0);
  
  // 计算近4周最高连板数（这里简化处理，实际应该查询4周数据）
  const maxLimitUpCountIn4Weeks = maxLimitUpCount; // 简化处理

  // 计算封板率（这里简化，实际需要更复杂的计算）
  const limitUpSealRate = currentStocks.length > 0 ? 
    (currentStocks.filter(s => s.sealRatio > 80).length / currentStocks.length) * 100 : 0;
  const previousLimitUpSealRate = previousStocks.length > 0 ? 
    (previousStocks.filter(s => s.sealRatio > 80).length / previousStocks.length) * 100 : 0;
  const limitUpSealRateChange = limitUpSealRate - previousLimitUpSealRate;

  // 计算连板晋级率
  const previousConsecutiveStocks = previousStocks.filter(s => s.consecutiveLimitUps > 1);
  const currentContinuedStocks = currentStocks.filter(s => 
    s.consecutiveLimitUps > 1 && 
    previousConsecutiveStocks.some(ps => ps.code === s.code)
  );
  const consecutiveLimitUpRate = previousConsecutiveStocks.length > 0 ? 
    (currentContinuedStocks.length / previousConsecutiveStocks.length) * 100 : 0;

  // 计算断板次日修复率（简化处理）
  const brokenLimitUpRecoveryRate = 50; // 简化处理，实际需要复杂计算

  return {
    date: currentDate,
    marketFilter,
    totalVolume: 0, // 需要从其他数据源获取
    volumeChange: 0, // 需要从其他数据源获取
    maxLimitUpCount,
    maxLimitUpCountIn4Weeks,
    limitUpCount: currentLimitUpCount,
    limitUpCountChange,
    limitUpSealRate: Math.round(limitUpSealRate * 100) / 100,
    limitUpSealRateChange: Math.round(limitUpSealRateChange * 100) / 100,
    limitDownCount: 0, // 需要跌停股数据
    limitDownCountChange: 0,
    limitDownSealRate: 0,
    limitDownSealRateChange: 0,
    consecutiveLimitUpRate: Math.round(consecutiveLimitUpRate * 100) / 100,
    brokenLimitUpRecoveryRate: Math.round(brokenLimitUpRecoveryRate * 100) / 100
  };
};

// 获取市场情绪历史趋势
const getMarketSentimentTrend = async (req, res, next) => {
  try {
    const { 
      startDate = moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endDate = moment().format('YYYY-MM-DD'),
      limit = 30
    } = req.query;

    const sentiments = await MarketSentiment.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .sort({ date: -1 })
    .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        startDate,
        endDate,
        trend: sentiments
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取市场统计概览
const getMarketOverview = async (req, res, next) => {
  try {
    const { date = moment().format('YYYY-MM-DD') } = req.query;

    const currentDate = new Date(date);
    
    // 获取当日所有涨停股
    const stocks = await Stock.find({ date: currentDate });
    
    // 按市场分组统计
    const marketStats = {};
    const sectorStats = {};
    
    stocks.forEach(stock => {
      // 市场统计
      if (!marketStats[stock.market]) {
        marketStats[stock.market] = {
          count: 0,
          avgSealRatio: 0,
          totalMarketCap: 0
        };
      }
      marketStats[stock.market].count++;
      marketStats[stock.market].avgSealRatio += stock.sealRatio;
      marketStats[stock.market].totalMarketCap += stock.circulatingMarketCap;
      
      // 题材统计
      if (!sectorStats[stock.sector]) {
        sectorStats[stock.sector] = {
          count: 0,
          avgConsecutiveLimitUps: 0,
          strongStocks: 0
        };
      }
      sectorStats[stock.sector].count++;
      sectorStats[stock.sector].avgConsecutiveLimitUps += stock.consecutiveLimitUps;
      if (stock.sealRatio > 90) {
        sectorStats[stock.sector].strongStocks++;
      }
    });

    // 计算平均值
    Object.keys(marketStats).forEach(market => {
      const stat = marketStats[market];
      stat.avgSealRatio = Math.round((stat.avgSealRatio / stat.count) * 100) / 100;
      stat.totalMarketCap = Math.round(stat.totalMarketCap * 100) / 100;
    });

    Object.keys(sectorStats).forEach(sector => {
      const stat = sectorStats[sector];
      stat.avgConsecutiveLimitUps = Math.round((stat.avgConsecutiveLimitUps / stat.count) * 100) / 100;
    });

    res.status(200).json({
      success: true,
      data: {
        date,
        totalLimitUpCount: stocks.length,
        marketStats,
        sectorStats,
        topSectors: Object.entries(sectorStats)
          .sort(([,a], [,b]) => b.count - a.count)
          .slice(0, 10)
          .map(([name, stats]) => ({ name, ...stats }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMarketSentiment,
  getMarketSentimentTrend,
  getMarketOverview
};