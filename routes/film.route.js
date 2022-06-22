const express = require('express')
const film = express.Router()

film.get("/", (req, res) => {
    res.json({ msg: "FILM" })
})

module.exports = film