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


describe('Review Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

  var moe, foo, bar;

  beforeEach(function(done){
    require('../seed')()
      .then(function(){
        done();
      });
  });
  
  beforeEach(function(done){
    User.findOne({ email: 'moe@example.com' })
      .then(function(_moe){
        moe = _moe;
        done();
      });
  });

  beforeEach(function(done){
    Product.findOne({ name: 'Foo' })
      .then(function(_foo){
        foo = _foo;
        done();
      });
  });

  beforeEach(function(done){
    Product.findOne({ name: 'Bar' })
      .then(function(_bar){
        bar = _bar;
        done();
      });
  });

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

  describe('for a product they have not reviewed', function(){
    it('can review', function(){
        return request
          .post('/login')
          .send({ email: 'moe@example.com', password: 'password' })
          .then(function(resp){
            expect(resp.status).to.equal(200);
            var cookie = resp.headers['set-cookie'][0];
            return request.post('/api/products/' + bar._id + '/reviews')
              .set('cookie', cookie)
              .send({ rating: 4 });
          })
          .then(function(resp){
            expect(resp.status).to.equal(200);
            expect(resp.body.rating).to.equal(4);
          })
    });
  });

  describe('for a product they have reviewed', function(){
    it('can not review', function(){
        return request
          .post('/login')
          .send({ email: 'moe@example.com', password: 'password' })
          .then(function(resp){
            expect(resp.status).to.equal(200);
            var cookie = resp.headers['set-cookie'][0];
            return request.post('/api/products/' + foo._id + '/reviews')
              .set('cookie', cookie)
              .send({ rating: 4 });
          })
          .then(function(resp){
            expect(resp.status).to.equal(404);
          });
    });
  });

});
