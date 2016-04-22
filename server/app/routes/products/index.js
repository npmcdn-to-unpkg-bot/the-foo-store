'use strict';
var router = require('express').Router();
module.exports = router;
var Product = require('mongoose').model('Product');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', ensureAuthenticated, function (req, res) {
  Product.find()
    .then(function(products){
      res.send(products);
    });
});

