app.controller('ProductsCtrl', function($scope, ProductFactory){

  $scope.addToCart = function(product){
    console.log(product);
  };

  ProductFactory.fetchAll()
    .then(function(products){
      $scope.products = products;
    });

});
