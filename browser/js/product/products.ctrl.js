app.controller('ProductsCtrl', function($scope, ProductFactory, CartService, $http){

  $scope.addToCart = function(product){
    CartService.addProduct(product);
  };

  $scope.hasProduct = function(product){
    return CartService.hasProduct(product);
  }

  $scope.removeFromCart = function(product){
    CartService.removeProduct(product);
  };

  ProductFactory.fetchAll()
    .then(function(products){
      $scope.products = products;
    });
});
