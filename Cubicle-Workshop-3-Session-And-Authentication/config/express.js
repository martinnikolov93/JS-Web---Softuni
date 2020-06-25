const handlebars = require('express-handlebars')
const express = require('express')
const cookieParser = require('cookie-parser')

module.exports = (app) => {
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.engine('.hbs', handlebars({
    extname: '.hbs',
    helpers: require('../helpers/helpers')
  }))
  
  app.set('view engine', '.hbs');

  app.use('/static', express.static('static'))
};