app.factory('ProductFactory', function($http){
  return {
    fetchAll: function(){
      return $http.get('/api/products')
        .then(function(response){
          return response.data;
        });
    
    }
  };
});
