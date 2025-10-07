const Stock = require('../models/Stock');
const SectorInfo = require('../models/SectorInfo');
const akshareService = require('../services/akshareService');
const moment = require('moment');

// 获取指定日期的涨停股票
const getLimitUpStocks = async (req, res, next) => {
  try {
    const { 
      date = moment().format('YYYY-MM-DD'),
      groupBySector = 'true',
      markets = [],
      minPrice,
      maxPrice,
      limitUpTimeStart,
      limitUpTimeEnd,
      minMarketCap,
      maxMarketCap,
      minSealAmount,
      minSealRatio,
      minSealFlowRatio,
      sortBy = 'limitUpTime',
      sortOrder = 'asc'
    } = req.query;

    // 构建查询条件
    const query = {
      date: new Date(date)
    };

    // 市场筛选
    if (markets.length > 0) {
      query.market = { $in: markets };
    }

    // 价格区间筛选
    if (minPrice || maxPrice) {
      query.currentPrice = {};
      if (minPrice) query.currentPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.currentPrice.$lte = parseFloat(maxPrice);
    }

    // 涨停时间筛选
    if (limitUpTimeStart || limitUpTimeEnd) {
      query.limitUpTime = {};
      if (limitUpTimeStart) query.limitUpTime.$gte = limitUpTimeStart;
      if (limitUpTimeEnd) query.limitUpTime.$lte = limitUpTimeEnd;
    }

    // 流通市值筛选
    if (minMarketCap || maxMarketCap) {
      query.circulatingMarketCap = {};
      if (minMarketCap) query.circulatingMarketCap.$gte = parseFloat(minMarketCap);
      if (maxMarketCap) query.circulatingMarketCap.$lte = parseFloat(maxMarketCap);
    }

    // 封单金额筛选
    if (minSealAmount) {
      query.sealAmount = { $gte: parseFloat(minSealAmount) };
    }

    // 封成比筛选
    if (minSealRatio) {
      query.sealRatio = { $gte: parseFloat(minSealRatio) };
    }

    // 封流比筛选
    if (minSealFlowRatio) {
      query.sealFlowRatio = { $gte: parseFloat(minSealFlowRatio) };
    }

    // 排序设置
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // 查询股票数据
    const stocks = await Stock.find(query).sort(sort);

    let result;

    if (groupBySector === 'true') {
      // 按题材分组
      const groupedStocks = {};
      const sectorInfoMap = {};

      // 获取题材信息
      const sectorInfos = await SectorInfo.find({ date: new Date(date) });
      sectorInfos.forEach(info => {
        sectorInfoMap[info.sectorName] = {
          reason: info.reason,
          continuityDays: info.continuityDays,
          strength: info.strength
        };
      });

      // 分组股票
      stocks.forEach(stock => {
        if (!groupedStocks[stock.sector]) {
          groupedStocks[stock.sector] = {
            sectorInfo: sectorInfoMap[stock.sector] || {
              reason: '暂无数据',
              continuityDays: 1,
              strength: '中'
            },
            stocks: []
          };
        }
        groupedStocks[stock.sector].stocks.push(stock);
      });

      result = {
        success: true,
        data: {
          date,
          totalCount: stocks.length,
          groupedStocks,
          sectorCount: Object.keys(groupedStocks).length
        }
      };
    } else {
      // 不分组，返回所有股票
      result = {
        success: true,
        data: {
          date,
          totalCount: stocks.length,
          stocks
        }
      };
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 获取股票详情
const getStockDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const stock = await Stock.findById(id);
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: '股票信息未找到'
      });
    }

    res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    next(error);
  }
};

// 获取股票历史连板记录
const getStockHistory = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { limit = 30 } = req.query;

    const stocks = await Stock.find({ code })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        code,
        history: stocks
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取题材信息
const getSectorInfo = async (req, res, next) => {
  try {
    const { date = moment().format('YYYY-MM-DD') } = req.query;

    const sectorInfos = await SectorInfo.find({ date: new Date(date) })
      .sort({ continuityDays: -1, limitUpStockCount: -1 });

    res.status(200).json({
      success: true,
      data: {
        date,
        sectors: sectorInfos
      }
    });
  } catch (error) {
    next(error);
  }
};

// 搜索股票
const searchStocks = async (req, res, next) => {
  try {
    const { keyword, date = moment().format('YYYY-MM-DD') } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '请提供搜索关键词'
      });
    }

    const query = {
      date: new Date(date),
      $or: [
        { code: { $regex: keyword, $options: 'i' } },
        { name: { $regex: keyword, $options: 'i' } },
        { sector: { $regex: keyword, $options: 'i' } }
      ]
    };

    const stocks = await Stock.find(query).limit(20);

    res.status(200).json({
      success: true,
      data: {
        keyword,
        date,
        results: stocks
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLimitUpStocks,
  getStockDetail,
  getStockHistory,
  getSectorInfo,
  searchStocks
};