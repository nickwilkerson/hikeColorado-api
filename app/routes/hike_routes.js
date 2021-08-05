const express = require('express')

const passport = require('passport')

const Hike = require('./../models/hike')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE
// POST /hike
router.post('/hike', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.hike.owner = req.user.id

  Hike.create(req.body.hike)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(hike => {
      res.status(201).json({ hike: hike.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// SHOW
// GET
router.get('/hike', requireToken, (req, res, next) => {
  Hike.find()
    .then((hike) => {
      return hike.map((hike) => hike.toObject())
    })
    .then((hike) => res.status(200).json({ hike }))
    .catch(next)
})

// DELETE
router.delete('/hike/:id', requireToken, (req, res, next) => {
  Hike.findById(req.params.id)
    .then(handle404)
    .then(hike => {
      requireOwnership(req, hike)
      hike.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
