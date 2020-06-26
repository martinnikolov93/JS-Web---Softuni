const express = require('express')
const router = express.Router()
const { saveUser, verifyUser, guestAccess, authAccess, getUserAuthStatus } = require('../controllers/user')
const e = require('express')

router.get('/login', guestAccess, (req, res) => {
    res.render('loginPage', {
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/signup', guestAccess, getUserAuthStatus, (req, res) => {
    res.render('registerPage', {
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/logout', authAccess, getUserAuthStatus, (req, res) => {
    res.clearCookie('authId');
    res.redirect('/')
})

router.post('/signup', guestAccess, getUserAuthStatus, async (req, res) => {
    const status = await saveUser(req, res)

    if (status) {
        return res.redirect('/')
    } else {
        console.log('Error saving user!')
    }
})

router.post('/login', guestAccess, async (req, res) => {
    const status = await verifyUser(req, res)

    if (status) {
        return res.redirect('/')
    } else {
        console.log('Error verifying user!')
    }
})

module.exports = router