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

/*const tLSProxy = httpProxy.createProxyServer({
  ssl: {
    key: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/client-key'),
    cert: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/client-certificate'),
    //ca: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/cacert'),
    checkServerIdentity: () => {
      // This method doesn't remove the signature check, it only skip the check for the host to be the same as in the CN of the
      // cert. Refer to https://stackoverflow.com/q/50541317 for more info.
      return undefined;
    }
  },
  target: {
    https: true
    } 
});*/
const tLSProxy = httpProxy.createProxyServer({
  target: {
    protocol: 'https:',
    host: 'server.localhost',
    port: 9999,
    passphrase: 'capass',
    key: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/client-key'),
    cert: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/client-certificate'),
    ca: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/cacert')
    //ca: fs.readFileSync('/home/jpalomo/Documents/Tibco/Linux/Scripts/certs/generated/cacert')
  },
  changeOrigin: true,
});

tLSProxy.on('error', function(err, proxyReq, proxyRes){
    console.error('Proxy unable to serve request for a path : ' + proxyReq.url);
    console.error('Proxy error: ', err);
    
    tLSProxy.writeHead(500, { 'Content-Type': 'text/plain' });
    tLSProxy.write('An error happened at server. Please contact your administrator.');
    tLSProxy.end();
});

// Dummy route
app.get('/', function (req, res) {
    res.send({msg: 'Hello World, Eduardo here on the dummy proxy!'})
});
app.get('/proxy', function (req, res) {
  console.log('calling the proxy to call the server!');
  req.url = '/';
  tLSProxy.web(req, res);
  /*tLSProxy.web(req, res, { 
    ssl: {
      key: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/client-key'),
    cert: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/client-certificate'),
    ca: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/cacert'),
    },
    //target: 'server.localhost',
    //port: '9999'
    target: 'https://server.localhost:9999',
    //ca: fs.readFileSync('/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/cacert'),
    passphrase: 'capass'
  });*/
});

module.exports = app;
