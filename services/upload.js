const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const env = process.env.NODE_ENV || 'development';

exports.uploadSingleLocal = function(req, res, details, callback){
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, details.destination)
    },
    filename: function (req, file, cb) {
      req.fileData = file;
      let ext = path.extname(file.originalname);
      const fileName = `${details.fileName}${ext}`;
      req.fileName = fileName;
      cb(null, fileName);
    }
  });

  let options = { storage: storage };

  if(details.maxSize){
    options.limits = { fileSize: details.maxSize}
  }

  const upload = multer(options)
  upload.single(details.key)(req, res, callback);
};