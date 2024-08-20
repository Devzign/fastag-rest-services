const mongoose = require('mongoose');

const superAdmin = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  Password: {
    type: String,
    required: true,
    minlength: 6,
  },
  ConfirmPassword: {
    type: String,
    validate: {
      validator: function (value) {
        return this.Password === value;
      },
      message: 'Passwords do not match',
    },
  },
  Role: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
}, {
  timestamp: true
});

module.exports = mongoose.model('superadmin', superAdmin);
