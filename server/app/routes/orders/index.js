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

router.post('/', ensureAuthenticated, function (req, res) {
  Order.getCart(req.user)
    .then(function(cart){
      res.send(cart);
    });
});

router.put('/:id', ensureAuthenticated, function (req, res, next) {
  Order.getCart(req.user)
    .then(function(cart){
      cart.lineItems = req.body.lineItems;
      return cart.save();
    })
    .then(function(cart){
      return res.send(cart);
    }, next);
});
