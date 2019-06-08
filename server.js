const http = require('http');
const fs = require('fs');

const uuid = () =>
  Math.random()
      .toString(36)
      .slice(2);

const hostname = '127.0.0.1';
const port = 3000;

const readData = (path) =>
  new Promise((resolve, reject) =>
    fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)))
  );

const routes = {
  'html': function(req, res) {
    readData(`${__dirname}/html${req.url}`)
        .then((data) => {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
        })
        .catch(() => {
          readData(`${__dirname}/html/nopage.html`)
              .then((data) => {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(data);
              })
              .catch((err) => console.log(err));
        });
  },
  'css': function(req, res) {
    readData(`${__dirname}/css${req.url}`)
        .then((data) => {
          res.writeHead(200, {'Content-Type': 'text/css'});
          res.end(data);
        })
        .catch((err) => console.log(err));
  },
  'js': function(req, res) {
    readData(`${__dirname}/js${req.url}`)
        .then((data) => {
          res.writeHead(200, {'Content-Type': 'text/js'});
          res.end(data);
        })
        .catch((err) => console.log(err));
  },
  'files': function(req, res) {
    readData(`${__dirname}${req.url}.txt`)
        .then((data) => {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(data);
        })
        .catch((err) => {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end('404 File not found!');
        });
  },
  'uploadfile': (req, res) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk.toString()));
    req.on('end', () => {
      const id = uuid();
      fs.writeFile(`${__dirname}/files/${id}.txt`, data, (err) => {
        if (err) {
          res.writeHead(449, {'Content-Type': 'text/plain'});
          res.end(err);
          return;
        }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(id);
      });
    });
  },
  '/': function(req, res) {
    readData(`${__dirname}/html/index.html`).then((data) => {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  },
  'default': function(req, res) {
    readData(`${__dirname}/html${req.url}.html`)
        .then((data) => {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
        })
        .catch(() => {
          readData(`${__dirname}/html/nopage.html`)
              .then((data) => {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(data);
              })
              .catch((err) => console.log(err));
        });
  },
};

const routing = (req, res) => {
  let route =
    `${req.url
        .split('/')[1]
        .split('.')
        .pop()}` !== ''
      ? `${req.url
          .split('/')[1]
          .split('.')
          .pop()}`
      : '/';
  route = route in routes ? route : 'default';
  routes[route](req, res);
};

const server = http.createServer((req, res) => {
  routing(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server is on ${hostname}:${port}`);
});
