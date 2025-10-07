const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  // 基本信息
  code: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  market: {
    type: String,
    required: true,
    enum: ['深市', '沪市', '创业板', '科创板', '北证', 'ST'],
    index: true
  },
  
  // 价格信息
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  changePercent: {
    type: Number,
    required: true
  },
  
  // 涨停相关
  limitUpTime: {
    type: String,
    required: true
  },
  consecutiveLimitUps: {
    type: Number,
    default: 1,
    min: 1
  },
  historicalMaxLimitUps: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // 题材和原因
  sector: {
    type: String,
    required: true,
    index: true
  },
  limitUpReason: {
    type: String,
    required: true
  },
  limitUpReasonDetail: {
    type: String,
    default: ''
  },
  
  // 市值和交易数据
  circulatingMarketCap: {
    type: Number,
    required: true,
    min: 0
  },
  sealAmount: {
    type: Number,
    required: true,
    min: 0
  },
  sealRatio: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  sealFlowRatio: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  turnover: {
    type: Number,
    required: true,
    min: 0
  },
  turnoverRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  peRatio: {
    type: Number,
    default: null
  },
  
  // 日期信息
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // 风险标识
  riskFlags: [{
    type: String,
    enum: ['ST', '退市风险', '业绩亏损', '高估值', '流动性风险']
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
stockSchema.index({ date: -1, market: 1 });
stockSchema.index({ date: -1, sector: 1 });
stockSchema.index({ date: -1, consecutiveLimitUps: -1 });

// 更新时间中间件
stockSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Stock', stockSchema);