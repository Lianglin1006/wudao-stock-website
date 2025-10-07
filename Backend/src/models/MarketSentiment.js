const mongoose = require('mongoose');

const marketSentimentSchema = new mongoose.Schema({
  // 日期
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },
  
  // 市场筛选条件
  marketFilter: {
    includeShenzhenShanghai: { type: Boolean, default: true },
    includeChiNext: { type: Boolean, default: true },
    includeStar: { type: Boolean, default: true },
    includeBSE: { type: Boolean, default: true }
  },
  
  // 成交量数据
  totalVolume: {
    type: Number,
    required: true,
    min: 0
  },
  volumeChange: {
    type: Number,
    required: true
  },
  
  // 连板数据
  maxLimitUpCount: {
    type: Number,
    required: true,
    min: 0
  },
  maxLimitUpCountIn4Weeks: {
    type: Number,
    required: true,
    min: 0
  },
  
  // 涨停数据
  limitUpCount: {
    type: Number,
    required: true,
    min: 0
  },
  limitUpCountChange: {
    type: Number,
    required: true
  },
  limitUpSealRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  limitUpSealRateChange: {
    type: Number,
    required: true
  },
  
  // 跌停数据
  limitDownCount: {
    type: Number,
    required: true,
    min: 0
  },
  limitDownCountChange: {
    type: Number,
    required: true
  },
  limitDownSealRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  limitDownSealRateChange: {
    type: Number,
    required: true
  },
  
  // 连板晋级率
  consecutiveLimitUpRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // 断板次日修复率
  brokenLimitUpRecoveryRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
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

// 更新时间中间件
marketSentimentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('MarketSentiment', marketSentimentSchema);