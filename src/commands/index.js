require('module-alias/register');

const moment = require("moment");
const OfflinePay = require("@/commands/OfflinePay");
const logger = require("@/helpers/Logger");
const config = require("@/configs/config");

// Sandbox oneTimeKey generator :
// https://sandbox-web-pay.line.me/web/sandbox/payment/oneTimeKey?countryCode=TW&paymentMethod=card&preset=1&fbclid=IwY2xjawNtV7FleHRuA2FlbQIxMABicmlkETFNMmtOOW9JOVV0VjJwY1RrAR4qbY73aYNewlWSTaQczTMZOzHFSgVTu6dOS0b5LpG8T-HziWDcW22dAoeN2g_aem_jnoWzuKXcd7d79kQAHpelg
let oneTimeKey = "382186361440741302"; // 使用終端機收到的我的 LINE PAY 條碼訊息

async function main() {
  let orderId = "order" + moment().format("YYYYMMDDHHmmss");

  // 執行實體付款 > 完成後, 後台可以查到
  try {
    OfflinePay.pay(orderId, oneTimeKey);
  } catch (err) {
    logger.error("異常", { data: err });
    if (err.name === "TimeoutError") {
      // 每隔1秒檢查付款請求狀態
      intervalId = setInterval(OfflinePay.getPayRequestStatus(orderId), 1000);
    } else {
      // 其他異常處理
      logger.error("其他異常處理...");
    }
  }
}

main();
