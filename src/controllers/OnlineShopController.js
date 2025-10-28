const moment = require('moment');
const logger = require("@/helpers/Logger");
const LinePay = require("@/helpers/LinePay");
const config = require('@/configs/config');

const checkout_amount = 500; // 結帳金額

/**
 * LINE Pay 線上付款
 * 
 * https://developers-pay.line.me/zh/online
 */
class OnlineShopController {
  /**
   * 步驟 1 + 2
   * 
   * 1) 付款請求步驟: 顧客購物車結帳, 店家發起付款請求給 LINE Server
   * 
   * 2) LINE Pay認證步驟: 在顧客終端機上顯示 LINE Pay，以便顧客可以進行 LINE Pay 認證
   * 
   */
  requestPayments = async (req, res) => {
    var response = await LinePay.requestOnline({
      method: "POST",
      apiPath: "/v3/payments/request",
      queryString: "",
      data: {
        amount: checkout_amount,
        currency: "TWD",
        orderId: "order" + moment().format("YYYYMMDDHHmmss"),
        packages: [
          {
            id: moment().format("YYYYMMDDHHmmss"),
            amount: checkout_amount,
            products: [
              {
                name: "買不起的iphone17",
                imageUrl:
                  "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-model-unselect-gallery-2-202509?wid=5120&hei=2880&fmt=webp&qlt=90&.v=dU9qRExIQUlQTzVKeDd1V1dtUE1MUWFRQXQ2R0JQTk5udUZxTkR3ZVlpTEVqWElVVkRpc1V5YU5kb3VzUVZndzBoUVhuTWlrY2hIK090ZGZZbk9HeEJWb1BiTjRORlc1Y1lKU3JWempySktQVFcxaWdDV1ZRTjhLQ2h5TEk5bUxmbW94YnYxc1YvNXZ4emJGL0IxNFp3&traceId=1",
                quantity: 1,
                price: 500,
              },
            ],
          },
        ],
        redirectUrls: {
          confirmUrl: `${config.HOST}/confirmUrl`,
          cancelUrl:  `${config.HOST}/cancelUrl`,
        },
      },
    });

    logger.debug(response);

    var result_json = await response.json();
    logger.debug(result_json);

    res.json(result_json);
  };

  /**
   * 步驟 3 + 4
   * 
   * 3) 付款授權步驟: 顧客完成 LINE Pay 認證後, 店家取得付款授權, 可執行接下來的請款或取消授權動作
   * 
   * 4) 請款步驟: 付款授權後, 需系統"自動"進行請款處理
   * 
   * 店家收到 LINE Server 付款授權 callback 後, 需再發 confirm 動作進行請款才算完成
   */
  confirmUrl = async (req, res) => {
    var transactionId = req.query.transactionId;
    var orderId = req.query.orderId;
    var orderAmount = await this.getOrderAmount(orderId); // 實務上, 會根據 orderId 查詢資料庫中的訂單金額

    var response_confirm = await LinePay.requestOnline({
      method: "POST",
      apiPath: `/v3/payments/${transactionId}/confirm`, // (店家)請求付款授權
      data: {
        amount: orderAmount,
        currency: "TWD",
      },
    });

    logger.debug(response_confirm);

    var result_json_confirm = await response_confirm.json();

    logger.debug(result_json_confirm);

    res.json(result_json_confirm);
  };

  searchPayments = async (req, res) => {
    var transactionId = req.query.transactionId;
    var orderId = req.query.orderId;

    var response = await LinePay.requestOnline({
      method: "GET",
      apiPath: `/v3/payments`, // 查詢付款明細
      queryString: `transactionId=${transactionId}&orderId=${orderId}`,
    });

    logger.debug(response);

    var result_json = await response.json();
    logger.debug(result_json);

    res.json(result_json);
  };

  getOrderAmount = async (orderId) => {
    // TODO: 查詢訂單金額
    return checkout_amount;
  }
}

module.exports = new OnlineShopController();
