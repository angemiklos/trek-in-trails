'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Hike} = require('./hikes');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to save a new hiking
router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
      return res.status(201);
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return Hike.find()
    .then(hikes => res.json(hikes.map(hike => hike.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
