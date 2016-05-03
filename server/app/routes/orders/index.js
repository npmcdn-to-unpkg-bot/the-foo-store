'use strict';
var router = require('express').Router();
module.exports = router;
var Order = require('mongoose').model('Order');

var ensureAuthenticated = require('../../configure/auth-middleware').ensureAuthenticated;

router.get('/', ensureAuthenticated, function (req, res, next) {
  Order.getOrdersForUser(req.user)
    .then(function(orders){
      res.send(orders);
    }, next);
});

router.post('/', ensureAuthenticated, function (req, res, next) {
  Order.getCart(req.user, req.body)
    .then(function(cart){
      res.send(cart);
    }, next);
});

router.put('/:id', ensureAuthenticated, function (req, res, next) {
  return Order.update(req.params.id, req.body, req.user)
    .then(function(cart){
      res.send(cart);
    }, next);
});
