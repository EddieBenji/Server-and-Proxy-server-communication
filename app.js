// Libraries:
const express = require('express');
const bodyParser = require('body-parser');

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


const clientAuthMiddleware = (req, res, next) => {
    console.error(req.client.authorized);
    if (!req.client.authorized) {
        return res.status(401).send({ msg: 'Invalid client certificate authentication.' });
    }
    return next();
};
app.use(clientAuthMiddleware);

// Dummy route
app.get('/', function (req, res) {
    res.send({msg: 'Hello World, Eduardo here on the dummy server!'})
});



module.exports = app;
