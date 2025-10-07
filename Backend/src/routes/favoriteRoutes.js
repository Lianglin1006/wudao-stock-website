const express = require('express');
const router = express.Router();
const {
  getFavoriteStocks,
  addFavoriteStock,
  removeFavoriteStock,
  updateFavoriteStockOrder,
  checkFavoriteStock
} = require('../controllers/favoriteController');
const {
  validateFavoriteQuery,
  validateAddFavorite,
  validateUpdateFavoriteOrder,
  validateStockCode,
  handleValidationErrors
} = require('../middleware/validation');

// 获取用户自选股列表
// GET /api/v1/favorites?userId=default_user&date=2024-01-01&groupBySector=false
router.get('/', validateFavoriteQuery, getFavoriteStocks);

// 添加自选股
// POST /api/v1/favorites
// Body: { userId, date, stockId, stockCode, stockName }
router.post('/', validateAddFavorite, addFavoriteStock);

// 移除自选股
// DELETE /api/v1/favorites/:stockCode?userId=default_user&date=2024-01-01
router.delete('/:stockCode', [
  validateStockCode(),
  validateFavoriteQuery,
  handleValidationErrors
], removeFavoriteStock);

// 更新自选股排序
// PUT /api/v1/favorites/order
// Body: { userId, date, stockOrder: [{ stockCode, sortOrder }] }
router.put('/order', validateUpdateFavoriteOrder, updateFavoriteStockOrder);

// 检查股票是否在自选列表中
// GET /api/v1/favorites/check/:stockCode?userId=default_user&date=2024-01-01
router.get('/check/:stockCode', [
  validateStockCode(),
  validateFavoriteQuery,
  handleValidationErrors
], checkFavoriteStock);

module.exports = router;