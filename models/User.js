const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserShcema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide name.'],
    minLength: 2,
    maxLength: 50
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Please provide email.'],
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: 'Please provide valid email'
    }
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Please, provide your user password.'],
    minLength: 6,
    maxLength: 100
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

UserShcema.pre('save', async function (req, res, next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserShcema.methods.comparePassword = async function (candidatePassword) {
  const isPasswordMatch = await bcrypt.compare(candidatePassword, this.password);
  return isPasswordMatch;
}

module.exports = mongoose.model('User', UserShcema);