const mongoose = require('mongoose')

const CubeSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [5, 'Name must be at least 5 characters.'],
    required: [true, 'Name is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters.'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required']
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  accessories: [{
    type: 'ObjectId',
    ref: 'Accessory'
  }],
  creatorId: {
    type: 'ObjectId',
  }
})

CubeSchema.path('name').validate(function (name) {
  return name.match(/^[a-zA-z0-9]+$/)
}, 'Name is allowed to have only english characters and numbers')
CubeSchema.path('imageUrl').validate(function(url) {
  return url.startsWith('http://') || url.startsWith('https://')
}, 'Image url must start with http or https.')

module.exports = mongoose.model('Cube', CubeSchema)