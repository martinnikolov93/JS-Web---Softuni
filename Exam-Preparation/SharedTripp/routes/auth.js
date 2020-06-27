const express = require('express')
const router = express.Router()
const { saveUser, verifyUser, guestAccess, authAccess, getUserAuthStatus } = require('../controllers/user')

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
    res.clearCookie('authId')
    res.redirect('/')
})

router.post('/signup', guestAccess, getUserAuthStatus, async (req, res) => {

    const { error, message } = await saveUser(req, res)

    if (error) {
        return res.render('registerPage', {
            error: true,
            errorMessage: message,
            isLoggedIn: req.isLoggedIn,
        })
    } else {
        return res.redirect('/')
    }
})

router.post('/login', guestAccess, getUserAuthStatus, async (req, res) => {
    const { error, message } = await verifyUser(req, res)

    if (error) {
        return res.render('loginPage', {
            error: true,
            errorMessage: message,
            isLoggedIn: req.isLoggedIn,
        })
    } else {
        return res.redirect('/')
    }
})

module.exports = router