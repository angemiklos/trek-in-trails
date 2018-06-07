'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const HikeSchema = mongoose.Schema({
  trailName:  {type: String, required: true, unique: true},
  location:  {type: String, required: true},
  difficulty:  {type: String, required: true},
  city:  {type: String, required: true},
  state: {type: String, required: true},
  distance: {type: Number, default: 0},
  configuration: {type: String, default: 'out-and-back'},
  trailTraffic: {type: String, default: 'moderate'},
  elevation: {type: Number, default: 0}
});

const Hike = mongoose.model('Hike', HikeSchema);

module.exports = {Hike};
