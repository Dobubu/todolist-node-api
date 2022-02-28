const config = require('../config');

const headers = config.headers;

const errorHandle = (res, error) => {
  const errorMsg = error.message || 'parse error.';

  res.writeHead(400, headers);
  res.write(JSON.stringify({
    'status': 'false',
    'message': errorMsg
  }));
  res.end();
};

module.exports = errorHandle;