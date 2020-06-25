const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { getAllCubes, deleteCube, getCube, updateCube, updateCubeAccessory, getCubeWithAccessories } = require('../controllers/cubes')
const { authAccess, getUserAuthStatus } = require('../controllers/user')
const { jwtPrivateKey } = require('../config/constants')
const Cube = require('../models/cube')

const privateKey = 'cube-workshop-softuni'

router.get('/edit/:id', authAccess, getUserAuthStatus, async (req, res) => {
    const cube = await getCube(req.params.id)

    res.render('editCubePage', {
        title: 'Edit cube | Cube Workshop',
        isLoggedIn: req.isLoggedIn,
        ...cube
    })
})

router.post('/edit/:id', authAccess, getUserAuthStatus, async (req, res) => {
    console.log(req.body)
    const cube = req.body
    await updateCube(req.params.id, cube)
    res.redirect(`/details/${req.params.id}`)
})

router.get('/delete/:id', authAccess, getUserAuthStatus, async (req, res) => {

    const cube = await getCube(req.params.id)

    res.render('deleteCubePage', {
        title: 'Delete cube | Cube Workshop',
        isLoggedIn: req.isLoggedIn,
        ...cube
    })
})

router.post('/delete/:id', authAccess, getUserAuthStatus, async (req, res) => {
    await deleteCube(req.params.id)

    res.redirect('/')
})

router.get('/details/:id', getUserAuthStatus, async (req, res) => {

    const cube = await getCubeWithAccessories(req.params.id)

    res.render('details', {
        title: 'Details | Cube Workshop',
        ...cube,
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/create', authAccess, getUserAuthStatus, (req, res) => {
    res.render('create', {
        title: 'Create Cube | Cube Workshop',
        isLoggedIn: req.isLoggedIn
    })
})

router.post('/create', authAccess, (req, res) => {
    const {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body

    const token = req.cookies['authId']
    const decodedObject = jwt.verify(token, jwtPrivateKey)

    const cube = new Cube({ name, description, imageUrl, difficulty: difficultyLevel, creatorId: decodedObject.userID })

    cube.save((err) => {
        if (err) {
            console.error(err)
            res.redirect('/create')
        } else {
            res.redirect('/')
        }
    })
})

module.exports = router