app.directive('cartStatus', function(CartService, $state){
  return {
    template: '<span ng-click="goToCart()" ng-if="itemCount()">{{ itemCount() }}</span>',
    link: function(scope){
      scope.itemCount = function(){
        return CartService.itemCount();
      };
      scope.goToCart = function(){
        $state.go('cart');
      }
    }
  };
});
