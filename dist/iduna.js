var iduna = (function () {
	'use strict';

	var iduna = {};

	iduna.selectors = [];
	iduna.settings = {};

	/**
	 * initialise the Selectors
	 * @param  {object} settings - assoc array of settigs
	 * @return {iduna} this
	 */
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
	};

	/**
	 * opens the modal fort his selector
	 * @return {Selector} this
	 */
	Selector.prototype.open = function() {
		iduna.modal.show(this);
		return this;
	};

	/**
	 * updates <select> options & preview container with the given selected (data)
	 * @param  {array} data - array of selector option objects
	 * @return {Selector} this
	 */
	Selector.prototype.select = function (data) {
		this.data = data;

		// Clear Selected
		this.elements.preview.html('');
		this.rawElement.children('option').removeAttr('selected');
		
		// Loop through each selected value
		_.each(this.data, function (obj) {
			obj.element.attr('selected', false);
			if (obj.selected) {

				// Append to preview
				var preview = '<img class="idunaPreview-image" src="' + obj.src + '">';
				this.elements.preview.append(preview);

				// select its option element
				obj.element.attr('selected', true);
			}
		}, this);

		return this;
	};

	/**
	 * Modal Object
	 - ----------------------------------------------------------------------
	 */
	var Modal = function () {
		var self = this;
		this.currentSelector = false;
		this.isHidden = false;
		this.lastSelected = false;

		// Build DOM Elements
		var elements = {};
		elements.wrap = $('<div class="idunaModal"></div>').appendTo("body");
		elements.pane = $('<div class="idunaModal-pane"></div>').appendTo(elements.wrap);
		elements.header = $('<div class="idunaModal-header"><h3>Select Images</h3></div>').appendTo(elements.pane);
		elements.exit = $('<div class="idunaModal-exit"><i class="fa fa-times"></i></div>').appendTo(elements.header);
		elements.body = $('<div class="idunaModal-body">Body</div>').appendTo(elements.pane);
		elements.footer = $('<div class="idunaModal-footer"></div>').appendTo(elements.pane);
		elements.submit = $('<div class="btn btn-primary">Select</div>').appendTo(elements.footer);
		this.elements = elements;

		// Register Select Even on submit element click
		$(elements.submit).click( function (event) {
			self.select();
		})

		// Register Exit Event on exit element click
		$(elements.exit).click( function (event) {
			self.hide();
		});

		// Register Exit Event on wrap element click
		$(elements.wrap).click( function (event) {
			if ($(event.target).is(this)) {
				self.hide();
			}
		});

		// Hide it
		this.hide();
	};

	/**
	 * Hides the modal and removes it current selector
	 * @return {Modal} this
	 */
	Modal.prototype.hide = function () {
		$(this.elements.wrap).addClass('hidden');
		this.isHidden = true;
		this.currentSelector = false;

		return this;
	};

	/**
	 * Shows a Modal for the given selector
	 * @param  {Selector} selector
	 * @return {Modal} this
	 */
	Modal.prototype.show = function (selector) {
		this.currentSelector = selector;
		this.data = $.extend([], selector.data);
		this.render();
		$(this.elements.wrap).removeClass('hidden');
		this.isHidden = false;

		return this;
	};

	/**
	 * Builds & appends the current modal's inner html
	 * @return {Modal} this
	 */
	Modal.prototype.render = function () {
		var self = this;

		// Clear current
		this.elements.body.html('');

		// Build Inner Html
		_.each(this.data, function(data) {
			var wrap = $('<div class="idunaModal-imageWrap" value="'+data.value+'" src="'+data.src+'"></div>');
			$('<div class="idunaModal-image idunaModal-select" style="background-image: url(\''+data.src+'\');"></div>').appendTo(wrap);			
			data.modalElement = wrap.appendTo(this.elements.body);
		}, this);

		$('.idunaModal-select').click( function (event) {
			if (self.currentSelector.isMultiple && (event.metaKey || event.shiftKey)) {
				self.selectMultiple(event);
			} else {
				self.selectSingle(event);
			}
		});

		this.updateSelected();
		return this;
	};

	/**
	 * Selects an image given the click event
	 * @param  {event} event - click event
	 * @return {Modal} this
	 */
	Modal.prototype.selectSingle = function (event) {
		var multipleSelected = this.multipleSelected();

		_.each(this.data, function (data, key) {
			if ( data.modalElement.is( $(event.target).parent() ) ) {
				data.selected = !data.selected;
				if (multipleSelected) {
					data.selected = true;
				}
				this.lastSelected = data;
			} else {
				data.selected = false;
			}

		}, this);

		this.updateSelected();
		return this;
	}

	/**
	 * Selects Multiple Images given the click event
	 * @param  {event} event - click event
	 * @return {Modal} this
	 */
	Modal.prototype.selectMultiple = function (event) {
		_.each(this.data, function (data, key) {
			if ( data.modalElement.is($(event.target).parent()) ) {
				data.selected = !data.selected;
				this.lastSelected = data;
			}

		}, this);

		this.updateSelected();
		return this;
	}

	/**
	 * Submit the modal's selected images and close the modal
	 * @return {[type]} [description]
	 */
	Modal.prototype.select = function () {
		this.currentSelector.select(this.data);
		this.hide();

		return this;
	}
		
	/**
	 * Updates the visuals of the modal (selected elements)
	 * @return {Modal} this
	 */
	Modal.prototype.updateSelected = function () {
		_.each(this.data, function (data) {
			data.modalElement.removeClass('selected');
			if (data.selected === true) {
				data.modalElement.addClass('selected');
			}
		}, this);

		return this;
	};

	/**
	 * determines if multiple elements are selected
	 * @return {boolean} true if more than one element is selected
	 */
	Modal.prototype.multipleSelected = function () {
		var selectedCount = 0;
		
		_.each(this.data, function (data) {
			if (data.selected) {
				selectedCount ++;
			}
		}, this);

		return (selectedCount > 1);
	}

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
				'element': $(option),
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

		// Create Elements
		selector.rawElement.wrap('<div class="idunaWrap"></div>');
		elements.wrap = selector.rawElement.parent();	
		elements.openButton = $('<div class="btn btn-primary">Select Images</div>').appendTo(elements.wrap);
		elements.preview = $('<div class="iduna-preview"></div>').appendTo(elements.wrap);

		// Register Events
		elements.openButton.click( function(event) {
			selector.open();
		});

		return elements;
	};




	return iduna;
}());