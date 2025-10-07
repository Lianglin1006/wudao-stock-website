const UserFavorite = require('../models/UserFavorite');
const Stock = require('../models/Stock');
const moment = require('moment');

// 获取用户自选股
const getFavoriteStocks = async (req, res, next) => {
  try {
    const { 
      userId = 'default_user',
      date = moment().format('YYYY-MM-DD'),
      groupBySector = 'false',
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = req.query;

    // 查找用户自选股记录
    let userFavorite = await UserFavorite.findOne({
      userId,
      date: new Date(date)
    }).populate('favoriteStocks.stockId');

    if (!userFavorite) {
      return res.status(200).json({
        success: true,
        data: {
          date,
          totalCount: 0,
          favoriteStocks: [],
          groupedStocks: {}
        }
      });
    }

    // 获取完整的股票信息
    const stockIds = userFavorite.favoriteStocks.map(fav => fav.stockId);
    const stocks = await Stock.find({
      _id: { $in: stockIds },
      date: new Date(date)
    });

    // 合并自选股信息和股票详情
    const favoriteStocksWithDetails = userFavorite.favoriteStocks.map(favorite => {
      const stockDetail = stocks.find(stock => 
        stock._id.toString() === favorite.stockId.toString()
      );
      
      return {
        ...favorite.toObject(),
        stockDetail: stockDetail || null
      };
    }).filter(item => item.stockDetail); // 过滤掉没有找到详情的股票

    // 排序
    if (sortBy !== 'sortOrder') {
      favoriteStocksWithDetails.sort((a, b) => {
        const aValue = a.stockDetail[sortBy];
        const bValue = b.stockDetail[sortBy];
        
        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
    } else {
      // 按用户自定义排序
      favoriteStocksWithDetails.sort((a, b) => {
        return sortOrder === 'desc' ? b.sortOrder - a.sortOrder : a.sortOrder - b.sortOrder;
      });
    }

    let result;

    if (groupBySector === 'true') {
      // 按题材分组
      const groupedStocks = {};
      
      favoriteStocksWithDetails.forEach(item => {
        const sector = item.stockDetail.sector;
        if (!groupedStocks[sector]) {
          groupedStocks[sector] = {
            stocks: []
          };
        }
        groupedStocks[sector].stocks.push(item);
      });

      result = {
        success: true,
        data: {
          date,
          totalCount: favoriteStocksWithDetails.length,
          groupedStocks,
          sectorCount: Object.keys(groupedStocks).length
        }
      };
    } else {
      result = {
        success: true,
        data: {
          date,
          totalCount: favoriteStocksWithDetails.length,
          favoriteStocks: favoriteStocksWithDetails
        }
      };
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 添加自选股
const addFavoriteStock = async (req, res, next) => {
  try {
    const { 
      userId = 'default_user',
      date = moment().format('YYYY-MM-DD'),
      stockId,
      stockCode,
      stockName
    } = req.body;

    if (!stockId || !stockCode || !stockName) {
      return res.status(400).json({
        success: false,
        message: '缺少必要的股票信息'
      });
    }

    // 验证股票是否存在
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: '股票不存在'
      });
    }

    // 查找或创建用户自选股记录
    let userFavorite = await UserFavorite.findOne({
      userId,
      date: new Date(date)
    });

    if (!userFavorite) {
      userFavorite = new UserFavorite({
        userId,
        date: new Date(date),
        favoriteStocks: []
      });
    }

    // 检查是否已经添加过
    const existingStock = userFavorite.favoriteStocks.find(
      fav => fav.stockCode === stockCode
    );

    if (existingStock) {
      return res.status(400).json({
        success: false,
        message: '该股票已在自选列表中'
      });
    }

    // 添加自选股
    await userFavorite.addFavoriteStock({
      stockId,
      stockCode,
      stockName
    });

    res.status(201).json({
      success: true,
      message: '添加自选股成功',
      data: {
        totalCount: userFavorite.favoriteStocks.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// 移除自选股
const removeFavoriteStock = async (req, res, next) => {
  try {
    const { 
      userId = 'default_user',
      date = moment().format('YYYY-MM-DD')
    } = req.query;
    const { stockCode } = req.params;

    const userFavorite = await UserFavorite.findOne({
      userId,
      date: new Date(date)
    });

    if (!userFavorite) {
      return res.status(404).json({
        success: false,
        message: '自选股列表不存在'
      });
    }

    // 移除自选股
    await userFavorite.removeFavoriteStock(stockCode);

    res.status(200).json({
      success: true,
      message: '移除自选股成功',
      data: {
        totalCount: userFavorite.favoriteStocks.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// 更新自选股排序
const updateFavoriteStockOrder = async (req, res, next) => {
  try {
    const { 
      userId = 'default_user',
      date = moment().format('YYYY-MM-DD'),
      stockOrder
    } = req.body;

    if (!stockOrder || !Array.isArray(stockOrder)) {
      return res.status(400).json({
        success: false,
        message: '无效的排序数据'
      });
    }

    const userFavorite = await UserFavorite.findOne({
      userId,
      date: new Date(date)
    });

    if (!userFavorite) {
      return res.status(404).json({
        success: false,
        message: '自选股列表不存在'
      });
    }

    // 更新排序
    await userFavorite.updateStockOrder(stockOrder);

    res.status(200).json({
      success: true,
      message: '更新排序成功'
    });
  } catch (error) {
    next(error);
  }
};

// 检查股票是否在自选列表中
const checkFavoriteStock = async (req, res, next) => {
  try {
    const { 
      userId = 'default_user',
      date = moment().format('YYYY-MM-DD')
    } = req.query;
    const { stockCode } = req.params;

    const userFavorite = await UserFavorite.findOne({
      userId,
      date: new Date(date)
    });

    const isFavorite = userFavorite ? 
      userFavorite.favoriteStocks.some(fav => fav.stockCode === stockCode) : 
      false;

    res.status(200).json({
      success: true,
      data: {
        stockCode,
        isFavorite
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavoriteStocks,
  addFavoriteStock,
  removeFavoriteStock,
  updateFavoriteStockOrder,
  checkFavoriteStock
};