const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { constants } = require('../config/constants')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  trippHistory: [{
    type: 'ObjectId',
    ref: 'Tripp'
  }],
})

UserSchema.path('email').validate(function (email) {
  return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
}, 'Invalid email.')

//Hash user password
UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(constants.saltRounds);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next()
  } catch (e) {
    return e
  }
})

module.exports = mongoose.model('User', UserSchema)