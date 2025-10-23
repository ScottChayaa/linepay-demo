require('dotenv').config();

var config = {
  /**
   * 應用程式端口
   */
  PORT: process.env.PORT ?? '',

  /**
   * 應用程式名稱
   */
  APP_NAME: process.env.APP_NAME ?? '',

  /**
   * 目前環境: dev, test, prod
   */
  STAGE: process.env.STAGE ?? '',

  /**
   * 系統環境前綴詞
   */
  APP_PREFIX: `${process.env.APP_NAME}-${process.env.STAGE}`,

  /**
   * JWT 加密字串
   */
  JWT_SECRET: process.env.JWT_SECRET,

  /**
   * JWT Token 時效
   */
  JWT_EXPIRESIN: `2 days`,

  /**
   * 預設分頁數量
   */
  DEFAULT_LIMIT: 3,

  /**
   * 統一編號
   */
  COMPANY_ID: process.env.COMPANY_ID ?? '',

  /**
   * LINE CHANNEL_ID
   */
  LINE_CHANNEL_ID: process.env.LINE_CHANNEL_ID ?? '',

  /**
   * LINE CHANNEL_SECRET
   */
  LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET ?? '',

  LINE_PAY_BASE_URL: 'https://sandbox-api-pay.line.me',
};

module.exports = config;
