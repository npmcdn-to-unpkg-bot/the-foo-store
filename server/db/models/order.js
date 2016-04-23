'use strict';
var mongoose = require('mongoose');

var lineItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  quantity: Number
});

var schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lineItems: [ lineItemSchema ],
  status: { type: String, default: 'CART' },
  orderDate: Date
});

schema.statics.getCart = function(user){
  var that = this;
  return this.findOne({ user: user, status: 'CART' })
    .populate('lineItems.product')
    .then(function(cart){
      if(cart)
        return cart;
      return that.create({ user: user, status: 'CART'}); 
    
    });
};

schema.methods.createOrder = function(){
  this.status = 'ORDER';
  this.orderDate = new Date();
  return this.save();
};



mongoose.model('Order', schema);
