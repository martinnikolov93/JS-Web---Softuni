const User = require('../models/user')
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

    if (username.length < 5) {
        return passError('Username length must be at least 5 characters.')
    }
    if(!username.match(/^[a-zA-z0-9]+$/)){
        return passError('Username is allowed to have only english characters and numbers')
    }
    if (password.length < 8) {
        return passError('Password length must be at least 8 characters.')
    }
    if(!password.match(/^[a-zA-z0-9]+$/)){
        return passError('Password is allowed to have only english characters and numbers')
    }
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
    } catch (e) {
        if (e.code == 11000){
            return passError('Username already exists.')
        }
        return passError('Something went wrong.')
    }
}

const verifyUser = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user){
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