app.run(function(OrderFactory, $rootScope, AUTH_EVENTS){
  $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
    OrderFactory.createCart();
  });
});

app.factory('OrderFactory', function ($http, Cart, $rootScope, AUTH_EVENTS) {
  var cart = new Cart();

  return {
    getCart: function(){
      return cart;
    },
    createCart: function(){
      var that = this;
      return $http.post('/api/orders')
        .then(function(response){
          angular.copy(new Cart(response.data), cart);
          return that.getCart();
        });
    }
  };
});
