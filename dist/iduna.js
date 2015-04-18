var iduna = (function () {
	'use strict';

	var iduna = {};

	iduna.selectors = [];
	iduna.settings = {
		'selector': '.iduna',
	}

	iduna.init = function (settings) {
		// Set settings
		if (settings !== undefined) {
			_.each(settings, function(value, key) {
				this.settings[key] = value;
			}, this);
		}

		// Build each Image Selector and append to collection
  	_.each($(this.settings['selector']), function(input) {
  		this.selectors.push( new Selector($(input)) );
  	}, this);

		console.log(this);

		return this;
	}

	/*
	 * Selector Object
	 * ----------------------------------------------------------------------
	 */
	var Selector = function () {
		var Selector = {};

		return Selector;
	}








	return iduna;
}());