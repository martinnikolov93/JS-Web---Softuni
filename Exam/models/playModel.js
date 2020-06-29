const mongoose = require('mongoose')

const PlaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    unique: [true, 'Title already taken'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [50, 'Description must be maximum 50 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: String,
  },
  creatorId: {
    type: 'ObjectId'
  },
  usersLiked: {
    type: 'ObjectId',
    ref: 'Users'
  }
})

module.exports = mongoose.model('Play', PlaySchema)