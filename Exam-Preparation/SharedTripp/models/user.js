const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { constants } = require('../config/constants')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username already taken'],
    minlength: [5, 'Username must be at least 5 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
})

//Regex examples
// UserSchema.path('username').validate(function (username) {
//   return username.match(/^[a-zA-z0-9]+$/)
// }, 'Username is allowed to have only english characters and numbers')
// UserSchema.path('password').validate(function (password) {
//   return password.match(/^[a-zA-z0-9]+$/)
// }, 'Password is allowed to have only english characters and numbers')

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