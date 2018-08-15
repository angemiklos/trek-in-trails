'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const HikeSchema = mongoose.Schema({
  trailName: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' }
//  location:      {type: String, required: true},
//  difficulty:    {type: String, required: true},
//  city:          {type: String, required: true},
//  state:         {type: String, required: true},
//  distance:      {type: Number, default: 0},
//  configuration: {type: String, default: 'out-and-back'},
//  trailTraffic:  {type: String, default: 'moderate'},
//  elevation:     {type: Number, default: 0}
});

HikeSchema.methods.serialize = function() {
  return {
    trailName: this.trailName || '',
    owner: this.owner || '',
    visibility: this.visibility
//    city:       this.city        || '',
//    state:      this.state       || ''
  };
};

const Hike = mongoose.model('Hike', HikeSchema);

module.exports = { Hike };
