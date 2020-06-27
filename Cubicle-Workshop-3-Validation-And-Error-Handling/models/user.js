const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { constants } = require('../config/constants')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate:{
      validator:(username) => { return username.length >= 5 },
      message:'Username must be at least 5 characters'
    }
  },
  password: {
    type: String,
    required: true,
  },
})

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