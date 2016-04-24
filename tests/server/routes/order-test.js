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
var request = require('supertest-as-promised')(app);


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
        var cart, cookie;
        return request
          .post('/login')
          .send(userInfo)
          .then(function(resp){
            cookie = resp.headers['set-cookie'][0];
            return request.post('/api/orders')
              .set('cookie', cookie);
          })
          .then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body.lineItems).to.eql([]);
            expect(response.body.orderDate).not.to.be.ok;
            return response.body;
          })
          .then(function (cart) {
            cart.lineItems.push({ product: product, quantity: 3 });
            return request.put('/api/orders/' + cart._id)
              .set('cookie', cookie)
              .send(cart);
          })
          .then(function (resp) {
            cart = resp.body;
            cart.lineItems.push({ product: product, quantity: 3 });
            cart.status = 'ORDER';
            return request.put('/api/orders/' + cart._id)
              .set('cookie', cookie)
              .send(cart);
          })
          .then(function (resp) {
            expect(resp.body.orderDate).to.be.ok;
            expect(resp.body.lineItems[0].quantity).to.equal(3);
            return request.get('/api/orders/')
              .set('cookie', cookie)
          })
          .then(function (resp) {
            expect(resp.body.length).to.equal(1);
            expect(resp.body[0].status).to.equal('ORDER'); 
          });
      });
    });

    describe('creating a cart and adding items', function(){

      it('return a cart', function () {
        var cart, cookie;
        return request
          .post('/login')
          .send(userInfo)
          .then(function(resp){
            cookie = resp.headers['set-cookie'][0];
            return request.post('/api/orders')
              .set('cookie', cookie);
          })
          .then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body.lineItems).to.eql([]);
            return response.body;
          })
          .then(function (cart) {
            cart.lineItems.push({ product: product, quantity: 3 });
            return request.put('/api/orders/' + cart._id)
              .set('cookie', cookie)
              .send(cart);
          })
          .then(function (resp) {
            expect(resp.status).to.equal(200);
            expect(resp.body.lineItems.length).to.equal(1);
            expect(resp.body.lineItems[0].quantity).to.equal(3);
          });
      });
    });

	});

});
