describe('Order Factory', function () {
  var $httpBackend, OrderFactory;
  beforeEach(module('FullstackGeneratedApp'));
  beforeEach(inject(function(_$httpBackend_, _OrderFactory_){
    $httpBackend = _$httpBackend_;
    OrderFactory = _OrderFactory_;
  }));

  describe('fetchAll', function(){
    it('calls /api/orders', function(){
      var orders;

      $httpBackend.expectGET('/api/orders').respond([{}, {}]);
      OrderFactory.fetchAll()
        .then(function(_orders){
          orders = _orders;
        });
      $httpBackend.flush();
      expect(orders.length).to.equal(2);
    });
  });
});
