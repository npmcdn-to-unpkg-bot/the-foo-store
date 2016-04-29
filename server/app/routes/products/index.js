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

router.get('/', function (req, res, next) {
  Product.find()
    .then(function(products){
      res.send(products);
    }, next);
});

router.post('/', ensureAuthenticated, function (req, res, next) {
  Product.create({
    name: req.body.name,
    price: req.body.price
  })
  .then(function(product){
    res.send(product);
  }, next);
});

var addOrUpdateReview = function(req, res, next){
  var review = {
    user: req.user,
    rating: req.body.rating,
    _id: req.params.reviewId
  };
  Product.addOrUpdateReview(req.params.id, review)
    .then(function(){
      res.send(review);
    }, next);
};

router.post('/:id/reviews/', ensureAuthenticated,  addOrUpdateReview);

router.put('/:id/reviews/:reviewId', ensureAuthenticated, addOrUpdateReview); 

