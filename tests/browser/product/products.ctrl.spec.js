describe('ProductsCtrl', function(){
  var ProductFactory, $controller, $scope, $q, $rootScope;
  beforeEach(module('FullstackGeneratedApp'));
  beforeEach(inject(function(_$controller_, _ProductFactory_, _$q_, _$rootScope_){
    $controller = _$controller_;
    ProductFactory = _ProductFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  it('exists', function(){
    var $scope = {};
    var productsCtrl = $controller('ProductsCtrl', {$scope: $scope});
    expect(productsCtrl).to.be.ok;
  });

  describe('the ProductFactory has two products', function(){
    it('the scope has two products', function(){
      var $scope = $rootScope.$new();
      ProductFactory.fetchAll = function(){
        return $q.when([
            {
              name: 'Foo',
              price: 3
            }, 
            {
              name: 'Bar',
              price: 9
            }
        ]);
      }
      var productsCtrl = $controller('ProductsCtrl', {$scope: $scope});
      $scope.$digest();
      expect($scope.products.length).to.equal(2);
    });
  });

});
