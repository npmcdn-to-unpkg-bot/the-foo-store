'use strict';
var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
  reviewDate: { type: Date, default: Date.now },
  rating: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

});

var schema = new mongoose.Schema({
  name: String,
  quantity: { type: Number, default: 5 },
  price: { type: Number, default: 0 },
  reviews: [ reviewSchema ]
});


mongoose.model('Product', schema);
