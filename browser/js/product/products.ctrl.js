app.controller('ProductsCtrl', function($scope, ProductFactory, OrderFactory, $http){

  $scope.addToCart = function(product){
    var cart = OrderFactory.getCart();
    cart.lineItems.push({product: product._id, quantity: 1});
    OrderFactory.updateCart();
  };

  ProductFactory.fetchAll()
    .then(function(products){
      $scope.products = products;
    });

});
