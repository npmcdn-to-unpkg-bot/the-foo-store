describe('ProductFactory', function(){
  var ProductFactory, $httpBackend;
  beforeEach(module('FullstackGeneratedApp'));

  beforeEach(inject(function(_ProductFactory_, _$httpBackend_){
    ProductFactory = _ProductFactory_;
    $httpBackend = _$httpBackend_;
  }));

  it('exists', function(){
    expect(ProductFactory).to.be.ok;
  });

  describe('fetchAll', function(){
    var product;
    it('returns list of products', function(){
      $httpBackend.whenGET('/api/products')
        .respond([{}, {}]);
      ProductFactory.fetchAll()
        .then(function(_products){
          products = _products;
        });
      $httpBackend.flush();
      expect(products.length).to.equal(2);
    });
  });
});
