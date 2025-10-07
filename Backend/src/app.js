const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 中间件
app.use(helmet()); // 安全头
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined')); // 日志
app.use(express.json({ limit: '10mb' })); // JSON 解析
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL 编码解析

// 路由
const stockRoutes = require('./routes/stockRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const marketRoutes = require('./routes/marketRoutes');
const akshareRoutes = require('./routes/akshareRoutes');

// API 路由
app.use('/api/v1/stocks', stockRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/akshare', akshareRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected' // 这里可以添加实际的数据库连接检查
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `路由 ${req.originalUrl} 不存在`
  });
});

// 错误处理中间件
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;