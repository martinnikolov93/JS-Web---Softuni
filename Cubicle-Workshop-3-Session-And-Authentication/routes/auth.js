const express = require('express')
const router = express.Router()
const { saveUser, verifyUser } = require('../controllers/user')
const e = require('express')

router.get('/login', (req, res) => {
    res.render('loginPage')
})

router.get('/signup', (req, res) => {
    res.render('registerPage')
})

router.post('/signup', async (req, res) => {
    const status = await saveUser(req, res)

    if (status){
        return res.redirect('/')
    } else {
        console.log('Error saving user!')
    }
})

router.post('/login', async (req, res) => {
    const status = await verifyUser(req, res)

    if (status){
        return res.redirect('/')
    } else {
        console.log('Error verifying user!')
    }
})

module.exports = router