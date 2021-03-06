require('dotenv').config()
const env = process.env.NODE_ENV || 'development'

const mongoose = require('mongoose')
const config = require('./config/config')[env]
const express = require('express')
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const trippsRouter = require('./routes/tripps')
const app = express()

mongoose.connect(config.databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, (err) => {
  if (err) {
    console.error(err)
    throw err
  }

  console.log('Database is setup and running')
})

require('./config/express')(app)

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/', trippsRouter)

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Page not found'
  })
})

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`))


