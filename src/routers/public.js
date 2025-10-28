const express = require('express');
var TestController = require('@/controllers/TestController');
var OnlineShopController = require('@/controllers/OnlineShopController');

var router = express.Router();

// 測試
router.get('/test', TestController.index);

// 公開
router.get('/payments/request', OnlineShopController.requestPayments);
router.get('/confirmUrl', OnlineShopController.confirmUrl);
router.get('/payments', OnlineShopController.searchPayments);

module.exports = router;
