const mongoose = require('mongoose')

const TrippSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    minlength: [4, 'Destination must be least 4 characters']
  },
  dateTime: {
    type: String,
    required: [true, 'Date time is required'],
  },
  carImage: {
    type: String,
    required: [true, 'Car image is required'],
  },
  seats: {
    type: Number,
    required: [true, 'Seats is required'],
    min: [0, 'Seats must be a positive number']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be least 10 characters']
  },
  buddies: {
    type: Array
  },
  creatorId: {
    type: 'ObjectId',
  }
})

TrippSchema.path('destination').validate(function (destination) {
  return destination.match(/^[a-z ]+ \- [a-z ]+$/)
}, 'Invalid destination format')
TrippSchema.path('dateTime').validate(function (dateTime) {
  return dateTime.match(/^[a-z ]+ \- [a-z ]+$/)
}, 'Invalid date and time format')
TrippSchema.path('carImage').validate(function (url) {
  return url.startsWith('http://') || url.startsWith('https://')
}, 'Car image url must start with http or https.')

module.exports = mongoose.model('Tripp', TrippSchema)