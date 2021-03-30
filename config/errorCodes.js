module.exports = {

  ADMIN_EXISTS: {
    error: {
      code: 'ADMIN_EXISTS',
      msg: 'Admin already registered. Please try with other Email'
    }
  },

  USER_EXISTS: {
    error: {
      code: 'USER_EXISTS',
      msg: 'You are already registered. Please login into system'
    }
  },

  CAR_EXISTS: {
    error: {
      code: 'CAR_EXISTS',
      msg: 'Car alerady added'
    }
  },

  USER_NOT_FOUND: {
    error: {
      code: 'USER_NOT_FOUND',
      msg: 'User not found!'
    }
  },

  INCORRECT_PASSWORD: {
    error: {
      code: 'INCORRECT_PASSWORD',
      msg: 'Email or Password is incorrect!'
    }
  },
  
  NO_DATA_FOUND: {
    error: {
      code: 'NO_DATA_FOUND',
      msg: 'Data not found'
    }
  },

  BCRYPT_ERROR: {
    error: {
      code: 'BCRYPT_ERROR',
      msg: 'Bcrypt algorithm failed!'
    }
  },
  
  ERROR_500:{
    error: {
      code: 'ERROR_500',
      msg: 'Something went wrong. Please try again'
    }
  },

  UNAUTHORISED:{
    error: {
      code: 'UNAUTHORISED',
      msg: 'You are not authorised to perform this action!'
    }
  },

  INVALID_AUTH_TOKEN: {
    error: {
      code: 'INVALID_AUTH_TOKEN',
      msg: 'Invalid Authorization Token'
    }
  },
  
  NO_AUTH_TOKEN: {
    error: {
      code: 'NO_AUTH_TOKEN',
      msg: 'No Authorization Token found'
    }
  }
};