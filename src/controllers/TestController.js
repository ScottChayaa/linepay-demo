const logger = require('@/helpers/Logger');

class TestController {
  
  hello = async (req, res) => {
    res.json({ message: 'Hello world' });
  };

}

module.exports = new TestController();
