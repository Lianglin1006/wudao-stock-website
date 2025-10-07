const mongoose = require('mongoose');

const sectorInfoSchema = new mongoose.Schema({
  // 题材名称
  sectorName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  // 日期
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // 题材爆发原因
  reason: {
    type: String,
    required: true,
    trim: true
  },
  
  // 热点持续性（连续几日有涨停股）
  continuityDays: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  
  // 该题材当日涨停股数量
  limitUpStockCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  
  // 题材强度评级
  strength: {
    type: String,
    enum: ['强', '中', '弱'],
    default: '中'
  },
  
  // 是否为新题材
  isNewSector: {
    type: Boolean,
    default: false
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

// 复合索引
sectorInfoSchema.index({ date: -1, sectorName: 1 }, { unique: true });
sectorInfoSchema.index({ date: -1, strength: 1 });

// 更新时间中间件
sectorInfoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SectorInfo', sectorInfoSchema);