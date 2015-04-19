(function (iduna) {
	'use strict';

	describe("Iduna", function() {

	  it("exists on global scope", function() {
	  	expect(iduna).not.toBeUndefined();
	  });

	  it("has init method", function() {
	  	expect(iduna.init()).not.toBeUndefined();
	  });

	  it("has settings prpoerty", function() {
	  	expect(iduna.settings).not.toBeUndefined();
	  });
	  
	  




	});

}(iduna));