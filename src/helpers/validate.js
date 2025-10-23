/**
 * node-input-validator
 * https://github.com/bitnbytesio/node-input-validator
 */
const niv = require('node-input-validator');
const ValidationError = require('@/errors/ValidationError');

/**
 * 擴充: 判斷偶數
 */
niv.extend('even', ({ value }) => {
  if (parseInt(value) % 2 == 0) {
    return true;
  }
  return false;
});

/**
 * 範例可參考 test_validate.js
 */
async function validate(req, rules, messages = {}, nicknames = {}) {
  let input;

  // 簡化傳入 express request
  if (req.query != undefined || req.body != undefined) {
    input = Object.assign(req.query, req.body); // 將 query 和 body 合併成一個 input 物件
  } else {
    input = req;
  }

  let v = new niv.Validator(input, rules);
  niv.extendMessages(messages);

  v.niceNames(nicknames);

  if (!(await v.check())) {
    throw new ValidationError(v.errors);
  }
}

module.exports = validate;