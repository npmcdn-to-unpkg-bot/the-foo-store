// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var app = require('../../../server/app');
var agent = require('supertest-as-promised').agent(app);


describe('Review Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

  var moe, foo, bar, review;

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
        review = foo.reviews.filter(function(review){
          return review.user.toString() === moe.id;
        })[0];
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
        return agent 
          .post('/login')
          .send({ email: 'moe@example.com', password: 'password' })
          .expect(200)
          .then(function(resp){
            return agent.post('/api/products/' + bar._id + '/reviews').send({ rating: 4 });
          })
          .then(function(resp){
            expect(resp.body.rating).to.equal(4);
            expect(resp.body._id).to.be.ok;
          });
    });
  });

  describe('for a product they have reviewed', function(){
    it('can update review', function(){
        return agent 
          .post('/login')
          .send({ email: 'moe@example.com', password: 'password' })
          .expect(200)
          .then(function(resp){
            return agent.put('/api/products/' + foo._id + '/reviews/' + review._id)
              .send({ rating: 1 });
          })
          .then(function(resp){
            expect(resp.body.rating).to.equal(1);
            expect(resp.body._id).to.be.ok;
          });
    });
    it('can delete the review', function(){
        return agent 
          .post('/login')
          .send({ email: 'moe@example.com', password: 'password' })
          .expect(200)
          .then(function(resp){
            return agent.delete('/api/products/' + foo._id + '/reviews/' + review._id);
          })
          .then(function(resp){
            expect(resp.status).to.equal(204);
          });
    });
  });
});
