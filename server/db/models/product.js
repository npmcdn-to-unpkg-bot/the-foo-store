'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  price: Number
});


mongoose.model('Product', schema);
