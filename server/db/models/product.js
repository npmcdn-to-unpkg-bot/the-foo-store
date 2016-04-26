'use strict';
var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
  reviewDate: { type: Date, default: Date.now },
  rating: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

});

var schema = new mongoose.Schema({
  name: String,
  quantity: { type: Number, default: 5 },
  price: { type: Number, default: 0 },
  reviews: [ reviewSchema ]
});

schema.methods.addReview = function(review){
  //TO DO validate that user can make a review!
  this.reviews.push(review);
};


mongoose.model('Product', schema);
