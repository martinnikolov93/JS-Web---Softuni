const { Router } = require('express')
const { getUserAuthStatus } = require('../controllers/user')
const router = Router()

router.get('/', getUserAuthStatus, async (req, res) => {
  res.render('index', {
    title: 'Home',
    isLoggedIn: req.isLoggedIn,
    loggedEmail: req.email
  })
})

module.exports = router