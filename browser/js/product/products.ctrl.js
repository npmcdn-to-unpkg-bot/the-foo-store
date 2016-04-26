app.controller('ProductsCtrl', function($scope, ProductFactory, CartService, $http){

  $scope.addToCart = function(product){
    CartService.addProduct(product)
      .then(function(){
        $scope.message = product.name + ' has been added to your cart.';
      });
  };

  ProductFactory.fetchAll()
    .then(function(products){
      $scope.products = products;
    });
});
