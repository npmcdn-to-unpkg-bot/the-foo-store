app.run(function(CartService, $rootScope, AUTH_EVENTS){
  $rootScope.$on(AUTH_EVENTS.loginSuccess, CartService.init);
});

app.factory('CartService', function($http){
  var _cart;
  return {
    loadCart: function(){
      return $http.post('/api/orders')
        .then(function(response){
          return response.data;
        });
    },
    itemCount: function(){
      if(!!_cart)
        return _cart.lineItems.reduce(function(memo, lineItem){
          memo += lineItem.quantity;
          return memo;
        }, 0); 
    },
    getCart: function(){
      return _cart;
    },
    init: function(){
      this.loadCart()
        .then(function(cart){
          _cart = cart;
        });
    }
  };
});
