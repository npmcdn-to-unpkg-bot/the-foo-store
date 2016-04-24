'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Order = require('mongoose').model('Order');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', ensureAuthenticated, function (req, res) {
  Order.find({ user: req.user._id, status: 'ORDER' })
    .populate('lineItems.product')
    .then(function(orders){
      res.send(orders);
    });
});

router.post('/', ensureAuthenticated, function (req, res) {
  Order.getCart(req.user)
    .then(function(cart){
      res.send(cart);
    });
});

router.put('/:id', ensureAuthenticated, function (req, res, next) {
  Order.getCart(req.user)
    .then(function(cart){
      if(cart.status === 'CART' && req.body.status === 'ORDER')
        return cart.createOrder();
      cart.lineItems = req.body.lineItems;
      return cart.save();
    })
    .then(function(cart){
      return res.send(cart);
    }, next);
});
