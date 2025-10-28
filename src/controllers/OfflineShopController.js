const moment = require('moment');
const logger = require("@/helpers/Logger");
const LinePay = require("@/helpers/LinePay");
const config = require('@/configs/config');

const checkout_amount = 500; // 結帳金額

/**
 * LINE Pay 實體付款
 * 
 * https://developers-pay.line.me/zh/offline
 */
class OfflineShopController {

  /**
   * 實體付款, oneTimeKey 為必填 LINE Pay 用戶的我的條碼
   */
  pay = async (req, res) => {
    let oneTimeKey = req.query.oneTimeKey;
    console.log(oneTimeKey);

    let orderId = "order" + moment().format("YYYYMMDDHHmmss");

    var response = await LinePay.requestOffline({
      method: "POST",
      apiPath: "/v2/payments/oneTimeKeys/pay",
      queryString: "",
      data: {
        amount: checkout_amount,
        currency: "TWD",
        orderId: orderId,
        productName: "買不起的iphone17",
        oneTimeKey: oneTimeKey, 
      },
      
      signal: AbortSignal.timeout(20000), // Read逾時設定
    });

    logger.debug(response);

    var result_json = await response.json();
    logger.debug(result_json);
    
    res.json(result_json);
  };

  // 確認付款請求狀態
  getPayRequestStatus = async (req, res) => {
    let orderId = req.query.orderId;

    var response = await LinePay.requestOffline({
      method: "POST",
      apiPath: `/v2/payments/orders/${orderId}/check`, // (店家)請求付款授權
      data: {
        amount: orderAmount,
        currency: "TWD",
      },
    });
    
    logger.debug("Response: ", response);
    switch (response.info.status) {
      case "AUTH_READY":
        logger.debug("In progress");
        break;
      case "COMPLETE":
        logger.debug("Finished");
        // Do something
      case "CANCEL":
        logger.debug("Cancelled");
        // Do something
      case "FAIL":
        logger.debug("Failed");
        // Do something
        // ...
      default:
        // TODO:
    }

    logger.debug(response);

    var result_json = await response.json();
    logger.debug(result_json);
    
    res.json(result_json);
  };
}

module.exports = new OfflineShopController();
