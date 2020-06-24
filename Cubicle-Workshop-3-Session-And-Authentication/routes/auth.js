const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/login', (req, res) => {
    res.render('loginPage')
})

router.get('/signup', (req, res) => {
    res.render('registerPage')
})

router.post('/signup', async (req, res) => {
    const {username, password} = req.body
    const user = new User({username, password})
    await user.save()

    res.redirect('/')
})

module.exports = router