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

schema.methods.merge = function(lineItems, user){
  var that = this;
  lineItems.forEach(function(lineItem){
    var existing = that.lineItems.filter(function(_lineItem){
      return _lineItem.product.id === lineItem.product.id;
    });
    if(existing.length)
      existing.quantity += lineItem.quantity;
    else
      that.lineItems.push(lineItem);
  });
  return this.save()
    .then(function(){
      return mongoose.model('Order').getCart(user);
    });

};

function changeStatusToOrder(cart, status){
  return cart.status === 'CART' && status === 'ORDER';
};

schema.statics.updateCart = function(_cart, user){
  var lineItems = _cart.lineItems;
  return this.getCart(user)
    .then(function(cart){
      if(changeStatusToOrder(cart, _cart.status))
        return cart.createOrder();
      cart.lineItems = lineItems;
      return cart.save();
    });
};

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
