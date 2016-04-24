app.factory('OrderFactory', function ($http) {
  return {
    fetchAll: function(){
      return $http.get('/api/orders')
        .then(function(response){
          return response.data;
        });
    }
  };
});
