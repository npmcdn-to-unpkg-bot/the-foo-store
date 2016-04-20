'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: { type: Number, default: 5 }
});


mongoose.model('Product', schema);
