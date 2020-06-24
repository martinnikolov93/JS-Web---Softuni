const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const privateKey = 'cube-workshop-softuni' 

const generateJWToken = data => {
    const JWToken = jwt.sign(data, privateKey)

    return JWToken
}

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

    const JWToken = generateJWToken({userID: userObject._id, username: userObject.username})

    res.cookie('authId', JWToken)

    return true;
}

const verifyUser = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({username})
    const status = await bcrypt.compare(password, user.password)

    if(status){
        const JWToken = generateJWToken({userID: user._id, username: user.username})
        res.cookie('authId', JWToken)
    }

    return status
}

module.exports = {
    saveUser,
    verifyUser
}