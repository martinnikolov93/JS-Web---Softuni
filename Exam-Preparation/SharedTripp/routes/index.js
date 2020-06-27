const { Router } = require('express')
const { getUserAuthStatus } = require('../controllers/user')
const router = Router()

router.get('/', getUserAuthStatus, async (req, res) => {

  res.render('index', {
    title: '',
    isLoggedIn: req.isLoggedIn
  })
})

module.exports = router