const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3001;

// 连接数据库
connectDB();

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`🚀 Wudao Backend Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

module.exports = server;