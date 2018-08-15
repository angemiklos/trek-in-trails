'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const { Hike } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jsonParser);

// Post to register a new hike
router.post('/', jsonParser, (req, res) => {
  //console.log(req.body);
  const requiredFields = ['trailName', 'owner'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['trailName', 'owner', 'visibility'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the trailName is not trimmed we give an error.  
  const explicityTrimmedFields = ['trailName'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    trailName: {
      min: 1
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} character(s) long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {trailName, owner, visibility} = req.body;

  return Hike.find({ trailName })
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing hike with the same trailName
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Trail Name already taken',
          location: 'trailName'
        });
      }
      return Hike.create({
        trailName,
        owner,
        visibility
      });
    })
    .then(hike => {
      return res.status(201).json(hike.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

router.get('/', (req, res) => {
  return Hike.find()
    .then(hikes => res.status(200).json(hikes.map(hike => hike.serialize())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// need to fix to send the users home page regardless of whether
// they are a new or previous user
router.get('/:owner', jwtAuth, (req, res) => {
  return Hike.find({owner: req.params.username})
    .then(hikes => res.status(200).json(hikes.map(hike => hike.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error' }));
      // res.sendFile(__dirname + '/public/home.html');
});

module.exports = { router };
