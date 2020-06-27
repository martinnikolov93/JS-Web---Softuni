const Tripp = require('../models/trippModel')
const { constants } = require('../config/constants')
const { passError } = require('../utils/helpers')
const jwt = require('jsonwebtoken')

const createTripp = async (req, res) => {
  const {
    destination,
    dateTime,
    carImage,
    seats,
    description
  } = req.body

  const token = req.cookies['authId']
  const decodedUserObject = jwt.verify(token, constants.jwtPrivateKey)

  const tripp = new Tripp({ destination, dateTime, carImage, seats, description, buddies: [], creatorId: decodedUserObject.userID })
  try {
    return await tripp.save()
  } catch (err) {
    const path = Object.keys(err.errors)[0]
    return passError(err.errors[path].properties.message)
  }
}

const joinTripp = async (trippId, email) => {
  const trippData = await getTripp(trippId)

  if (trippData.seats == 0) {
    return
  }

  let isJoined = false
  for (i = 0; i < trippData.buddies.length; i++) {
    if (trippData.buddies[i] == email) {
      isJoined = true
    }
  }

  if (!isJoined) {
    try {
      trippData.buddies.push(email)
      await Tripp.findByIdAndUpdate(trippId, { $set: { buddies: trippData.buddies, seats: trippData.seats - 1 } });
    } catch (err) {
      return err
    }
  }
}

const removeTripp = async (trippId, userId) => {
  const trippData = await getTripp(trippId)

  if (trippData.creatorId != userId) {
    return
  }

  await Tripp.findByIdAndDelete(trippId)
    .catch(err => res.status(400).send(err.message))
}

const getAllTripps = async () => {
  const tripps = await Tripp.find().lean()
  return tripps
}

const getTripp = async (trippId) => {
  const tripp = await Tripp.findById(trippId).lean()
  return tripp
}

module.exports = {
  createTripp,
  getAllTripps,
  getTripp,
  joinTripp,
  removeTripp
}