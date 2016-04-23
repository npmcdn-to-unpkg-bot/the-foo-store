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
    total: function(){
      if(!!_cart)
        return _cart.lineItems.reduce(function(memo, lineItem){
          memo += lineItem.quantity * lineItem.product.price;
          return memo;
        }, 0); 
    },
    itemCount: function(){
      if(!!_cart)
        return _cart.lineItems.reduce(function(memo, lineItem){
          memo += lineItem.quantity;
          return memo;
        }, 0); 
    },
    removeProduct: function(product){
      var cartCopy = angular.copy(this.getCart());
      var index;
      cartCopy.lineItems.forEach(function(lineItem, idx){
        if(lineItem.product._id === product._id)
          index = idx;
      });
      cartCopy.lineItems.splice(index, 1);
      return $http.put('/api/orders/' + cartCopy._id, cartCopy)
        .then(function(response){
          _cart = response.data;
        });
    },
    addProduct: function(product){
      var cartCopy = angular.copy(this.getCart());
      var products = cartCopy.lineItems.filter(function(lineItem){
        return lineItem.product._id === product._id;
      });
      if(products.length === 0)
        cartCopy.lineItems.push({quantity: 1, product: product});
      else
        products[0].quantity++;
      return $http.put('/api/orders/' + cartCopy._id, cartCopy)
        .then(function(response){
          _cart = response.data;
        });
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
