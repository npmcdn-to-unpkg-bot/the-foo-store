describe('CartService', function(){
  var CartService, $q, $rootScope;
  beforeEach(module('FullstackGeneratedApp'));
  beforeEach(inject(function(_CartService_, _$q_, _$rootScope_){
    CartService = _CartService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('before cart is initiated', function(){
    var cart, itemCount;
    beforeEach(function(){
      cart = CartService.getCart();
    });

    it('the item count is zero', function(){
      expect(cart).not.to.be.ok;
      expect(CartService.itemCount()).not.to.be.ok;
      expect(CartService.total()).not.to.be.ok;
    });
  });

  describe('after cart is initiated', function(){
    var cart;
    beforeEach(function(){
      CartService.loadCart = function(){
        return $q.when({ lineItems: [
          { product: { _id: 3, price: 2 }, quantity: 5 },
          { product: {_id: 5, price: 8 }, quantity: 3 },
        
        ]});
      };
      CartService.init();
      $rootScope.$digest();
      cart = CartService.getCart();
    });

    it('the cart starts out as undefined', function(){
      expect(cart).to.be.ok;
      expect(CartService.itemCount()).to.equal(8);
      expect(CartService.total()).to.equal(34);
    });
  });

});
