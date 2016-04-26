describe('Orders Controller', function () {
  var $httpBackend, $controller, $rootScope;
  beforeEach(module('FullstackGeneratedApp'));
  beforeEach(inject(function(_$httpBackend_, _$controller_, _$rootScope_){
    $httpBackend = _$httpBackend_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe('scope', function(){
    it('calls /api/orders', function(){
      var orders = [];
      var $scope = $rootScope.$new();
      $controller('OrdersController', { $scope: $scope, orders: orders, reviewMap: {} });
      expect($scope.orders).to.equal(orders);
    });
  });
});
