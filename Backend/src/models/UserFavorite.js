const mongoose = require('mongoose');

const userFavoriteSchema = new mongoose.Schema({
  // 用户标识（简化版，实际项目中可能需要用户系统）
  userId: {
    type: String,
    required: true,
    default: 'default_user',
    index: true
  },
  
  // 日期
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // 自选股票列表
  favoriteStocks: [{
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true
    },
    stockCode: {
      type: String,
      required: true
    },
    stockName: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    // 用户自定义排序
    sortOrder: {
      type: Number,
      default: 0
    }
  }],
  
  // 创建和更新时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 复合索引
userFavoriteSchema.index({ userId: 1, date: -1 }, { unique: true });

// 更新时间中间件
userFavoriteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 添加自选股方法
userFavoriteSchema.methods.addFavoriteStock = function(stockData) {
  const existingStock = this.favoriteStocks.find(
    stock => stock.stockCode === stockData.stockCode
  );
  
  if (!existingStock) {
    this.favoriteStocks.push({
      ...stockData,
      sortOrder: this.favoriteStocks.length
    });
  }
  
  return this.save();
};

// 移除自选股方法
userFavoriteSchema.methods.removeFavoriteStock = function(stockCode) {
  this.favoriteStocks = this.favoriteStocks.filter(
    stock => stock.stockCode !== stockCode
  );
  
  // 重新排序
  this.favoriteStocks.forEach((stock, index) => {
    stock.sortOrder = index;
  });
  
  return this.save();
};

// 更新排序方法
userFavoriteSchema.methods.updateStockOrder = function(stockOrder) {
  stockOrder.forEach((item, index) => {
    const stock = this.favoriteStocks.find(s => s.stockCode === item.stockCode);
    if (stock) {
      stock.sortOrder = index;
    }
  });
  
  return this.save();
};

module.exports = mongoose.model('UserFavorite', userFavoriteSchema);