app.controller('OrdersController', function($scope, orders, reviewMap, $http, toastr, Session){
  $scope.orders = orders;
  $scope.getReview = function(product){
    return reviewMap[product._id];
  };

  $scope.isAdmin = function(){
    return Session.user && Session.user.isAdmin; 
  };

  $scope.createShipment = function(order){
    $http.put('/api/orders/' + order._id, { status: 'SHIPPED' })
      .then(function(){
        toastr.success('Order has been shipped.');
        order.status = 'SHIPPED';
      });
  };

  $scope.ratingChoices = [1, 2, 3, 4, 5];

  $scope.deleteReview = function(product){
      var review = reviewMap[product._id];
      $http.delete('/api/products/' + product._id + '/reviews/' + review._id)
        .then(function(){
          toastr.warning('Your review has been removed.');
          delete reviewMap[product._id];
        });
  
  };

  $scope.rateProduct = function(product, rating){
    if(reviewMap[product._id]){
      var review = reviewMap[product._id];
      $http.put('/api/products/' + product._id + '/reviews/' + review._id, { rating: rating })
        .then(function(response){
          return response.data; 
        })
        .then(function(review){
          reviewMap[product._id] = review;
          toastr.success('Thanks for your review');
        });
    }
    else {
      $http.post('/api/products/' + product._id + '/reviews', { rating: rating })
        .then(function(response){
          return response.data; 
        })
        .then(function(review){
          toastr.success('Thanks for your review');
          reviewMap[product._id] = review;
        });
    }
  };
});
