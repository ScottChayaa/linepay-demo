require("dotenv").config();
const crypto = require("crypto");
const moment = require('moment');

const baseUrl = "https://sandbox-api-pay.line.me";
const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID || "";
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "";

function signKey(clientKey, msg) {
  const encoder = new TextEncoder();
  return crypto.createHmac("sha256", encoder.encode(clientKey)).update(encoder.encode(msg)).digest("base64");
}

async function requestOnlineAPI({ method, apiPath, queryString = "", data = null, signal = null }) {
  const nonce = crypto.randomUUID();
  console.log(`nonce: ${nonce}`);
  let signature = "";

  // 根據不同方式(method)生成MAC
  if (method === "GET") {
    signature = signKey(LINE_CHANNEL_SECRET, LINE_CHANNEL_SECRET + apiPath + queryString + nonce);
    console.log(`GET sinature: ${signature}`);
  } else if (method === "POST") {
    signature = signKey(LINE_CHANNEL_SECRET, LINE_CHANNEL_SECRET + apiPath + JSON.stringify(data) + nonce);
    console.log(`POST sinature: ${signature}`);
  }
  const headers = {
    "X-LINE-ChannelId": LINE_CHANNEL_ID,
    "X-LINE-Authorization": signature,
    "X-LINE-Authorization-Nonce": nonce,
  };

  const response = await fetch(`${baseUrl}${apiPath}${queryString !== "" ? "&" + queryString : ""}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : null,
    signal: signal,
  });

  console.log(response);

  const processedResponse = await response.text();

  console.log(processedResponse);

  return response;
}

async function main() {
  var res = await requestOnlineAPI({
    method: "POST",
    apiPath: "/v3/payments/request",
    queryString: "",
    data: {
      amount: 500,
      currency: "TWD",
      orderId: "order" + moment().format('YYYYMMDDHHmmss'),
      packages: [
        {
          id: moment().format('YYYYMMDDHHmmss'),
          amount: 500,
          products: [
            {
              name: "買不起的iphone17",
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

}

main();
