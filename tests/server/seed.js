require('../../server/db/models');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Order = mongoose.model('Order');

module.exports = function(){
  var seedUsers = function () {

      var users = [
          {
              email: 'moe@example.com',
              password: 'password'
          },
          {
              email: 'larry@example.com',
              password: 'password'
          },
          {
              email: 'testing@fsa.com',
              password: 'password'
          },
          {
              email: 'obama@gmail.com',
              password: 'potus',
              isAdmin: true
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

  var moe, foo, bar, larry;


      return seedUsers()
      .then(function (users) {
        moe = users[0];
        larry = users[1];
        console.log(larry);
        return seedProducts();
      })
      .then(function (products) {
        foo = products[0];
        bar = products[1];
        return Order.getCart(moe)
          .then(function(cart){
            cart.lineItems.push({ product: foo, quantity: 3 });
            cart.lineItems.push({ product: bar, quantity: 6 });
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
        return Order.getCart(larry)
          .then(function(cart){
            cart.lineItems.push({ product: foo, quantity: 3 });
            cart.lineItems.push({ product: bar, quantity: 6 });
            return cart.save();
          })
          .then(function(cart){
            return cart.createOrder();
          })
          .then(function(){
            foo.reviews.push({ user: larry, rating: 2 });
            return foo.save();
          });
      });
};
