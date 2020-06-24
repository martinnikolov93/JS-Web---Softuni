const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const privateKey = 'cube-workshop-softuni' 

const saveUser = async (req, res) => {
    const { username, password } = req.body

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
        username,
        password: hashedPassword 
    })
    const userObject = await user.save()

    const JWToken = jwt.sign({userID: userObject._id, username: userObject.username}, privateKey)

    res.cookie('authId', JWToken)

    return true;
}

module.exports = {
    saveUser
}