const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { constants } = require('../config/constants')
const { passError } = require('../utils/helpers')

const generateJWToken = data => {
    const JWToken = jwt.sign(data, constants.jwtPrivateKey)

    return JWToken
}

const saveUser = async (req, res) => {
    const { username, password, repeatPassword } = req.body

    if (password !== repeatPassword) {
        return passError('Passwords does not match.')
    }

    const user = new User({
        username,
        password
    })

    try {
        const userObject = await user.save()
        const JWToken = generateJWToken({ userID: userObject._id, username: userObject.username })

        res.cookie('authId', JWToken)

        return JWToken
    } catch (err) {
        if (err.code == 11000) {
            return passError('Username already exists.')
        }
        const path = Object.keys(err.errors)[0]
        return passError(err.errors[path].properties.message)
    }

}

const verifyUser = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
        return passError('User does not exist!')
    }
    const passIsValid = await bcrypt.compare(password, user.password)

    if (!passIsValid) {
        return passError('Wrong password!')
    }

    const JWToken = generateJWToken({ userID: user._id, username: user.username })
    res.cookie('authId', JWToken)

    return passIsValid
}

const authAccess = (req, res, next) => {
    const token = req.cookies['authId']

    if (!token) {
        return res.redirect('/')
    }

    try {
        const decodedUserObject = jwt.verify(token, constants.jwtPrivateKey)
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
        const decodedUserObject = jwt.verify(token, constants.jwtPrivateKey)
        req.isLoggedIn = true
        req.userID = decodedUserObject.userID
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
    getUserAuthStatus,
}