const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('../libs/jwt');
const User = require('../models/UserModel');
const uuid = require('uuid');
const fs = require('fs');
const upload = require('../services/upload');

const env = process.env.NODE_ENV || 'development';
const { buildResponse, invalidResponse, getDateDiffFromNow, validate } = require('../services/utils');

const {
  UNAUTHORISED,
  INCORRECT_PASSWORD,
  INCORRECT_OLD_PASSWORD,
  USER_EXISTS,
  USER_NOT_FOUND,
  PENDING_VERIFICATION,
  BCRYPT_ERROR,
} = require('../config/errorCodes');


const generateToken = async (user) => {

  let tokenData = {
    id: user.id
  };
  const token = jwt.generateToken(tokenData);
  
  return {
    token: token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      emailId: user.emailId
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
    const { phone, password, email, firstName, lastName  } = sanitized.error;
    let msg = '';
    if(phone) {
      msg = 'Phone number is invalid';
    }
    if(password) {
      msg = 'Password number is invalid';
    }
    if(email) {
      msg = 'Email is invalid';
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

  const { phone, password, email, firstName, lastName  } = sanitized.data;

  User.getByEmail(email).then((user)=>{
    if(!user){
      bcrypt.hash(password, 10, (err, hash) => {
        if(!err){
          User.create({
            emailId: email,
            phone,
            firstName,
            lastName,
            password: hash, 
            licenseId: req.body.licenseId
          }).then((user) => {
            const token = jwt.generateToken({id: user.id});
            const payload = {
              token: token,
              user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                emailId: user.emailId,
                licenseId: user.licenseId
              }
            };
            res.send(buildResponse(payload,  'Registration Successful!'));
          }, handleError)
        }else{
          res.send(BCRYPT_ERROR);
        }
      })
    }else{
      return res.send(USER_EXISTS);
    }
  }, handleError);
};

exports.update = async (req, res, handleError) => {
  const sanitized = validate([
    ('phone' + '|' + req.body.phone + '|' + 'required,phone'),
    ('email' + '|' + req.body.email + '|' + 'required,email'),
    ('firstName' + '|' + req.body.firstName + '|' + 'required'),
    ('lastName' + '|' + req.body.lastName + '|' + 'required'),
  ]);

  if(sanitized.error){
    const { phone, email, firstName, lastName  } = sanitized.error;
    let msg = '';
    if(phone) {
      msg = 'Phone number is invalid';
    }
    if(email) {
      msg = 'Email is invalid';
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

  const { phone, email, firstName, lastName } = sanitized.data;
  const user = await User.get(req.userId);
  if(!user) {
    return res.send(USER_NOT_FOUND);
  }
  await user.update({
    phone,
    emailId: email,
    firstName,
    lastName,
    licenseId: req.body.licenseId
  })
  res.send(buildResponse({user: await User.get(req.userId)},  'User details updated!'));
};

exports.addProfilePic = (req, res, handleError) => {
  const fileName = uuid();
  const userId = req.userId 
  upload.uploadSingleLocal(req, res, {
    fileName: fileName, //unique random file name without extension
    destination : process.cwd() + '/uploads/',
    maxSize: 20 * 1000000,
    key: 'image'
  }, (err) => {
    console.log(err);
    if (!err && req.fileData) {
      let filePath = req.file.path;
      let fileName = req.file.filename;
      if(!userId) {
        fs.unlinkSync(filePath);
        return res.send(invalidResponse('Invalid userId'))
      }
      let userData = {
        profilePic: fileName
      };
      
      User.get(userId).then((user) => {
        if(fs.existsSync('uploads/' + user.profilePic)) {
          fs.unlinkSync('uploads/' + user.profilePic);
        }
        user.update(userData);
        user.dataValues.profilePic = fileName;
        res.send(buildResponse({user}, 'User pic updated!'));
      }, handleError);
    } else {
      let error = {
        error: {
          code: err && err.code,
          msg: err && err.message
        }
      }
      res.send(error);
    }
  })
};

exports.resetPassword = (req, res, handleError) => {
  const sanitized = validate([
    ('phone' + '|' + req.body.email + '|' + 'required,phone'),
    ('password' + '|' + req.body.password + '|' + 'required,min=8,max=24'),
  ]);

  if(sanitized.error){
    let msg = 'Phone number or Password may be invalid!';
    res.send(invalidResponse(msg));
    return;
  }

  const { email, password } = sanitized.data;

  User.getByEmail(email).then((user)=> {
    if(!user){
      res.send(USER_NOT_FOUND);
      return;
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (!err) {
        user.update({password: hash});
        res.send(buildResponse({},  'Password has been set. Please log in!'));
      }else{
        res.send(BCRYPT_ERROR);
      }
    });
  }, handleError);
};

exports.login = (req, res, handleError) => {
  const sanitized = validate([
    ('email' + '|' + req.body.email + '|' + 'required,email'),
    ('password' + '|' + req.body.password + '|' + 'required,min=8,max=24'),
  ]);

  if(sanitized.error){
    let msg = 'Phone number or password may be invalid!';
    res.send(invalidResponse(msg));
    return;
  }

  const { email, password } = sanitized.data;

  User.getByEmail(email).then((user)=>{
    if(!user){
      res.send(USER_NOT_FOUND);
      return;
    }
    bcrypt.compare(password, user.password, async (err, match) => {
      if(err){
        res.send(USER_NOT_FOUND); //BCRYPT ERROR
        return;
      }
      if(!match){
        res.send(INCORRECT_PASSWORD);
        return;
      }

      const payload = await generateToken(user);

      res.send(buildResponse(payload, 'Login Successful!'));
    });
  }, handleError);
};
