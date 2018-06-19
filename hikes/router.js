'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {Hike} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jsonParser);

// Post to save a new hiking
//router.post('/', jsonParser, (req, res) => {
  //console.log(req.body);
//      res.status(204).end();
//});

// need to fix to send the users home page regardless of whether
// they are a new or previous user
//router.get('/home', jwtAuth, (req, res) => {
//  return Hike.find()
//    .then(hikes => res.json(hikes.map(hike => hike.serialize())))
//    .catch(err => res.status(500).json({message: 'Internal server error'}));
    //   res.sendFile(__dirname + '/public/home.html');
//});

module.exports = {router};
