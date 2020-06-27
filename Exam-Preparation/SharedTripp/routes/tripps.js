const { Router } = require('express')
const { saveUser, verifyUser, guestAccess, authAccess, getUserAuthStatus, getUserById } = require('../controllers/user')
const { createTripp, getAllTripps, getTripp, joinTripp, removeTripp } = require('../controllers/trippController')

const router = Router()

router.get('/sharedtripps', authAccess, getUserAuthStatus, async (req, res) => {
  const tripps = await getAllTripps()
  res.render('sharedTripps', {
    title: 'Shared Tripps',
    isLoggedIn: req.isLoggedIn,
    loggedEmail: req.email,
    tripps
  })
})

router.get('/createtripp', authAccess, getUserAuthStatus, async (req, res) => {
  res.render('createTripp', {
    title: 'Create Tripp',
    isLoggedIn: req.isLoggedIn,
    loggedEmail: req.email
  })
})

router.get('/details/:id', authAccess, getUserAuthStatus, async (req, res) => {

  const tripp = await getTripp(req.params.id)
  const trippCreator = await getUserById(tripp.creatorId)

  let isCreator = false
  if (trippCreator.email == req.email) {
    isCreator = true
  }

  let isJoined = false
  for (i = 0; i < tripp.buddies.length; i++) {
    if (tripp.buddies[i] == req.email) {
      isJoined = true
    }
  }

  res.render('viewTripp', {
    title: 'View Tripp',
    isLoggedIn: req.isLoggedIn,
    loggedEmail: req.email,
    ...tripp,
    driverEmail: trippCreator.email,
    isCreator,
    isJoined
  })
})

router.post('/createtripp', authAccess, getUserAuthStatus, async (req, res) => {
  const { error, message } = await createTripp(req, res)
  if (error) {
    return res.render('createTripp', {
      error: true,
      errorMessage: message,
      isLoggedIn: req.isLoggedIn,
      loggedEmail: req.email
    })
  }
  res.redirect('/sharedtripps')
})

router.get('/jointripp/:id', authAccess, getUserAuthStatus, async (req, res) => {
  await joinTripp(req.params.id, req.email)
  res.redirect(`/details/${req.params.id}`)
})

router.get('/closetripp/:id', authAccess, getUserAuthStatus, async (req, res) => {
  await removeTripp(req.params.id, req.id)
  res.redirect(`/sharedtripps`)
})


module.exports = router