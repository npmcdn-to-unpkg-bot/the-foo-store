app.directive('cartStatus', function(CartService, $state){
  return {
    template: '<li ng-if="hasCart()"><a ui-sref="cart" >Cart ({{ itemCount() }} items)</a></li>',
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
