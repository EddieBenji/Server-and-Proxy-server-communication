// Libraries:
const express = require('express');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');
const fs = require('fs');

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
    key: fs.readFileSync('/secondary-disk/certs/nodejs-dummy-server/proxy_generated/server-key'),
    cert: fs.readFileSync('/secondary-disk/certs/nodejs-dummy-server/proxy_generated/server-certificate'),
    checkServerIdentity: () => {
      // This method doesn't remove the signature check, it only skip the check for the host to be the same as in the CN of the
      // cert. Refer to https://stackoverflow.com/q/50541317 for more info.
      return undefined;
    }
  },
  secure: true, // true/false, if you want to verify the SSL Certs OR, when we're not using self-signed certs. // SKIP_TLS... is false, then this should be true.
  xfwd: true,
  changeOrigin: true,
  preserveHeaderKeyCase: true,
  autoRewrite: true,
  target: {
    https: true
    } 
});

// Dummy route
app.get('/', function (req, res) {
    res.send({msg: 'Hello World, Eduardo here on the dummy proxy!'})
});
app.get('/proxy', function (req, res) {
  console.log('calling the proxy to call the server!');
  req.url = '/';
  tLSProxy.web(req, res, { 
    target: 'https://localhost:9999',
    ca: fs.readFileSync('/secondary-disk/certs/nodejs-dummy-server/generated/cacert'),
  });
});

module.exports = app;
