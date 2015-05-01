var iduna = (function () {
	'use strict';

	var iduna = {};

	iduna.selectors = [];
	iduna.settings = {};

	iduna.init = function (settings) { 
		// Set settings
		if (settings !== undefined) {
			_.each(settings, function(value, key) {
				this.settings[key] = value;
			}, this);
		}

		// Build Selector out of each Image Selector
  	_.each( $('select.iduna'), function(rawSelect) {
  		this.selectors.push( new Selector( $(rawSelect) ) );
  	}, this);

  	// Setup Modal 
		this.modal = new Modal();

		return this;
	};

	/**
	 * Selector Object
	 - ----------------------------------------------------------------------
	 */
	var Selector = function (rawElement) {
		this.rawElement = rawElement;

		// Define Selector Properties
		this.name = rawElement.attr('name');
		this.selected = [];
		this.data = getDataFromSelector(this.rawElement);
		this.isHidden = true;

		// Determine if multiple
		this.isMultiple = false;
		if ( $(rawElement).attr('multiple') !== undefined ) {
			this.isMultiple = true;
		}

		this.elements = renderSelector(this);
		console.log(this);
	};

	/**
	 * Show/Hide the selector
	 */
	Selector.prototype.open = function() {
		iduna.modal.show(this);
	};


	/**
	 * Modal Object
	 - ----------------------------------------------------------------------
	 */
	var Modal = function () {
		var self = this;
		this.currentSelector = false;
		this.isHidden = false;

		// Build DOM Elements
		var elements = {};
		elements.wrap = $('<div class="idunaModal"></div>').appendTo("body");
		elements.pane = $('<div class="idunaModal-pane"></div>').appendTo(elements.wrap);
		elements.header = $('<div class="idunaModal-header">Header</div>').appendTo(elements.pane);
		elements.body = $('<div class="idunaModal-body">Body</div>').appendTo(elements.pane);
		elements.footer = $('<div class="idunaModal-footer">Footer</div>').appendTo(elements.pane);
		
		this.elements = elements;

		$(elements.wrap).click( function (event) {
			if ($(event.target).is(this)) {
				self.hide();
			}
		});







		this.hide();
	};

	Modal.prototype.hide = function () {
		$(this.elements.wrap).addClass('hidden');
		this.isHidden = true;
		this.currentSelector = false;
	};

	Modal.prototype.show = function (selector) {
		this.currentSelector = selector;
		$(this.elements.wrap).removeClass('hidden');
		this.isHidden = false;
		console.log(this.currentSelector);
	};

	/**
	 * Helper Functions
	 - ----------------------------------------------------------------------
	 */

	/**
	 * Retrieves the data from the given element
	 * @param  {element} selector - element to get data from
	 * @return {array}            - list of image data
	 */
	var getDataFromSelector = function (selector) {
		var data = [];
		
		_.each( $(selector).children('option'), function (option) {
			var html = $(option).html();
			var value = !_.isEmpty( $(option).attr('value') ) ? $(option).attr('value'): html;
			var src = !_.isEmpty( $(option).attr('src') ) ? $(option).attr('src'): html;

			data.push({
				'value': value,
				'label': html,
				'src': src,
			});
		});

		return data;
	};

	/**
	 * renders the selector and returns its elements
	 * @param  {Selector} selector - selector Model
	 * @return {Object} - containing all relevant elements
	 */
	var renderSelector = function (selector) {
		// Create an elementTree to store all elements
		var elements = {};

		// Hide the actual element
		selector.rawElement.css('display', 'none');

		// Create Wrapper
		selector.rawElement.wrap('<div class="idunaWrap"></div>');
		elements.wrap = selector.rawElement.parent();

		// Create toggle button
		var openButton = $('<div class="btn btn-primary">Select Images</div>').appendTo(elements.wrap);
		openButton.click( function(event) {
			selector.open();
		});

		return elements;
	};




	return iduna;
}());