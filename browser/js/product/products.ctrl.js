app.controller('ProductsCtrl', function($scope, ProductFactory, CartService, $http){

  $scope.addToCart = function(product){
    CartService.addProduct(product);
  };

  ProductFactory.fetchAll()
    .then(function(products){
      $scope.products = products;
    });
});
