app.controller('ProductsCtrl', function($scope, ProductFactory, CartService, $http, toastr, AuthService, Session){
  $scope.newProduct = {};

  $scope.createProduct = function(){
    $http.post('/api/products', $scope.newProduct)
      .then(function(response){
        $scope.products.push(response.data);
        $scope.newProduct = {};
      });
  };

  $scope.isAdmin = function(){
    return Session.user && Session.user.isAdmin; 
  };

  $scope.addToCart = function(product){
    CartService.addProduct(product)
      .then(function(){
        var cart = CartService.getCart();
        var lineItem = cart.lineItems.filter(function(lineItem){
          return lineItem.product._id === product._id;
        })[0];
        toastr.success('has been added to your cart ('+ lineItem.quantity + ')', product.name );
      });
  };

  ProductFactory.fetchAll()
    .then(function(products){
      $scope.products = products;
    });
});
