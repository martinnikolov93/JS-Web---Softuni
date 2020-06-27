const Cube = require('../models/cube')
const Accessory = require('../models/accessory')
const { passError } = require('../utils/helpers')
const jwt = require('jsonwebtoken')
const { constants } = require('../config/constants')

const createCube = async (req, res) => {
  const {
    name,
    description,
    imageUrl,
    difficultyLevel
  } = req.body

  const token = req.cookies['authId']
  const decodedUserObject = jwt.verify(token, constants.jwtPrivateKey)

  const cube = new Cube({ name, description, imageUrl, difficulty: difficultyLevel, creatorId: decodedUserObject.userID })
  try {
    return await cube.save()
  } catch (err) {
    const path = Object.keys(err.errors)[0]
    return passError(err.errors[path].properties.message)
  }
}

const getAllCubes = async () => {
  const cubes = await Cube.find().lean()

  return cubes
}

const getCube = async (id) => {
  const cube = await Cube.findById(id).lean()

  return cube
}

const getCubeWithAccessories = async (id) => {
  const cube = await Cube.findById(id).populate('accessories').lean()

  return cube
}

const updateCube = async (cubeId, cube) => {
  try {
    const cubeObj = new Cube(cube)
    const error = cubeObj.validateSync()
    if (error){
      throw error
    }
    return await Cube.findByIdAndUpdate(cubeId, cube)
  } catch (err) {
    const path = Object.keys(err.errors)[0]
    return passError(err.errors[path].properties.message)
  }
}

const deleteCube = async (cubeId) => {
  await Cube
    .findByIdAndDelete(cubeId)
    .catch(err => res.status(400).send(err.message))
}

const updateCubeAccessory = async (cubeId, accessoryId) => {
  try {
    await Cube.findByIdAndUpdate(cubeId, {
      $addToSet: {
        accessories: [accessoryId],
      },
    });
    await Accessory.findByIdAndUpdate(accessoryId, {
      $addToSet: {
        cubes: [cubeId],
      },
    })
  } catch (err) {
    return err
  }
}


module.exports = {
  getAllCubes,
  getCube,
  updateCubeAccessory,
  updateCube,
  getCubeWithAccessories,
  deleteCube,
  createCube
}