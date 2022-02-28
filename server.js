const http = require('http');

const config = require('./config');

const API_ENV = config.API_ENV;
const headers = config.headers;

const requestListener = (req, res) => {
  if(req.url === API_ENV && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write('index');
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write('page not found!');
    res.end();
  };
};

const server = http.createServer(requestListener);
server.listen(8080);