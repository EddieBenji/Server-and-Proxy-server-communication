// Libraries:
const express = require('express');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');
const fs = require('fs');
var Path = require('path');

//initialize the app:
const app = express();
// with this, we parse the body always as json.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// This will avoid the CORS issue;
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

const tLSProxy = httpProxy.createProxyServer({
  target: {
    protocol: 'https:',
    host: 'localhost',
    port: 9999,
    key: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'client1-key.pem'))),
    cert: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'client1-crt.pem'))),
    ca: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'ca-crt.pem'))),
  },
  secure: true,
  changeOrigin: true,
  // xfwd: true,
  // changeOrigin: true,
  // preserveHeaderKeyCase: true,
  // autoRewrite: true
});

// Dummy route
app.get('/', function (req, res) {
    res.send({msg: 'Hello World, Eduardo here on the dummy proxy!'})
});
app.get('/proxy', function (req, res) {
  console.log('calling the proxy to call the server!');
  req.url = '/';
  tLSProxy.web(req, res);
});

module.exports = app;
