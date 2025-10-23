const moment = require('moment');
const logger = require("@/helpers/Logger");
const LinePayRequest = require("@/helpers/LinePayRequest");
const checkout_amount = 500;

class IndexController {
  index = async (req, res) => {
    const queryParams = req.query; // 從 URL 查詢字串取得參數

    res.json({
      message: "index",
      queryParams: queryParams, // { name: 'John', age: '30' }
    });
  };

  /**
   * 顧客購物車結帳
   * 店家發起付款請求給 LINE Server
   */
  requestPayments = async (req, res) => {
    var response = await LinePayRequest({
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
          confirmUrl: "https://8e736eedbd67.ngrok-free.app/confirmUrl",
          cancelUrl: "https://8e736eedbd67.ngrok-free.app/cancelUrl",
        },
      },
    });

    logger.debug(response);

    var result_json = await response.json();
    logger.debug(result_json);

    res.json(result_json);
  };

  /**
   * 店家收到 LINE Server 付款callback
   */
  confirmUrl = async (req, res) => {
    var transactionId = req.query.transactionId;

    var response_confirm = await requestOnlineAPI({
      method: "POST",
      apiPath: `/v3/payments/${transactionId}/confirm`, // (店家)請求付款授權
      data: {
        amount: checkout_amount,
        currency: "TWD",
      },
    });

    logger.debug(response_confirm);

    var result_json_confirm = await response_confirm.json();

    logger.debug(result_json_confirm);

    res.json(result_json_confirm);
  };

  confirmUrl = async (req, res) => {
    var transactionId = req.query.transactionId;
    var orderId = req.query.orderId;

    var response = await requestOnlineAPI({
      method: "GET",
      apiPath: `/v3/payments`, // 查詢付款明細
      queryString: `transactionId=${transactionId}&orderId=${orderId}`,
    });

    console.log(response);

    var result_json = await response.json();
    console.log(result_json);

    res.json(result_json);
  };
}

module.exports = new IndexController();
