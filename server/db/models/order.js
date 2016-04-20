'use strict';
var mongoose = require('mongoose');
var lineItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  price: Number,
  quantity: Number
});

var schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lineItems: [ lineItemSchema ]
});


mongoose.model('Order', schema);
