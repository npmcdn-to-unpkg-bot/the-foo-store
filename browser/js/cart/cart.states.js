app.config(function($stateProvider){
  $stateProvider
    .state('cart', {
      url: '/cart',
      templateUrl: 'js/cart/cart.html',
      controller: function($scope, CartService, toastr){
        $scope.cart = CartService.getCart;
        $scope.remove = function(product){
          CartService.removeProduct(product)
            .then(function(){
              toastr.warning('Product has been removed');
            
            });
        };
        $scope.checkout = function(){
          CartService.checkout();
        };
      }
    });

});
