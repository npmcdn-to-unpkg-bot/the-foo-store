'use strict';
var router = require('express').Router();
module.exports = router;
var Order = require('mongoose').model('Order');

var ensureAuthenticated = require('../../configure/auth-middleware').ensureAuthenticated;

router.get('/', ensureAuthenticated, function (req, res) {
  Order.find({ user: req.user._id, status: 'ORDER' })
    .populate('lineItems.product')
    .then(function(orders){
      res.send(orders);
    });
});

router.post('/', ensureAuthenticated, function (req, res, next) {
  Order.getCart(req.user)
    .then(function(cart){
      if(!req.body.lineItems)//this would be from an anonymous cart
        return cart;
      return cart.merge(req.body.lineItems, req.user);
    })
    .then(function(cart){
      res.send(cart);
    }, next);
});

router.put('/:id', ensureAuthenticated, function (req, res, next) {
  return Order.updateCart(req.body, req.user)
    .then(function(cart){
      res.send(cart);
    }, next);
});
