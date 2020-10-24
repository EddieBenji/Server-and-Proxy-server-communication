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
    console.log('Client Certificate Common Name: '+cert.subject.CN);
    console.log('Client Certificate Location: '+cert.subject.L);
    console.log('Client Certificate Organization Name: '+cert.subject.O);
    console.log('Client Certificate Email Address: '+cert.subject.emailAddress);
  }
  
    res.send({msg: 'Hello World, Eduardo here on the dummy server!'})
});



module.exports = app;
