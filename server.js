const http = require('http');
const { v4: uuidv4 } = require('uuid');

const config = require('./config');
const errorHandle = require('./lib/errorHandle');

const API_ENV = config.API_ENV;
const headers = config.headers;

let todos = [];

const requestListener = (req, res) => {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk;
  });

  if(req.url === API_ENV && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': todos
    }));
    res.end();
  } else if(req.url === API_ENV && req.method === 'POST') {
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        if(!data.title) throw new Error('title field is require.');

        const payload = {
          ...data,
          id: uuidv4()
        };
        todos = [...todos, payload];
  
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          'status': 'success',
          'data': todos
        }));
        res.end();
      } catch (e) {
        errorHandle(res, e);
      }
    });
  } else if(req.url === API_ENV && req.method === 'DELETE') {
    todos = [];

    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': todos
    }));
    res.end();
  } else if(req.url.startsWith('/todos/') && req.method === 'DELETE') {
    try {
      const id = req.url.split('/').pop();
      const isExist = todos.find(o => o.id === id);

      if(!isExist) throw new Error('todo not exist.');

      todos = todos.filter(o => o.id !== id);

      res.writeHead(200, headers);
      res.write(JSON.stringify({
        'status': 'success',
        'data': todos
      }));
      res.end();
    } catch (e) {
      errorHandle(res, e);
    }
  } else if(req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const title = data.title;
        if(!title) throw new Error('title field is require.');

        const id = req.url.split('/').pop();
        const isExist = todos.find(o => o.id === id);
  
        if(!isExist) throw new Error('todo not exist.');
  
        const i = todos.findIndex(o => o.id === id);
        todos[i].title = title;
  
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          'status': 'success',
          'data': todos
        }));
        res.end();
      } catch (e) {
        errorHandle(res, e);
      }
    });
  } else if(req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      'status': 'false',
      'message': 'page not found!'
    }));
    res.end();
  };
};

const server = http.createServer(requestListener);
server.listen(8080);