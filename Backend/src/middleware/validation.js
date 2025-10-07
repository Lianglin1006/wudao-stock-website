const { body, query, param, validationResult } = require('express-validator');

// 验证结果处理中间件
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// 日期验证规则
const validateDate = (field = 'date') => {
  return query(field)
    .optional()
    .isISO8601()
    .withMessage('日期格式必须为 YYYY-MM-DD')
    .toDate();
};

// 股票代码验证规则
const validateStockCode = (field = 'stockCode') => {
  return param(field)
    .matches(/^[0-9]{6}$/)
    .withMessage('股票代码必须为6位数字');
};

// 分页验证规则
const validatePagination = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('页码必须为正整数')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('每页数量必须为1-1000之间的整数')
      .toInt()
  ];
};

// 价格区间验证规则
const validatePriceRange = () => {
  return [
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('最低价格必须为非负数')
      .toFloat(),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('最高价格必须为非负数')
      .toFloat()
  ];
};

// 市值区间验证规则
const validateMarketCapRange = () => {
  return [
    query('minMarketCap')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('最小市值必须为非负数')
      .toFloat(),
    query('maxMarketCap')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('最大市值必须为非负数')
      .toFloat()
  ];
};

// 市场筛选验证规则
const validateMarketFilter = () => {
  return [
    query('includeShenzhenShanghai')
      .optional()
      .isBoolean()
      .withMessage('深沪两市筛选必须为布尔值')
      .toBoolean(),
    query('includeChiNext')
      .optional()
      .isBoolean()
      .withMessage('创业板筛选必须为布尔值')
      .toBoolean(),
    query('includeStar')
      .optional()
      .isBoolean()
      .withMessage('科创板筛选必须为布尔值')
      .toBoolean(),
    query('includeBSE')
      .optional()
      .isBoolean()
      .withMessage('北证筛选必须为布尔值')
      .toBoolean(),
    query('excludeST')
      .optional()
      .isBoolean()
      .withMessage('排除ST筛选必须为布尔值')
      .toBoolean()
  ];
};

// 排序验证规则
const validateSort = () => {
  return [
    query('sortBy')
      .optional()
      .isIn(['limitUpTime', 'price', 'changePercent', 'consecutiveLimitUps', 'circulatingMarketCap', 'sealAmount', 'sealRatio', 'turnoverRate'])
      .withMessage('排序字段不合法'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('排序方向必须为 asc 或 desc')
  ];
};

// 涨停股票列表验证
const validateLimitUpStocksQuery = [
  validateDate(),
  ...validatePagination(),
  ...validatePriceRange(),
  ...validateMarketCapRange(),
  ...validateMarketFilter(),
  ...validateSort(),
  query('groupBySector')
    .optional()
    .isBoolean()
    .withMessage('按题材分组必须为布尔值')
    .toBoolean(),
  query('sector')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('题材名称长度必须为1-50个字符'),
  handleValidationErrors
];

// 股票详情验证
const validateStockDetail = [
  validateStockCode(),
  validateDate(),
  handleValidationErrors
];

// 添加自选股验证
const validateAddFavorite = [
  body('userId')
    .notEmpty()
    .withMessage('用户ID不能为空')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('用户ID长度必须为1-50个字符'),
  body('date')
    .notEmpty()
    .withMessage('日期不能为空')
    .isISO8601()
    .withMessage('日期格式必须为 YYYY-MM-DD')
    .toDate(),
  body('stockId')
    .notEmpty()
    .withMessage('股票ID不能为空')
    .isString()
    .trim(),
  body('stockCode')
    .notEmpty()
    .withMessage('股票代码不能为空')
    .matches(/^[0-9]{6}$/)
    .withMessage('股票代码必须为6位数字'),
  body('stockName')
    .notEmpty()
    .withMessage('股票名称不能为空')
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('股票名称长度必须为1-20个字符'),
  handleValidationErrors
];

// 更新自选股排序验证
const validateUpdateFavoriteOrder = [
  body('userId')
    .notEmpty()
    .withMessage('用户ID不能为空')
    .isString()
    .trim(),
  body('date')
    .notEmpty()
    .withMessage('日期不能为空')
    .isISO8601()
    .withMessage('日期格式必须为 YYYY-MM-DD')
    .toDate(),
  body('stockOrder')
    .isArray()
    .withMessage('股票排序必须为数组')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('股票排序数组不能为空');
      }
      for (const item of value) {
        if (!item.stockCode || !item.stockCode.match(/^[0-9]{6}$/)) {
          throw new Error('股票代码必须为6位数字');
        }
        if (typeof item.sortOrder !== 'number' || item.sortOrder < 0) {
          throw new Error('排序序号必须为非负整数');
        }
      }
      return true;
    }),
  handleValidationErrors
];

// 自选股查询验证
const validateFavoriteQuery = [
  query('userId')
    .notEmpty()
    .withMessage('用户ID不能为空')
    .isString()
    .trim(),
  validateDate(),
  query('groupBySector')
    .optional()
    .isBoolean()
    .withMessage('按题材分组必须为布尔值')
    .toBoolean(),
  ...validateSort(),
  handleValidationErrors
];

// 市场情绪查询验证
const validateMarketSentimentQuery = [
  validateDate(),
  ...validateMarketFilter(),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateDate,
  validateStockCode,
  validatePagination,
  validatePriceRange,
  validateMarketCapRange,
  validateMarketFilter,
  validateSort,
  validateLimitUpStocksQuery,
  validateStockDetail,
  validateAddFavorite,
  validateUpdateFavoriteOrder,
  validateFavoriteQuery,
  validateMarketSentimentQuery
};