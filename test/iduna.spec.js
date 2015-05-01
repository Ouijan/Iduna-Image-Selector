(function (Iduna) {
	'use strict';

	describe("Iduna", function() {

	  it("exists on global scope", function() {
	  	expect(Iduna).not.toBeUndefined();
	  });

	  it("has init method", function() {
	  	expect(Iduna.init()).not.toBeUndefined();
	  });

	  it("has settings prpoerty", function() {
	  	expect(Iduna.settings).not.toBeUndefined();
	  });
	  	


	});

}(Iduna));