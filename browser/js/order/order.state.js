app.config(function($stateProvider){
  $stateProvider
    .state('orders', {
      url: '/orders',
      resolve: {
        orders: function(OrderFactory){
          return OrderFactory.fetchAll();
        },
        reviewMap: function(AuthService, ProductFactory){
          var user = user;
          return AuthService.getLoggedInUser()
            .then(function(_user){
              user = _user;
              return ProductFactory.fetchAll()
            })
            .then(function(products){
              return products.reduce(function(memo, product){
                product.reviews.forEach(function(review){
                  if(review.user === user._id)
                    memo[product._id] = review;
                });
                return memo;
              }, {});
            });
        }
      },
      controller: 'OrdersController',
      templateUrl: '/js/order/orders.html'
    });

});
