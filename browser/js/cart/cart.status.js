app.directive('cartStatus', function(CartService, $state){
  return {
    templateUrl: 'js/cart/cart.status.html',
    replace: true,
    link: function(scope){
      scope.itemCount = function(){
        return CartService.itemCount();
      };
      scope.hasCart = function(){
        return CartService.getCart();
      };
      scope.goToCart = function(){
        $state.go('cart');
      };
    }
  };
});
