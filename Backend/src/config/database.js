const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 检查是否配置了MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.log('⚠️  No MongoDB URI configured - running without database');
      return;
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // 在开发环境中，如果MongoDB连接失败，我们继续运行但使用模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Running in development mode without MongoDB - using mock data');
      return;
    }
    
    process.exit(1);
  }
};

// 监听连接事件
mongoose.connection.on('disconnected', () => {
  console.log('📦 MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

module.exports = connectDB;