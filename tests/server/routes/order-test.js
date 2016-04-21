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

	describe('Authenticated request', function () {
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

		beforeEach('Create loggedIn user agent and authenticate', function () {
		});

		it('should get with 200 response and with an array as the body', function () {
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
          return response.body
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
			  })
		});

	});

});
