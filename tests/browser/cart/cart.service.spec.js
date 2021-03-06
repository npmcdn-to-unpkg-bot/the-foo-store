describe('CartService', function(){
  var CartService, $q, $rootScope, $httpBackend, AuthService;
  beforeEach(module('FullstackGeneratedApp'));
  beforeEach(inject(function(_CartService_, _$q_, _$rootScope_, _$httpBackend_, _AuthService_){
    CartService = _CartService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    AuthService = _AuthService_;
  }));
  
  describe('before cart is initiated', function(){
    var cart;
    beforeEach(function(){
      cart = CartService.getCart();
    });

    it('the item count is zero', function(){
      expect(CartService.itemCount()).to.equal(0);
      expect(CartService.total()).to.equal(0);
    });
  });

  describe('checkout out a cart', function(){
    var cart = {_id: 3, lineItems: [ {} ]};

    it('makes an api call with the correct status', function(){
      CartService.loadCart = function(){
        return $q.when(cart);
      };
      CartService.init();
      $rootScope.$digest();
      var expectedPayload = {"_id":3,"lineItems":[{}],"status":"ORDER"}; 
      $httpBackend.expectPUT('/api/orders/3', expectedPayload).respond({});
      CartService.checkout();
      var spy = sinon.spy(CartService, 'init');
      $httpBackend.flush();
      expect(spy.called).to.be.ok;
    });
  });

  describe('after cart is initiated', function(){
    var cart;
    beforeEach(function(){
      CartService.loadCart = function(){
        return $q.when({ _id: 7, lineItems: [
          { product: { _id: 3, price: 2 }, quantity: 5 },
          { product: {_id: 5, price: 8 }, quantity: 3 },
        
        ]});
      };
      AuthService.isAuthenticated = function(){
        return $q.when(true);
      };
      CartService.init();
      $rootScope.$digest();
      cart = CartService.getCart();
    });

    it('the cart has an itemCount and total', function(){
      expect(cart).to.be.ok;
      expect(CartService.itemCount()).to.equal(8);
      expect(CartService.total()).to.equal(34);
    });

    describe('adding a product which is not in the cart', function(){
      beforeEach(function(){
        CartService.addProduct({ _id: 6 });
        var expectedPayload = {"_id":7,"lineItems":[{"product":{"_id":3,"price":2},"quantity":5},{"product":{"_id":5,"price":8},"quantity":3},{ quantity: 1, product: {"_id":6}}]};
        
        $httpBackend.expectPUT('/api/orders/7', expectedPayload)
          .respond({ _id: 7, lineItems: [
          { product: { _id: 3, price: 2 }, quantity: 5 },
          { product: {_id: 5, price: 8 }, quantity: 3 },
          { product: {_id: 6, price: 8 }, quantity: 1 },
        
        ]});
        cart = CartService.getCart();
        $httpBackend.flush();
      });

      it('the cart is updated with a new lineItem', function(){
        expect(CartService.itemCount()).to.equal(9);
        expect(CartService.total()).to.equal(42);
      });
    });

    describe('adding a product which is in the cart', function(){
      beforeEach(function(){
        CartService.addProduct({ _id: 5 });
        var expectedPayload = {"_id":7,"lineItems":[{"product":{"_id":3,"price":2},"quantity":5},{"product":{"_id":5,"price":8},"quantity":4}]};
      
        $httpBackend.expectPUT('/api/orders/7', expectedPayload)
          .respond({ _id: 7, lineItems: [
          { product: { _id: 3, price: 2 }, quantity: 5 },
          { product: {_id: 5, price: 9 }, quantity: 4 }
        
        ]});
        cart = CartService.getCart();
        $httpBackend.flush();
      });
      it('the cart is updated with a new lineItem', function(){
        expect(CartService.itemCount()).to.equal(9);
        expect(CartService.total()).to.equal(46);
      });
    });
    describe('removing a product which is in the cart', function(){
      beforeEach(function(){
        CartService.removeProduct({ _id: 5 });
        var expectedPayload = {"_id":7,"lineItems":[{"product":{"_id":3,"price":2},"quantity":5}]};
      
        $httpBackend.expectPUT('/api/orders/7', expectedPayload)
          .respond({ _id: 7, lineItems: [
          { product: { _id: 3, price: 2 }, quantity: 5 }
        
        ]});
        cart = CartService.getCart();
        $httpBackend.flush();
      });
      it('the cart is updated with a new lineItem', function(){
        expect(CartService.itemCount()).to.equal(5);
        expect(CartService.total()).to.equal(10);
      });
    });
  });

});
