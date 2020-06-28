const { Router } = require('express')
const { getUserAuthStatus } = require('../controllers/userController')
const router = Router()

router.get('/', getUserAuthStatus, async (req, res) => {

  res.render('index', {
    title: '',
    isLoggedIn: req.isLoggedIn
  })
})

module.exports = router