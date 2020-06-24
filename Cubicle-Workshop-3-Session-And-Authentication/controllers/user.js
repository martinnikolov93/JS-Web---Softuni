const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtPrivateKey } = require('../config/constants')

const generateJWToken = data => {
    const JWToken = jwt.sign(data, jwtPrivateKey)

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

    const JWToken = generateJWToken({ userID: userObject._id, username: userObject.username })

    res.cookie('authId', JWToken)

    return true;
}

const verifyUser = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const status = await bcrypt.compare(password, user.password)

    if (status) {
        const JWToken = generateJWToken({ userID: user._id, username: user.username })
        res.cookie('authId', JWToken)
    }

    return status
}

const authAccess = (req, res, next) => {
    const token = req.cookies['authId']

    if (!token) {
        return res.redirect('/')
    }

    try {
        const decodedUserObject = jwt.verify(token, jwtPrivateKey)
        next()
    } catch (e) {
        res.redirect('/')
    }
}

const guestAccess = (req, res, next) => {
    const token = req.cookies['authId']

    if (token) {
        return res.redirect('/')
    }

    next()
}

const getUserAuthStatus = (req, res, next) => {
    const token = req.cookies['authId']
    if (!token) {
        req.isLoggedIn = false
    }

    try {
        const decodedUserObject = jwt.verify(token, jwtPrivateKey)
        req.isLoggedIn = true
    } catch (e) {
        req.isLoggedIn = false
    }

    next()
}

module.exports = {
    saveUser,
    authAccess,
    guestAccess,
    verifyUser,
    getUserAuthStatus
}