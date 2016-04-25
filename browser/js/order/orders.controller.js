app.controller('OrdersController', function($scope, orders, reviewMap){
  $scope.orders = orders;
  $scope.getReview = function(product){
    return reviewMap[product._id];
  };
});
