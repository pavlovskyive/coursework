const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const uuid = () =>
  Math.random()
      .toString(36)
      .slice(2);

const sendFile = (data, type, res, code = 200) => {
  res.writeHead(code, {'Content-Type': type});
  res.end(data);
};

const sendErrorFile = (res) => {
  fs.promises
      .readFile(`${__dirname}/html/nopage.html`)
      .then((data) => sendFile(data, 'text/html', res, 404));
};

const mimes = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  ico: 'image/x-icon',
  txt: 'text/plain',
};

// const readData = promisify(fs.readFile);

// const promisify = (fn) => (...args) => {
//   return new Promise((resolve, reject) =>
//     fn(...args, (err, data) => (err ? reject(err) : resolve(data)))
//   );
// };

const routes = {
  '/': (req, res) => {
    fs.promises
        .readFile(`${__dirname}/html/index.html`)
        .then((data) => sendFile(data, 'text/html', res));
  },
  '/uploadFile': (req, res) => {
    let data = '';
    const id = uuid();
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      fs.promises
          .writeFile(`${__dirname}/files/${id}.txt`, data)
          .then(() => {
            res.statusCode = 200;
            res.statusMessage = id;
            res.end();
          })
          .catch(() => {
            res.statusCode = 500;
            res.statusMessage =
            'Something wrong on server, there might be data loss';
            res.end();
          });
    });
  },
  'default': (req, res) => {
    fs.promises
        .readFile(`${__dirname}${req.url}`)
        .then((data) => sendFile(data, mimes[req.url.split('.').pop()], res))
        .catch(() => {
          sendErrorFile(res);
        });
  },
};

const server = http.createServer((req, res) => {
  routes[req.url in routes ? req.url : 'default'](req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server is on ${hostname}:${port}`);
});
