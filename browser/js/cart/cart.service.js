app.run(function(CartService, $rootScope, AUTH_EVENTS){
  $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
    CartService.init();
  });
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(){
    CartService.reset();
  });
});


app.factory('CartService', function($q, $http, $window, AuthService){
  var _cart;
  if(!$window.localStorage.getItem('cart')){
    $window.localStorage.setItem('cart', JSON.stringify({ lineItems: []}));
  }
  _cart = JSON.parse($window.localStorage.getItem('cart'));
  return {
    loadCart: function(){
      return $http.post('/api/orders', JSON.parse($window.localStorage.getItem('cart')))
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
      if(!AuthService.isAuthenticated()){
        $window.localStorage.setItem('cart', JSON.stringify(cartCopy))
          _cart = cartCopy;
        return $q.when(_cart);
      }
      return $http.put('/api/orders/' + cartCopy._id, cartCopy)
        .then(function(response){
          _cart = response.data;
        });
    },
    hasProduct: function(product){
      if(!!_cart)
        return _cart.lineItems.filter(function(lineItem){
        return lineItem.product._id === product._id;
      }).length > 0;
    
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
      if(!AuthService.isAuthenticated()){
        $window.localStorage.setItem('cart', JSON.stringify(cartCopy))
          _cart = cartCopy;
        return $q.when(_cart);
      }
      return $http.put('/api/orders/' + cartCopy._id, cartCopy)
        .then(function(response){
          _cart = response.data;
        });
    },
    checkout: function(){
      _cart.status = 'ORDER';
      var that = this;
      return $http.put('/api/orders/' + _cart._id, _cart)
        .then(function(response){
          that.init();
        });
    },
    getCart: function(){
      return _cart;
    },
    reset: function(){
      $window.localStorage.setItem('cart', JSON.stringify({ lineItems: []}));
    _cart = JSON.parse($window.localStorage.getItem('cart'));
    },
    init: function(){
      this.loadCart()
        .then(function(cart){
          $window.localStorage.removeItem('cart');
          _cart = cart;
        });
    }
  };
});
