const winston = require('winston');
const moment = require('moment');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS'), // 自訂時間格式
    }),
    winston.format.printf(({ timestamp, level, message, ...rest }) => { // 自訂 JSON 格式輸出
      const logObject = {
        timestamp, // 放第一個
        level,
        message,
        ...rest, // 其他欄位
      };
      return JSON.stringify(logObject);
    })
    //winston.format.json() // 內建的 JSON 格式輸出
  ),
  transports: [
    new winston.transports.Console(), 
    //new winston.transports.File({ filename: 'logs/app.log' })
  ],
});

module.exports = logger;
