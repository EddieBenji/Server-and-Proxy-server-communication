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
    key: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'client1-key.pem'))),
    cert: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'client1-crt.pem'))),
    ca: fs.readFileSync(Path.normalize(Path.join(__dirname, '..', 'Mutual', 'ca-crt.pem'))),
    //passphrase: 'eduardoOther',
    rejectUnauthorized: true
};

const server = https.createServer(options, app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
