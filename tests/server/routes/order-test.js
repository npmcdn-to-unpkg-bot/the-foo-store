// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = require('supertest-as-promised').agent(app);


describe('Orders Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('As an authorized user', function () {
    var product;


		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
		};

    var productInfo = {
      name: 'Foo',
      price: 3,
      quantity: 5
    };

		beforeEach('Create a product', function (done) {
			Product.create(productInfo)
        .then(function(_product){
          product = _product;
          done();
        });
		});

		beforeEach('Create a user', function (done) {
			User.create(userInfo, done);
		});

    describe('creating a cart and adding items and checking out', function(){

      it('will create an order', function () {
        var cart;
        return agent 
          .post('/login')
          .send(userInfo)
          .expect(200)
          .then(function(resp){
            return agent.post('/api/orders')
              .send({
                lineItems: [
                  { product: product, quantity: 3 }
                ]
              });
          })
          .then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body.lineItems.length).to.equal(1);
            expect(response.body.orderDate).not.to.be.ok;
            return response.body;
          })
          .then(function (cart) {
            cart.lineItems[0].quantity = 2;
            return agent.put('/api/orders/' + cart._id)
              .send(cart);
          })
          .then(function (resp) {
            cart = resp.body;
            expect(cart.lineItems[0].quantity).to.equal(2);
            cart.lineItems.push({ product: product, quantity: 3 });//this should be ignored
            cart.status = 'ORDER';
            return agent.put('/api/orders/' + cart._id)
              .send(cart);
          })
          .then(function (resp) {
            expect(resp.body.orderDate).to.be.ok;
            expect(resp.body.lineItems[0].quantity).to.equal(2);
            return agent.get('/api/orders/');
          })
          .then(function (resp) {
            expect(resp.body.length).to.equal(1);
            expect(resp.body[0].status).to.equal('ORDER'); 
          });
      });
    });

	});

});
