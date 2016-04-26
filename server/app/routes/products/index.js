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

router.post('/:id/reviews/', ensureAuthenticated, function (req, res, next) {
  Product.findById(req.params.id)
    .then(function(product){
      var existing = product.reviews.filter(function(review){
        return review.user.toString() === req.user.id;
      });
      if(existing.length > 0){
        return res.sendStatus(404);
      }
      product.reviews.push({user: req.user._id, rating: req.body.rating});
      return product.save();
    })
    .then(function(product){
      var existing = product.reviews.filter(function(review){
        return review.user.toString() === req.user.id;
      });
      res.send(existing[0]);
    });
});

router.put('/:id/reviews/:reviewId', ensureAuthenticated, function (req, res, next) {
  Product.findById(req.params.id)
    .then(function(product){
      var existing = product.reviews.filter(function(review){
        return review.user.toString() === req.user.id && review._id.toString() === req.params.reviewId;
      });
      if(existing.length === 0){
        return res.sendStatus(404);
      }
      existing[0].rating = req.body.rating;
      return product.save();
    })
    .then(function(product){
      res.send(product);
    });
});

