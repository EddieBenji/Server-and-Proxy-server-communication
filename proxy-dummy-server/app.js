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
  ssl: {
    checkServerIdentity: () => {
      // This method doesn't remove the signature check, it only skip the check for the host to be the same as in the CN of the
      // cert. Refer to https://stackoverflow.com/q/50541317 for more info.
      return undefined;
    }
  },
  xfwd: true,
  secure: true,
  changeOrigin: true,
  preserveHeaderKeyCase:true,
  autoRewrite: true,
});

tLSProxy.on('error', (err, proxyReq, proxyRes) => {
  console.error(err);
  proxyRes.writeHead(500, { 'Content-Type': 'text/plain' });
  proxyRes.write('An error happened at server. Please contact your administrator.');
  proxyRes.end();
});

// Dummy route
app.get('/', function (req, res) {
    res.send({msg: 'Hello World, Eduardo here on the dummy proxy!'})
});
app.get('/proxy', function (req, res) {
  console.log('calling the proxy to call the server!');
  req.url = '/';
  tLSProxy.web(req, res, {
    target: {
      https: true,
      protocol: 'https:',
      host: 'localhost',
      port: 9999,
      key: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'nodejs-dummy-server', 'redtail-build', 'webapp-client-key'))), // TLS_CLIENT_KEY_FILE
      cert: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'nodejs-dummy-server', 'redtail-build', 'webapp-client-certificate'))), // TLS_CLIENT_CERT_FILE
      ca: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'nodejs-dummy-server', 'redtail-build', 'cacert'))), // GRAFANA_TLS_CACERT_FILE
      passphrase: 'changeit', // TLS_CLIENT_KEY_PASSWORD
    },
  });
});

module.exports = app;
