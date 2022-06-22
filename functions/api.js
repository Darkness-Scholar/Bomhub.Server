const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const serverless = require('serverless-http')
const film = require('../routes/film.route')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
})

app.use("/film", film)

module.exports.handler = serverless(app)