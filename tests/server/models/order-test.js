var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Order = mongoose.model('Order');
var User = mongoose.model('User');
var Product = mongoose.model('Product');

describe('Order model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Order).to.be.a('function');
    });

    describe('a valid order', function(){
      var order, user, product;

      beforeEach(function(done){
        User.create(
            {
              email: 'moe@example.com', 
              password: 'foobar'
            })
          .then(function(_user){
            user = _user;
            return Product.create({ name: 'foo', price: 3 });
          })
          .then(function(_product){
            product = _product;
            return Order.create({
              user: user._id,
              lineItems: [
                { product: product._id, quantity: 3 }
              ]
            });
          })
          .then(function(order){
            return Order
              .findById(order._id)
              .populate([
                  {
                    path: 'user'
                  },
                  { 
                    path: 'lineItems',
                    populate: {
                      path: 'product',
                      model: Product 
                    } 
                  }
              ])
              //.populate('lineItems.product');
          })
          .then(function(_order){
            order = _order;
            done();
          }, done)
      
      });

      it('has a valid user', function(){
        expect(order.user.email).to.equal('moe@example.com');
      });

      it('has one line items', function(){
        expect(order.lineItems.length).to.eql(1);
      });

      it('line item is foo', function(){
        expect(order.lineItems[0].product.name).to.equal('foo');
      });

    });

});
