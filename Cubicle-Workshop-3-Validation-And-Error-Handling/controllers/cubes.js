const Cube = require('../models/cube')
const Accessory = require('../models/accessory')

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
    await Cube.findByIdAndUpdate(cubeId, cube)
    return true
  } catch (e) {
    return false
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
  deleteCube
}