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

    });


});
