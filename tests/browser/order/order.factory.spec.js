var TEST_MODE = true;
describe('Order Factory', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var OrderFactory, $httpBackend, Cart;
    beforeEach(inject(function (_$httpBackend_, _OrderFactory_, _Cart_) {
        OrderFactory = _OrderFactory_;
        $httpBackend = _$httpBackend_;
        Cart = _Cart_;
    }));

    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('exists', function(){
      expect(OrderFactory).to.be.ok;
    });

    describe('#createCart', function(){
      var cart;
      it('returns a cart', function(){
        $httpBackend.expectPOST('/api/orders')
          .respond({
            orderId: 3,
            lineItems: []
          });
        OrderFactory.createCart()
          .then(function(_cart){
            cart = _cart;
          });
        $httpBackend.flush();
        expect(cart).to.be.instanceof(Cart);
      });
    
    });


});
