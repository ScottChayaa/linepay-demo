const express = require('express');
var TestController = require('@/controllers/TestController');
var IndexController = require('@/controllers/IndexController');

var router = express.Router();

// 測試
router.get('/test/hello', TestController.hello);

// 公開
router.get('/', IndexController.index);
router.get('/payments/request', IndexController.requestPayments);
router.get('/confirmUrl', IndexController.confirmUrl);
router.get('/payments', IndexController.searchPayments);

module.exports = router;
