'use strict';
var mongoose = require('mongoose');

var addressSchema = mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipcode: String
});

var creditCardSchema = mongoose.Schema({
  ccNumber: String,
  ccv: String
});

var lineItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  quantity: Number
});

var schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lineItems: [ lineItemSchema ],
  status: { type: String, default: 'CART' },
  orderDate: Date,
  address: addressSchema,
  creditCard: creditCardSchema
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

schema.statics.getOrdersForUser = function(user){
  var qry = { status: { $in: ['ORDER', 'SHIPPED'] } };
  if(!user.isAdmin)
    qry.user = user._id;
  return this.find(qry)
    .populate(['lineItems.product', 'user']);
};

schema.statics.update = function(id, body, user){
  var that = this;
  return this.findById(id)
    .then(function(order){
      if(order.status === 'ORDER' && !user.isAdmin)
        throw 'orders can not be updated by non admins';
      if(order.status === 'ORDER' && user.isAdmin){
        order.status = body.status; 
        return order.save();
      }
      return that.updateCart(body, user); 
    });

};

schema.statics.updateCart = function(_cart, user){
  var lineItems = _cart.lineItems;
  var address = _cart.address;
  var creditCard = _cart.creditCard;
  return this.getCart(user)
    .then(function(cart){
      if(changeStatusToOrder(cart, _cart.status))
        return cart.createOrder();
      cart.lineItems = lineItems;
      cart.address = address;
      cart.creditCard = creditCard;
      return cart.save();
    });
};

schema.statics.getCart = function(user, _cart){
  var that = this;
  return this.findOne({ user: user, status: 'CART' })
    .populate('lineItems.product')
    .then(function(cart){
      if(cart)
        return cart;
      return that.create({ user: user, status: 'CART'}); 
    })
    .then(function(cart){
      var lineItems = _cart && _cart.lineItems;
      if(!lineItems)//this would be from an anonymous cart
        return cart;
      return cart.merge(lineItems, user);
    });
};

schema.methods.createOrder = function(){
  this.status = 'ORDER';
  this.orderDate = new Date();
  return this.save();
};



mongoose.model('Order', schema);
