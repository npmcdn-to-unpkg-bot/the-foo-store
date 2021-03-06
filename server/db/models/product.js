'use strict';
var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
  reviewDate: { type: Date, default: Date.now },
  rating: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

});

var schema = new mongoose.Schema({
  name: { type: String, unique: true },
  quantity: { type: Number, default: 5 },
  price: { type: Number, default: 0 },
  reviews: [ reviewSchema ]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

schema.virtual('rating').get(function(){
  return this.reviews.reduce(function(sum, review){
    sum += review.rating;
    return sum;
  }, 0)/this.reviews.length;
});

schema.statics.addOrUpdateReview = function(productId, review){
  return this.findById(productId)
    .then(function(product){
      return product.addOrUpdateReview(review);
    });
};

schema.statics.deleteReview = function(productId, reviewId, user){
  return this.findById(productId)
    .then(function(product){
        var index = -1;
        product.reviews.forEach(function(r, idx){
          if(reviewId == r.id && r.user == user.id)
            index = idx;
        });
        if(index !== -1){
          product.reviews.splice(index, 1);
          return product.save();
        }
        throw 'review not found for user and id';
    });
};


schema.methods.addOrUpdateReview = function(review){
  if(review._id)
    return this.updateReview(review);
  else
    return this.addReview(review);
};

schema.methods.updateReview = function(review){
  var _review = this.reviews.filter(function(r){
    return review._id == r._id && r.user.toString() == review.user;
  })[0];
  if(!_review)
    throw 'review not found for user and id';
  _review.rating = review.rating;
  return this.save()
    .then(function(product){
      var _review = product.reviews.filter(function(r){
        return r.user == review.user.toString();
      })[0];
      return _review;
    });
};

schema.methods.addReview = function(review){
  this.reviews.push(review);
  return this.save()
    .then(function(product){
      var _review = product.reviews.filter(function(r){
        return r.user == review.user;
      })[0];
      return _review;
    });
};


mongoose.model('Product', schema);
