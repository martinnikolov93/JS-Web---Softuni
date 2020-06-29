const Play = require('../models/playModel')
const User = require('../models/userModel')
const { passError } = require('../utils/helpers')
const jwt = require('jsonwebtoken')
const { constants } = require('../config/constants')

const createPlay = async (req, res) => {
    const {
        title,
        description,
        imageUrl,
        isPublic
    } = req.body

    const token = req.cookies['authId']
    const decodedUserObject = jwt.verify(token, constants.jwtPrivateKey)

    let isPublicBool = false
    if (isPublic) {
        isPublicBool = true
    }

    const play = new Play({ title, description, imageUrl, isPublic: isPublicBool, createdAt: Date.now(), creatorId: decodedUserObject.userID })

    try {
        return await play.save()
    } catch (err) {
        const path = Object.keys(err.errors)[0]
        return passError(err.errors[path].properties.message)
    }
}

const getAllPlaysByLikes = async () => {
    const plays = await Play.find({ isPublic: true }).sort({ usersLiked: -1 }).limit(3).lean();

    return plays
}

const getAllPlaysByDate = async () => {
    const plays = await Play.find({ isPublic: true }).sort({ createdAt: -1 }).lean();
    //a.createdAt > b.createdAt ? 1 : -1
    return plays
}

const getPlayById = async (id) => {
    const play = await Play.findById(id).lean()

    return play
}

const updatePlay = async (playId, play, userId) => {
    try {
        const playFromDb = await getPlayById(playId)

        if (playFromDb.creatorId != userId) {
            return 'error'
        }

        let isPublicBool = false
        if (play.isPublic) {
            isPublicBool = true
        }
        play.isPublic = isPublicBool

        const playObj = new Play(play)
        const error = playObj.validateSync()
        if (error) {
            throw error
        }
        return await Play.findByIdAndUpdate(playId, play)
    } catch (err) {
        const path = Object.keys(err.errors)[0]
        return passError(err.errors[path].properties.message)
    }
}

// const getCubeWithAccessories = async (id) => {
//   const cube = await Cube.findById(id).populate('accessories').lean()

//   return cube
// }

// const deleteCube = async (cubeId) => {
//   await Cube
//     .findByIdAndDelete(cubeId)
//     .catch(err => res.status(400).send(err.message))
// }

const updatePlayLikes = async (playId, userId) => {
    const play = await getPlayById(playId)

    if (play.creatorId == userId) {
        return
    }

    try {
        await Play.findByIdAndUpdate(playId, {
            $addToSet: {
                usersLiked: [userId],
            },
        });
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                likedPlays: [playId],
            },
        })
    } catch (err) {
        return err
    }
}

const removePlay = async (playId, userId) => {
    const play = await getPlayById(playId)

    if (play.creatorId != userId) {
        return
    }

    await Play.findByIdAndDelete(playId)
        .catch(err => res.status(400).send(err.message))
}


module.exports = {
    createPlay,
    getAllPlaysByLikes,
    getAllPlaysByDate,
    getPlayById,
    updatePlay,
    updatePlayLikes,
    removePlay
}