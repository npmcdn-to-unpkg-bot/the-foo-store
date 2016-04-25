var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');

describe('Product model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Product).to.be.a('function');
    });

    describe('a valid product', function(){
      var product;
      beforeEach(function(done){
        Product.create({name: 'foo', price: 2.99})
          .then(function(_product){
            product = _product;
            done();
          });
      });

      it('has a name of foo', function(){
        expect(product.name).to.equal('foo');
      });

      it('has a price of 2.99', function(){
        expect(product.price).to.equal(2.99);
      });

      it('has a quantity is 5', function(){
        expect(product.quantity).to.equal(5);
      });

      describe('product reviews', function(){
        it('a product has a collection of reviews', function(){
          expect(product.reviews).to.be.ok;
        });

        describe('adding a review', function(){
          var review, user;
          beforeEach(function(done){
            return mongoose.model('User').create({
              email: 'Moe@example.com',
              password: 'foobar'
            })
            .then(function(user){
              product.reviews.push({
                rating: 3,
                user: user
              });
            })
            .then(function(){
              return product.save()
            })
            .then(function(){
              return Product.findOne({name: 'foo'})
                .populate('reviews.user');
            })
            .then(function(product){
              review = product.reviews[0];
              done();
            }, done);
          });

          it('can be added', function(){
            expect(product.reviews.length).to.equal(1);
          });

          it('a review has a reviewDate', function(){
            expect(review.reviewDate).to.be.ok;
          });

          it('a review has a rating', function(){
            expect(review.rating).to.be.ok;
          });

          it('a review has a user', function(){
            expect(review.user.email).to.be.ok;
          });

        });
      
      });

    });


});
