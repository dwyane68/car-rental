const jwt = require('./libs/jwt');

const { INVALID_AUTH_TOKEN, NO_AUTH_TOKEN } = require('./config/errorCodes');

module.exports = (req, res, next) => {
  const auth = req.header('authorization');
  if (auth) {
    const header = auth.split(' ');
    const token = header[1];
    jwt.verifyToken(token, (err, decoded) => {
      if(!err){
        req.userId = decoded.id;
        req.businessId = decoded.businessId;
        next();
      }else{
        res.status(401).send(INVALID_AUTH_TOKEN);
      }
    })

  } else {
    res.status(401).send(NO_AUTH_TOKEN);
  }
};
