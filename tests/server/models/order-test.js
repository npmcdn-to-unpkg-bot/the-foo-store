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
                { product: product._id, quantity: 3 },
                { product: product._id, quantity: 3 }
              ]
            });
          })
          .then(function(order){
            return Order
              .findById(order._id)
              .populate(['user', 'lineItems.product'])
          })
          .then(function(_order){
            order = _order;
            done();
          }, done);
      
      });

      it('order has a user', function(){
        expect(order.user.email).to.equal('moe@example.com');
      });

      it('order has a default status of CART', function(){
        expect(order.status).to.equal('CART');
      });

      it('line items are combined', function(){
        expect(order.lineItems.length).to.eql(1);
      });

      it('line item product has the correct name', function(){
        expect(order.lineItems[0].product.name).to.equal('foo');
      });

      it('line item has the correct price', function(){
        expect(order.lineItems[0].price).to.equal(3);
      });

      it('line items are consolidated', function(){
        expect(order.lineItems[0].quantity).to.equal(6);
      });

      describe('creating an order', function(){
        beforeEach(function(done){
          order.createOrder()
            .then(function(_order){
              order = _order;
              done();
            });
        });

        it('changes status to order', function(){
          expect(order.status).to.equal('ORDER');
        });

        it('we have an order date', function(){
          expect(order.orderDate).to.be.ok;
        });

        describe('Order#getCart', function(){
          beforeEach(function(done){
            Order.getCart(user)
              .then(function(_order){
                order = _order;
                done();
              });
          });
          it('creates a cart if one does not exist', function(){
            expect(order.status).to.equal('CART');
            expect(order.orderDate).not.to.be.ok;
          });

          describe('a cart exists', function(){
            var cart;
            beforeEach(function(done){
              Order.getCart(user)
                .then(function(_cart){
                  cart = _cart;
                  done();
                });
            });
            it('the cart will be returned', function(){
              expect(cart.status).to.equal('CART');
              expect(cart.id).to.equal(order.id);
            });
          });
        });
      });

    });

});
