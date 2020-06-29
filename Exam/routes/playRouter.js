const express = require('express')
const router = express.Router()
const { saveUser, verifyUser, guestAccess, authAccess, getUserAuthStatus } = require('../controllers/userController')
const { createPlay, getPlayById, updatePlay, updatePlayLikes, removePlay } = require('../controllers/playController')

router.get('/create', authAccess, getUserAuthStatus, (req, res) => {
    res.render('createPlay', {
        title: 'Create theater',
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/details/:id', authAccess, getUserAuthStatus, async (req, res) => {
    const play = await getPlayById(req.params.id)

    let isCreator = false
    if (play.creatorId == req.userID) {
        isCreator = true
    }

    let isLiked = false
    if (play.usersLiked) {
        for (i = 0; i < play.usersLiked.length; i++) {
            if (play.usersLiked[i] == req.userID) {
                isLiked = true
            }
        }
    }

    res.render('details', {
        title: 'Details',
        ...play,
        isLoggedIn: req.isLoggedIn,
        isCreator,
        isLiked
    })
})

router.get('/edit/:id', authAccess, getUserAuthStatus, async (req, res) => {
    const play = await getPlayById(req.params.id)
    if (play.creatorId != req.userID) {
        return res.redirect('/')
    }

    res.render('edit', {
        title: 'Edit',
        ...play,
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/like/:id', authAccess, getUserAuthStatus, async (req, res) => {
    await updatePlayLikes(req.params.id, req.userID)
    res.redirect(`/details/${req.params.id}`)
})

router.get('/delete/:id', authAccess, getUserAuthStatus, async (req, res) => {
    await removePlay(req.params.id, req.userID)
    res.redirect(`/`)
})

router.post('/create', authAccess, getUserAuthStatus, async (req, res) => {

    const { title, description, imageUrl, isPublic } = req.body
    let isPublicBool = false
    if (isPublic) {
        isPublicBool = true
    }

    const { error, message } = await createPlay(req, res)

    if (error) {
        return res.render('createPlay', {
            error: true,
            errorMessage: message,
            isLoggedIn: req.isLoggedIn,
            oldInput: { title, description, imageUrl, isPublic: isPublicBool }
        })
    } else {
        return res.redirect('/')
    }
})

router.post('/edit/:id', authAccess, getUserAuthStatus, async (req, res) => {
    const play = req.body

    const { error, message } = await updatePlay(req.params.id, play, req.userID)

    if (error) {
        return res.render('edit', {
            error: true,
            errorMessage: message,
            isLoggedIn: req.isLoggedIn,
            _id: req.params.id,
            ...play
        })
    } else {
        res.redirect(`/details/${req.params.id}`)
    }
})

module.exports = router