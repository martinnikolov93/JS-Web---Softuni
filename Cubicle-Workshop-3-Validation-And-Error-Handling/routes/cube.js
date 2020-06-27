const express = require('express')
const router = express.Router()
const { createCube, getAllCubes, deleteCube, getCube, updateCube, updateCubeAccessory, getCubeWithAccessories } = require('../controllers/cubes')
const { authAccess, getUserAuthStatus } = require('../controllers/user')

router.get('/edit/:id', authAccess, getUserAuthStatus, async (req, res) => {
    const cube = await getCube(req.params.id)

    res.render('editCubePage', {
        title: 'Edit cube | Cube Workshop',
        isLoggedIn: req.isLoggedIn,
        ...cube
    })
})

router.post('/edit/:id', authAccess, getUserAuthStatus, async (req, res) => {
    const cube = req.body

    const {error, message} = await updateCube(req.params.id, cube)

    if (error){
        return res.render('editCubePage', {
            error: true,
            errorMessage: message,
            isLoggedIn: req.isLoggedIn,
            _id: req.params.id,
            ...cube
        })
    } else {
        res.redirect(`/details/${req.params.id}`)
    }
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

router.post('/create', authAccess, getUserAuthStatus, async (req, res) => {
    
    const {error, message} = await createCube(req, res)

    if (error){
        return res.render('create', {
            error: true,
            errorMessage: message,
            isLoggedIn: req.isLoggedIn,
            oldInput: req.body
        })
    } else {
        return res.redirect('/')
    }
})

module.exports = router