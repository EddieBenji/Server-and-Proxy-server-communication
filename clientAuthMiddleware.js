const clientAuthMiddleware = () => (req, res, next) => {
    // Configure Express to require clients to authenticate with a certificate issued by your CA
   if (!req.client.authorized) {
     return res.status(401).send('Invalid client certificate authentication.');
   }
  
   // Examine the cert itself, and even validate based on that!
   var cert = req.socket.getPeerCertificate();
   if (cert.subject) {
     console.log('Client Certificate Common Name: '+cert.subject.CN);
     console.log('Client Certificate Location: '+cert.subject.L);
     console.log('Client Certificate Organization Name: '+cert.subject.O);
     console.log('Client Certificate Email Address: '+cert.subject.emailAddress);
   }
  
   return next();
};

module.exports = clientAuthMiddleware;