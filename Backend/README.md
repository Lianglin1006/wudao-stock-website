# Wudao 股票复盘网站后端 API

## 项目简介

Wudao 是一个股票复盘网站的后端服务，提供涨停股票数据、市场情绪指标、用户自选股等功能的 API 接口。

## 技术栈

- **Node.js** - 运行环境
- **Express.js** - Web 框架
- **MongoDB** - 数据库
- **Mongoose** - ODM 工具
- **Express-validator** - 数据验证
- **Moment.js** - 日期处理

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- MongoDB >= 4.4.0

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `.env.example` 文件为 `.env` 并配置相应参数：

```bash
cp .env.example .env
```

### 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3001` 启动。

## API 接口文档

### 基础信息

- **Base URL**: `http://localhost:3001/api/v1`
- **Content-Type**: `application/json`

### 1. 股票相关接口

#### 1.1 获取涨停股票列表

```http
GET /stocks/limit-up
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| date | string | 否 | 今日 | 日期，格式：YYYY-MM-DD |
| groupBySector | boolean | 否 | false | 是否按题材分组 |
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 50 | 每页数量 |
| minPrice | number | 否 | - | 最低价格 |
| maxPrice | number | 否 | - | 最高价格 |
| minMarketCap | number | 否 | - | 最小市值（亿） |
| maxMarketCap | number | 否 | - | 最大市值（亿） |
| includeShenzhenShanghai | boolean | 否 | true | 包含深沪两市 |
| includeChiNext | boolean | 否 | true | 包含创业板 |
| includeStar | boolean | 否 | true | 包含科创板 |
| includeBSE | boolean | 否 | true | 包含北证 |
| excludeST | boolean | 否 | false | 排除ST股票 |
| sector | string | 否 | - | 题材筛选 |
| sortBy | string | 否 | limitUpTime | 排序字段 |
| sortOrder | string | 否 | desc | 排序方向（asc/desc） |

**响应示例：**

```json
{
  "success": true,
  "data": {
    "stocks": [
      {
        "_id": "...",
        "code": "000001",
        "name": "平安银行",
        "market": "深市",
        "price": 12.50,
        "changePercent": 10.00,
        "limitUpTime": "2024-01-01T09:30:00.000Z",
        "consecutiveLimitUps": 1,
        "reason": "银行板块利好",
        "circulatingMarketCap": 2420.5,
        "sealAmount": 15.8,
        "sealRatio": 85.6,
        "flowRatio": 0.65,
        "maxHistoryLimitUps": 3,
        "turnover": 125.6,
        "turnoverRate": 5.2,
        "pe": 6.8,
        "riskFlags": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 120,
      "pages": 3
    },
    "groupedBySector": false
  }
}
```

#### 1.2 获取股票详情

```http
GET /stocks/detail/:stockCode
```

**路径参数：**
- `stockCode`: 股票代码（6位数字）

**查询参数：**
- `date`: 日期，格式：YYYY-MM-DD

#### 1.3 获取股票历史涨停记录

```http
GET /stocks/history/:stockCode
```

**路径参数：**
- `stockCode`: 股票代码

**查询参数：**
- `startDate`: 开始日期
- `endDate`: 结束日期

#### 1.4 获取题材信息

```http
GET /stocks/sectors
```

**查询参数：**
- `date`: 日期

#### 1.5 搜索股票

```http
GET /stocks/search
```

**查询参数：**
- `keyword`: 搜索关键词
- `limit`: 返回数量限制

### 2. 市场情绪接口

#### 2.1 获取市场情绪指标

```http
GET /market/sentiment
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| date | string | 否 | 今日 | 日期 |
| includeShenzhenShanghai | boolean | 否 | true | 包含深沪两市 |
| includeChiNext | boolean | 否 | true | 包含创业板 |
| includeStar | boolean | 否 | true | 包含科创板 |
| includeBSE | boolean | 否 | true | 包含北证 |

**响应示例：**

```json
{
  "success": true,
  "data": {
    "date": "2024-01-01T00:00:00.000Z",
    "totalVolume": 8500.5,
    "volumeChange": 250.3,
    "maxLimitUpCount": 5,
    "maxLimitUpCountIn4Weeks": 7,
    "limitUpCount": 120,
    "limitUpCountChange": 15,
    "limitUpSealRate": 78.5,
    "limitUpSealRateChange": 5.2,
    "limitDownCount": 8,
    "limitDownCountChange": -3,
    "limitDownSealRate": 62.5,
    "limitDownSealRateChange": -8.1,
    "consecutiveLimitUpRate": 65.4,
    "brokenLimitUpRecoveryRate": 42.3
  }
}
```

#### 2.2 获取市场情绪历史趋势

```http
GET /market/sentiment/trend
```

#### 2.3 获取市场统计概览

```http
GET /market/overview
```

### 3. 自选股接口

#### 3.1 获取用户自选股列表

```http
GET /favorites
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| userId | string | 是 | - | 用户ID |
| date | string | 否 | 今日 | 日期 |
| groupBySector | boolean | 否 | false | 是否按题材分组 |
| sortBy | string | 否 | sortOrder | 排序字段 |
| sortOrder | string | 否 | asc | 排序方向 |

#### 3.2 添加自选股

```http
POST /favorites
```

**请求体：**

```json
{
  "userId": "default_user",
  "date": "2024-01-01",
  "stockId": "stock_000001_20240101",
  "stockCode": "000001",
  "stockName": "平安银行"
}
```

#### 3.3 移除自选股

```http
DELETE /favorites/:stockCode
```

**查询参数：**
- `userId`: 用户ID
- `date`: 日期

#### 3.4 更新自选股排序

```http
PUT /favorites/order
```

**请求体：**

```json
{
  "userId": "default_user",
  "date": "2024-01-01",
  "stockOrder": [
    {
      "stockCode": "000001",
      "sortOrder": 1
    },
    {
      "stockCode": "000002",
      "sortOrder": 2
    }
  ]
}
```

#### 3.5 检查股票是否在自选列表中

```http
GET /favorites/check/:stockCode
```

### 4. 健康检查

```http
GET /health
```

**响应示例：**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "message": "错误描述",
  "errors": [
    {
      "field": "字段名",
      "message": "错误信息",
      "value": "错误值"
    }
  ]
}
```

### 常见错误码

- `400` - 请求参数错误
- `404` - 资源不存在
- `500` - 服务器内部错误

## 数据模型

### Stock（股票）

```javascript
{
  code: String,           // 股票代码
  name: String,           // 股票名称
  market: String,         // 所属市场
  price: Number,          // 当前价格
  changePercent: Number,  // 涨跌幅
  limitUpTime: Date,      // 涨停时间
  consecutiveLimitUps: Number, // 连板数
  reason: String,         // 涨停原因
  sector: String,         // 所属题材
  circulatingMarketCap: Number, // 流通市值
  sealAmount: Number,     // 封单金额
  sealRatio: Number,      // 封成比
  flowRatio: Number,      // 封流比
  maxHistoryLimitUps: Number, // 历史最高连板
  turnover: Number,       // 成交额
  turnoverRate: Number,   // 换手率
  pe: Number,            // 市盈率
  riskFlags: [String],   // 风险标识
  date: Date,            // 数据日期
  createdAt: Date,       // 创建时间
  updatedAt: Date        // 更新时间
}
```

### MarketSentiment（市场情绪）

```javascript
{
  date: Date,                    // 日期
  marketFilter: Object,          // 市场筛选条件
  totalVolume: Number,           // 总成交量
  volumeChange: Number,          // 成交量变化
  maxLimitUpCount: Number,       // 最高连板数
  maxLimitUpCountIn4Weeks: Number, // 4周内最高连板数
  limitUpCount: Number,          // 涨停数
  limitUpCountChange: Number,    // 涨停数变化
  limitUpSealRate: Number,       // 涨停封板率
  limitUpSealRateChange: Number, // 涨停封板率变化
  limitDownCount: Number,        // 跌停数
  limitDownCountChange: Number,  // 跌停数变化
  limitDownSealRate: Number,     // 跌停封板率
  limitDownSealRateChange: Number, // 跌停封板率变化
  consecutiveLimitUpRate: Number, // 连板晋级率
  brokenLimitUpRecoveryRate: Number, // 断板次日修复率
  createdAt: Date,
  updatedAt: Date
}
```

### UserFavorite（用户自选股）

```javascript
{
  userId: String,        // 用户ID
  date: Date,           // 日期
  favoriteStocks: [{    // 自选股列表
    stockId: String,    // 股票ID
    stockCode: String,  // 股票代码
    stockName: String,  // 股票名称
    addedAt: Date,      // 添加时间
    sortOrder: Number   // 排序序号
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 开发说明

### 项目结构

```
Backend/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.js  # 数据库配置
│   ├── controllers/     # 控制器
│   │   ├── stockController.js
│   │   ├── marketController.js
│   │   └── favoriteController.js
│   ├── middleware/      # 中间件
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/          # 数据模型
│   │   ├── Stock.js
│   │   ├── MarketSentiment.js
│   │   ├── SectorInfo.js
│   │   └── UserFavorite.js
│   ├── routes/          # 路由
│   │   ├── stockRoutes.js
│   │   ├── marketRoutes.js
│   │   └── favoriteRoutes.js
│   └── app.js          # 主应用文件
├── .env.example        # 环境变量示例
├── package.json        # 项目配置
└── README.md          # 项目文档
```

### 数据接口预留

由于当前是演示版本，所有股票数据都是模拟数据。在实际部署时，需要：

1. **接入真实股票数据源**
   - 可以使用第三方股票数据API（如东方财富、新浪财经等）
   - 或者接入专业的金融数据服务商

2. **数据同步机制**
   - 建立定时任务，定期从数据源同步股票数据
   - 实现增量更新机制，提高数据同步效率

3. **缓存策略**
   - 对频繁查询的数据进行缓存
   - 使用 Redis 等缓存工具提高响应速度

4. **数据验证**
   - 对接入的外部数据进行验证和清洗
   - 确保数据的准确性和一致性

## 部署说明

### 生产环境部署

1. **环境准备**
   ```bash
   # 安装 PM2
   npm install -g pm2
   
   # 启动应用
   pm2 start src/app.js --name wudao-backend
   ```

2. **Nginx 配置**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api/ {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **MongoDB 配置**
   - 确保 MongoDB 服务正常运行
   - 配置数据库用户权限
   - 设置数据备份策略

## 许可证

MIT License