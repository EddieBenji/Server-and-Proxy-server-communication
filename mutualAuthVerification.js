const mutualAuthVerification = (req, res, next) => {
  // Configure Express to require clients to authenticate with a certificate issued by your CA
  if (!req.client.authorized) {
    return res.status(401).send('Invalid client certificate authentication.');
  }
  next();
};

module.exports = mutualAuthVerification;