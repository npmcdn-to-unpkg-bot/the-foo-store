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
});

schema.statics.addOrUpdateReview = function(productId, review){
  return this.findById(productId)
    .then(function(product){
      return product.addOrUpdateReview(review);
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
    return review._id == r._id && r.user == review.user.id;
  })[0];
  if(!_review)
    throw 'review not found for user and id';
  _review.rating = review.rating;
  return this.save();
};

schema.methods.addReview = function(review){
  this.reviews.push(review);
  return this.save();
};


mongoose.model('Product', schema);
