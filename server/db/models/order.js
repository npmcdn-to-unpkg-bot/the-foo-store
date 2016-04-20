'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var lineItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  price: Number,
  quantity: Number
});

var schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lineItems: [ lineItemSchema ],
  status: { type: String, default: 'CART' }
});

schema.pre('save', function(next){
  var promises = [];
  
  this.lineItems.forEach(function(lineItem){
    var p = Promise.bind({})
      .then(function(){
        return mongoose.model('Product').findById(lineItem.product);
      })
      .then(function(product){
        lineItem.price = product.price;
        return lineItem;
      });
      promises.push(p);
  });

  var that = this;
  Promise.all(promises)
    .then(function(){
      var map = that.lineItems.reduce(function(memo, lineItem){
        if(!memo[lineItem.product])
          memo[lineItem.product] = { price: lineItem.price, quantity: lineItem.quantity };
        else
          memo[lineItem.product].quantity += lineItem.quantity;
        return memo;
      }, {});
      var lineItems = Object.keys(map).reduce(function(memo, key){
        memo.push({product: key, quantity: map[key].quantity, price: map[key].price });
        return memo;
      }, []);
      that.lineItems = lineItems;
      next();
    });
});


mongoose.model('Order', schema);
