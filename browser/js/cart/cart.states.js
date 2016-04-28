app.config(function($stateProvider){
  $stateProvider
    .state('cart', {
      url: '/cart',
      templateUrl: 'js/cart/cart.html',
      controller: function($scope, CartService){
        $scope.cart = CartService.getCart;
        $scope.remove = function(product){
          CartService.removeProduct(product);
        };
        $scope.checkout = function(){
          CartService.checkout();
        };
      }
    });

});
