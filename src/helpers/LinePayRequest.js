const crypto = require("crypto");

const logger = require('@/helpers/Logger');
const config = require('@/configs/config');

var LINE_PAY_BASE_URL = config.LINE_PAY_BASE_URL;
var LINE_CHANNEL_ID = config.LINE_CHANNEL_ID;
var LINE_CHANNEL_SECRET = config.LINE_CHANNEL_SECRET;

function signKey(clientKey, msg) {
  const encoder = new TextEncoder();
  return crypto.createHmac("sha256", encoder.encode(clientKey)).update(encoder.encode(msg)).digest("base64");
}

async function LinePayRequest({ method, apiPath, queryString = "", data = null, signal = null }) {
  const nonce = crypto.randomUUID();
  logger.debug(`nonce: ${nonce}`);
  let signature = "";

  // 根據不同方式(method)生成MAC
  if (method === "GET") {
    signature = signKey(LINE_CHANNEL_SECRET, LINE_CHANNEL_SECRET + apiPath + queryString + nonce);
    logger.debug(`GET sinature: ${signature}`);
  } else if (method === "POST") {
    signature = signKey(LINE_CHANNEL_SECRET, LINE_CHANNEL_SECRET + apiPath + JSON.stringify(data) + nonce);
    logger.debug(`POST sinature: ${signature}`);
  }
  const headers = {
    "X-LINE-ChannelId": LINE_CHANNEL_ID,
    "X-LINE-Authorization": signature,
    "X-LINE-Authorization-Nonce": nonce,
  };

  const response = await fetch(`${LINE_PAY_BASE_URL}${apiPath}${queryString !== "" ? "&" + queryString : ""}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : null,
    signal: signal,
  });

  // console.log(response);

  // const processedResponse = await response.text();

  // console.log(processedResponse);

  return response;
}

module.exports = LinePayRequest;

