app.directive('cartStatus', function(CartService, $state){
  return {
    template: '<span class="label label-primary" ng-click="goToCart()" ng-if="hasCart()">{{ itemCount() }}</span>',
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
