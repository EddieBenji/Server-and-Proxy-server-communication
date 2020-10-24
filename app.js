// Libraries:
const express = require('express');
const bodyParser = require('body-parser');
const mutualAuthVerification = require('./mutualAuthVerification');

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

app.use(mutualAuthVerification);

// Dummy route
app.get('/', function (req, res) {
    // Examine the cert itself, and even validate based on that!
  var cert = req.socket.getPeerCertificate();
  if (cert.subject) {
    console.log('Subject: ', JSON.stringify(cert.subject, undefined, 2));
    console.log('Issuer: ',JSON.stringify(cert.issuer, undefined, 2));
  }
  
    res.send({msg: 'Hello World, Eduardo here on the dummy server!'})
});



module.exports = app;
