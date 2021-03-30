const bcrypt = require('bcrypt');
const jwt = require('../libs/jwt');
const Admin = require('../models/AdminModel');
const env = process.env.NODE_ENV || 'development';
const { buildResponse, invalidResponse, getDateDiffFromNow, validate } = require('../services/utils');

const {
  UNAUTHORISED,
  INCORRECT_PASSWORD,
  USER_NOT_FOUND,
  BCRYPT_ERROR,
} = require('../config/errorCodes');

const generateToken = (admin) => {

  let tokenData = {
    id: admin.id,
  };

  const token = jwt.generateShortToken(tokenData);

  return {
    token: token,
    admin: {
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      emailId: admin.emailId,
    }
  };
}

exports.register = (req, res, handleError) => {
  const sanitized = validate([
    ('phone' + '|' + req.body.phone + '|' + 'required,phone'),
    ('password' + '|' + req.body.password + '|' + 'required,min=8,max=24'),
    ('email' + '|' + req.body.email + '|' + 'required,email'),
    ('firstName' + '|' + req.body.firstName + '|' + 'required'),
    ('lastName' + '|' + req.body.lastName + '|' + 'required'),
  ]);

  if(sanitized.error){
    const { phone, password, email, firstName, lastName } = sanitized.error.msg;
    let msg = '';
    if(phone) {
      msg = 'Phone number is invalid';
    }
    if(password) {
      msg = 'Password number is invalid';
    }
    if(email) {
      msg = 'Email number is invalid';
    }
    if(firstName) {
      msg = 'First Name number is invalid';
    }
    if(lastName) {
      msg = 'Last Name number is invalid';
    }
    res.send(invalidResponse(msg));
    return;
  }

  const { phone, password, email, firstName, lastName } = sanitized.data;
  
  Admin.getDetails({emailId:email}).then((admin) => {
    if(admin){
      res.send(ADMIN_EXISTS);
      return;
    }

    const data = {
      firstName: firstName,
      lastName: lastName,
      emailId: email,
      phone: phone
    };

    bcrypt.hash(password, 10, (err, hash) => {
      if(!err){
        data.password = hash;
        Admin.create(data).then((admin) => {
          res.send(buildResponse({}, 'Registration Success!'));
        }, handleError);
      }else{
        res.send(BCRYPT_ERROR);
      }
    })
  }, handleError)
};

exports.login = (req, res, handleError) => {
  const sanitized = validate([
    ('email' + '|' + req.body.email + '|' + 'required,email'),
    ('password' + '|' + req.body.password + '|' + 'required,min=8,max=24'),
  ]);

  if(sanitized.error){
    res.send(invalidResponse(sanitized.error));
    return;
  }

  const { email, password } = sanitized.data;

  Admin.getDetails({emailId: email}).then((admin)=>{
    if(!admin){
      res.send(USER_NOT_FOUND);
      return;
    }
    bcrypt.compare(password, admin.password, (err, match) => {
      if(err){
        res.send(USER_NOT_FOUND); //BCRYPT ERROR
        return;
      }
      if(!match){
        res.send(INCORRECT_PASSWORD);
        return;
      }
      const payload = generateToken(admin);
      res.send(buildResponse(payload, 'Login Successful!'));
    });
  }, handleError);
};