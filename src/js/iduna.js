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

	Selector.prototype.select = function (selected) {
		console.log('selected: ' + selected);
		this.selected = selected;

		// Clear Selected
		this.elements.preview.html('');
		this.rawElement.children('option').removeAttr('selected');
		
		// Loop through each selected value
		_.each(selected, function (value) {
			
			// Append to preview
			_.each(this.data, function (data) {
				if (data.value === value) {
					var preview = '<img class="idunaPreview-image" src="' + data.src + '">';
					this.elements.preview.append(preview);
				}
			}, this);

			// Select on rawElement <select>
			_.each(this.rawElement.children('option'), function (option) {
				if ($(option).attr('value') === value || 
						($(option).attr('value') === undefined && $(option).html === value)) {
					$(option).attr('selected', true);
				}
			}, this);

		}, this);
	};

	/**
	 * Modal Object
	 - ----------------------------------------------------------------------
	 */
	var Modal = function () {
		var self = this;
		this.currentSelector = false;
		this.isHidden = false;
		this.selected = [];

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

	Modal.prototype.hide = function () {
		$(this.elements.wrap).addClass('hidden');
		this.isHidden = true;
		this.currentSelector = false;
		this.selected = [];
	};

	Modal.prototype.show = function (selector) {
		this.currentSelector = selector;
		this.selected = selector.selected;
		this.render();
		$(this.elements.wrap).removeClass('hidden');
		this.isHidden = false;
	};

	Modal.prototype.render = function () {
		var self = this;

		// Clear current
		this.elements.body.html('');

		// Build Inner Html
		_.each(this.currentSelector.data, function(data) {
			var html = '<image class="idunaModal-image idunaModal-select" value="' + data.value + '" src="' + data.src + '"></image>';
			var image = $(html).appendTo(this.elements.body);
			data.element = image;
		}, this);

		$('.idunaModal-select').click( function (event) {
			if (self.currentSelector.isMultiple && (event.metaKey || event.shiftKey)) {
				self.selectMultiple($(event.target).attr('value'), event);
			} else {
				self.selectSingle($(event.target).attr('value'), event);
			}
		});

		this.updateSelected();
	};

	Modal.prototype.selectSingle = function (value, event) {
		var found = _.indexOf(this.selected, value);
		if (found >= 0) {
			this.selected.splice(found, 1);
		} else {
			this.selected = [value];
		}
		this.updateSelected();
	}

	Modal.prototype.selectMultiple = function (value, event) {
		var found = _.indexOf(this.selected, value);
		// Check for Inbetween Modifier (default = shift)
		if (event.shiftKey) {
			console.log('shift click');
		}

		if (found >= 0) {
			this.selected.splice(found, 1);
		} else {
			this.selected.push(value);
		}
		this.updateSelected();
	}

	Modal.prototype.select = function () {
		this.currentSelector.select(this.selected);
		this.hide();
	}
		
	Modal.prototype.updateSelected = function () {
		_.each($(this.elements.body).children('.idunaModal-select'), function (element) {

				$(element).removeClass('selected');

				// if element's value is in selected array
				if (_.contains(this.selected, $(element).attr('value'))) {
					$(element).addClass('selected');
				} 
		}, this);
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