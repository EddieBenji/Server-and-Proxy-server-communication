const fs = require('fs');
const https = require('https');
const Path = require('path');

const req = https.request(
  {
    hostname: 'localhost',
    port: 9999,
    path: '/',
    method: 'GET',
    key: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'client1-key.pem'))),
    cert: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'client1-crt.pem'))),
    //ca: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'nodejs-dummy-server', 'generated', 'cacert'))),
    ca: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'ca-crt.pem'))),
    // checkServerIdentity: () => {
    //     // This method doesn't remove the signature check, it only skip the check for the host to be the same as in the CN of the
    //     // cert. Refer to https://stackoverflow.com/q/50541317 for more info.
    //     return undefined;
    //   }
  },
  res => {
    res.on('data', function(data) {
      // do something with response
      console.log('Data: ', data.toString('utf8'))
    });
  }
);

req.end();