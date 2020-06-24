const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { getAllCubes, getCube, updateCube, getCubeWithAccessories } = require('../controllers/cubes')
const { authAccess, getUserAuthStatus } = require('../controllers/user')
const { jwtPrivateKey } = require('../config/constants')
const Cube = require('../models/cube')

const privateKey = 'cube-workshop-softuni'

router.get('/edit', authAccess, getUserAuthStatus, (req, res) => {
    res.render('editCubePage', {
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/delete', authAccess, getUserAuthStatus, (req, res) => {
    res.render('deleteCubePage', {
        isLoggedIn: req.isLoggedIn
    })
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