require('dotenv').config();
const express = require('express');
const app = express();
const requestOnlineAPI = require('./requestOnlineAPI');
const moment = require('moment');

// 從 .env 讀取 PORT，若無設定則使用預設值 4000
const PORT = process.env.PORT || 4000;

// Middleware：解析 JSON body
app.use(express.json());

// GET 範例：處理 URL params 和 query params
// 測試範例：GET http://localhost:4000/api/users/123?name=John&age=30
app.get('/api/users/:id', (req, res) => {
  // URL params：從路由中取得參數
  const urlParams = req.params;

  // Query params：從 URL 查詢字串取得參數
  const queryParams = req.query;

  res.json({
    message: 'GET request received',
    urlParams: urlParams,        // { id: '123' }
    queryParams: queryParams,    // { name: 'John', age: '30' }
    example: {
      id: urlParams.id,
      name: queryParams.name,
      age: queryParams.age
    }
  });
});

// POST 範例：處理 body 參數
// 測試範例：POST http://localhost:4000/api/users
// Body (JSON): { "name": "John", "email": "john@example.com", "age": 30 }
app.post('/api/users', (req, res) => {
  // 從 request body 取得參數
  const bodyParams = req.body;

  res.json({
    message: 'POST request received',
    receivedData: bodyParams,
    created: {
      name: bodyParams.name,
      email: bodyParams.email,
      age: bodyParams.age,
      timestamp: new Date().toISOString()
    }
  });
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'Express Server is running!'
  });
});

const checkout_amount = 500;

// [顧客] 選好商品, 購物車結帳
// ...

// [店家] 付款請求 : 購物車結帳
app.get('/checkout', async (req, res) => {
  var response = await requestOnlineAPI({
    method: "POST",
    apiPath: "/v3/payments/request",
    queryString: "",
    data: {
      amount: checkout_amount,
      currency: "TWD",
      orderId: "order" + moment().format('YYYYMMDDHHmmss'),
      packages: [
        {
          id: moment().format('YYYYMMDDHHmmss'),
          amount: checkout_amount,
          products: [
            {
              name: "買不起的iphone17",
              imageUrl: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-model-unselect-gallery-2-202509?wid=5120&hei=2880&fmt=webp&qlt=90&.v=dU9qRExIQUlQTzVKeDd1V1dtUE1MUWFRQXQ2R0JQTk5udUZxTkR3ZVlpTEVqWElVVkRpc1V5YU5kb3VzUVZndzBoUVhuTWlrY2hIK090ZGZZbk9HeEJWb1BiTjRORlc1Y1lKU3JWempySktQVFcxaWdDV1ZRTjhLQ2h5TEk5bUxmbW94YnYxc1YvNXZ4emJGL0IxNFp3&traceId=1",
              quantity: 1,
              price: 500,
            },
          ],
        },
      ],
      redirectUrls: {
        confirmUrl: "https://8e736eedbd67.ngrok-free.app/confirmUrl",
        cancelUrl: "https://8e736eedbd67.ngrok-free.app/cancelUrl",
      }
    }
  });

  console.log(response);

  var result_json = await response.json();
  console.log(result_json);

  res.json(result_json);
});


app.get('/confirmUrl', async (req, res) => {
  var transactionId = req.query.transactionId;

  var response_confirm = await requestOnlineAPI({
    method: "POST",
    apiPath: `/v3/payments/${transactionId}/confirm`, // (店家)請求付款授權
    data: {
      amount: checkout_amount,
      currency: "TWD",
    }
  });

  console.log(response_confirm);

  var result_json_confirm = await response_confirm.json();
  console.log(result_json_confirm);

  // LINE Sanbox 會做自動請款
  // console.log("---");
  // await sleep(3000);

  // var response_capture = await requestOnlineAPI({
  //   method: "POST",
  //   apiPath: `/v3/payments/authorizations/${transactionId}/capture`, // (店家)請款
  //   data: {
  //     amount: checkout_amount, // 註: 請款金額可能與呼叫請求付款API時輸入的付款金額不同。
  //     currency: "TWD",
  //   }
  // });

  // console.log(response_capture);

  // var result_json_capture = await response_capture.json();
  // console.log(result_json_capture);

  res.json({
    result_json_confirm: result_json_confirm,
    // result_json_capture: result_json_capture
  });
});

app.get('/payments', async (req, res) => {
  var transactionId = req.query.transactionId;
  var orderId = req.query.orderId;

  var response = await requestOnlineAPI({
    method: "GET",
    apiPath: `/v3/payments`, // 查詢付款明細
    queryString: `transactionId=${transactionId}&orderId=${orderId}`
  });

  console.log(response);

  var result_json = await response.json();
  console.log(result_json);

  res.json(result_json);
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
