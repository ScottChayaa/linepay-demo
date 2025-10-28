const logger = require('@/helpers/Logger');

class TestController {
  
  index = async (req, res) => {
    const queryParams = req.query; // 從 URL 查詢字串取得參數

    logger.debug('Hello world.', {queryParams: queryParams});

    res.json({
      message: "Hello world.",
      queryParams: queryParams, // { name: 'John', age: '30' }
    });
  };

}

module.exports = new TestController();
