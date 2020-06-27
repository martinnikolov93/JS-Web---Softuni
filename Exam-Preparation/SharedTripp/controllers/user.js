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
    const { email, password, repeatPassword } = req.body

    if (password !== repeatPassword) {
        return passError('Passwords does not match.')
    }

    const user = new User({
        email,
        password
    })

    try {
        const userObject = await user.save()
        const JWToken = generateJWToken({ userID: userObject._id, email: userObject.email })

        res.cookie('authId', JWToken)

        return JWToken
    } catch (err) {
        console.log(err)
        if (err.code == 11000) {
            return passError('Email already exists.')
        }
        const path = Object.keys(err.errors)[0]
        return passError(err.errors[path].properties.message)
    }

}

const verifyUser = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return passError('User does not exist!')
    }
    const passIsValid = await bcrypt.compare(password, user.password)

    if (!passIsValid) {
        return passError('Wrong password!')
    }

    const JWToken = generateJWToken({ userID: user._id, email: user.email })
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
        req.id = decodedUserObject.userID
        req.email = decodedUserObject.email
    } catch (e) {
        req.isLoggedIn = false
    }

    next()
}

const getUserById = async (id) => {
    const user = await User.findById(id).lean()
    return user
}

module.exports = {
    saveUser,
    authAccess,
    guestAccess,
    verifyUser,
    getUserAuthStatus,
    getUserById
}