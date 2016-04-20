'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  price: { type: Number, default: 0 }
});


mongoose.model('Product', schema);
