app.config(function($stateProvider){
  $stateProvider
    .state('orders', {
      url: '/orders',
      resolve: {
        orders: function(OrderFactory){
          return OrderFactory.fetchAll();
        }
      },
      controller: 'OrdersController',
      templateUrl: '/js/order/orders.html'
    });

});
