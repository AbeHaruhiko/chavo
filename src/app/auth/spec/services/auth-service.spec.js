describe('Service: authService', function() {
  var auth;
  beforeEach(module('chavo'));
  beforeEach(inject(function(_authService_) {
  auth = _authService_;
  }));

  it('should attach a list of awesomeThings to the service', function() {
    expect(auth.awesomeThings.length).toBe(3);
  });

});
