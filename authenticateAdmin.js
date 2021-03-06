const jwt = require('./libs/jwt');

const { INVALID_AUTH_TOKEN, NO_AUTH_TOKEN } = require('./config/errorCodes');

module.exports = (req, res, next) => {
  let auth = req.header('authorization');
  if(!auth){
    auth = req.query && `Bearer ${req.query.authorization}`;
  }
  if (auth) {
    const header = auth.split(' ');
    const token = header[1];
    jwt.verifyToken(token, (err, decoded) => {
      if(!err){
        req.adminId = decoded.adminId;
        next();
      }else{
        res.status(401).send(INVALID_AUTH_TOKEN);
      }
    })

  } else {
    res.status(401).send(NO_AUTH_TOKEN);
  }
};
