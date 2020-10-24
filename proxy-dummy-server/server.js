const app = require('./app');
const debug = require('debug')('dummy-server');
const https = require('https');
const fs = require('fs');
var Path = require('path');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
};

const port = normalizePort(process.env.PORT || '8888');
app.set('port', port);
const options = {
  // key: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'client1-key.pem'))), // We different files
  // cert: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'client1-crt.pem'))),
  // ca: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'ca-crt.pem'))),
  key: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'nodejs-dummy-server', 'proxy_generated', 'server-key'))),
  cert: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'nodejs-dummy-server', 'proxy_generated', 'server-certificate'))),
  ca: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'nodejs-dummy-server', 'generated', 'cacert'))),
  passphrase: 'eduardoOther',
  // checkServerIdentity: () => {
  //   // This method doesn't remove the signature check, it only skip the check for the host to be the same as in the CN of the
  //   // cert. Refer to https://stackoverflow.com/q/50541317 for more info.
  //   return undefined;
  // },
  rejectUnauthorized: true
};

const server = https.createServer(options, app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
