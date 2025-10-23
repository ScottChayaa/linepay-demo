/**
 * 錯誤訊息代碼
 */
const error_codes = {
  901: '查無資料',
  902: '帳號已存在',

  920: '參數錯誤',
};

class ErrorCode {
  GetMessage = (code) => {
    return error_codes[code] ?? 'Undefine Error';
  }
}

module.exports = new ErrorCode();