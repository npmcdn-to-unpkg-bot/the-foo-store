describe('cartStatus directive', function(){
  var $compile, CartService, $rootScope, $state;
  beforeEach(module('FullstackGeneratedApp'));
  beforeEach(inject(function($injector){
    $compile = $injector.get('$compile');
    CartService = $injector.get('CartService');
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
  }));

  describe('the cart is not defined', function(){
    var html;
    beforeEach(function(){
      var $scope = $rootScope.$new();
      var elem = $compile('<cart-status></cart-status')($scope);
      $scope.$digest();
      html = elem.text();
    });
    it('is not displayed', function(){
      expect(html).to.equal('');
    });
  });

  describe('the cart is defined', function(){
    var html, $scope;
    beforeEach(function(){
      var cart = {};
      CartService.itemCount = function(){
        return 10;
      };

      CartService.getCart = function(){
        return cart;
      }
      $scope = $rootScope.$new();
      var elem = $compile('<cart-status></cart-status')($scope);
      $scope.$digest();
      html = elem.text();
    
    });
    it('is not displayed', function(){
      expect(html).to.equal('10');
    });

    describe('clicking on the cart-status', function(){
      var state;
      beforeEach(function(){
        $state.go = function(_state){
          state = _state;
        }
        $scope.goToCart();
      });
      it('takes you to the cart', function(){
        expect(state).to.equal('cart');
      });
    });
  });

});
