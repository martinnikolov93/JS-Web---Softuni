const { Router } = require('express')
const { getUserAuthStatus } = require('../controllers/userController')
const { getAllPlaysByLikes, getAllPlaysByDate } = require('../controllers/playController')

const router = Router()

router.get('/', getUserAuthStatus, async (req, res) => {

  let plays = {}

  if (req.isLoggedIn) {
    plays = await getAllPlaysByDate()
  } else {
    plays = await getAllPlaysByLikes()
  }

  res.render('index', {
    title: 'Home',
    isLoggedIn: req.isLoggedIn,
    plays
  })
})

module.exports = router