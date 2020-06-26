const { Router } = require('express')
const { getAllCubes, getCube, updateCubeAccessory, getCubeWithAccessories } = require('../controllers/cubes')
const { getUserAuthStatus } = require('../controllers/user')
const router = Router()

router.get('/', getUserAuthStatus, async (req, res) => {
  const cubes = await getAllCubes()

  res.render('index', {
    title: 'Cube Workshop',
    cubes,
    isLoggedIn: req.isLoggedIn
  })
})

router.get('/about', getUserAuthStatus, (req, res) => {
  res.render('about', {
    title: 'About | Cube Workshop',
    isLoggedIn: req.isLoggedIn
  })
})

module.exports = router