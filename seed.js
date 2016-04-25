/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Order = mongoose.model('Order');

var wipeCollections = function () {
    var removeUsers = User.remove({});
    var removeOrders = Order.remove({});
    var removeProducts = Product.remove({});
    return Promise.all([
        removeUsers,
        removeProducts,
        removeOrders
    ]);
};

var seedUsers = function () {

    var users = [
        {
            email: 'moe@example.com',
            password: 'password'
        },
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.create(users);

};

var seedProducts = function () {

    var products = [
        {
          name: 'Foo',
          price: 5
        },
        {
          name: 'Bar',
          price: 9
        },
        {
          name: 'Buzz',
          price: 8
        }
    ];

    return Product.create(products);

};

var moe, foo;

connectToDb
    .then(function () {
        return wipeCollections();
    })
    .then(function () {
        return seedUsers();
    })
    .then(function (users) {
      moe = users[0];
      return seedProducts();
    })
    .then(function (products) {
      //add an order and a review for moe
      foo = products[0];
      return Order.getCart(moe)
        .then(function(cart){
          cart.lineItems.push({ product: foo, quantity: 3 });
          return cart.save();
        })
        .then(function(cart){
          return cart.createOrder();
        })
        .then(function(){
          foo.reviews.push({ user: moe, rating: 4 });
          return foo.save();
        });
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
