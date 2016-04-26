app.controller('OrdersController', function($scope, orders, reviewMap, $http){
  $scope.orders = orders;
  $scope.getReview = function(product){
    return reviewMap[product._id];
  };

  $scope.ratingChoices = [1, 2, 3, 4, 5];

  $scope.rateProduct = function(product, rating){
    if(reviewMap[product._id]){
      var review = reviewMap[product._id];
      $http.put('/api/products/' + product._id + '/reviews/' + review._id, { rating: rating })
        .then(function(response){
          return response.data; 
        })
        .then(function(review){
          reviewMap[product._id] = review;
        });
    }
    else {
      $http.post('/api/products/' + product._id + '/reviews', { rating: rating })
        .then(function(response){
          return response.data; 
        })
        .then(function(review){
          reviewMap[product._id] = review;
        });
    }
  };
});
