require('dotenv').config();
const express = require('express');
const app = express();

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


app.get('/confirmUrl', (req, res) => {
  const queryParams = req.query;

  res.json(queryParams);
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
