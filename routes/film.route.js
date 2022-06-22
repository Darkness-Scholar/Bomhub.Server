const express = require('express')
const film = express.Router()

const { 
    toprate, 
    trending, 
    filmDetail, 
    episode, 
    trailer, 
    basicSearch, 
    advanceSearch 
    } = require('../service/film.service')

film.get("/", toprate)

film.get("/trending", trending)

film.get("/detail", filmDetail)

film.get("/trailer", trailer)

film.get("/stream", episode)

film.post("/basic-search", basicSearch)
 
film.post("/advance-search", advanceSearch)

module.exports = film