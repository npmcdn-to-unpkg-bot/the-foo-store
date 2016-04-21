describe('foo', function(){
  beforeEach(module('FullstackGeneratedApp'));

  var $httpBackend;
  var $rootScope;
  beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
  }));

  it('works', function(){
    expect(1 + 1).to.equal(2);
    expect($httpBackend).to.be.ok;
  
  });
});
