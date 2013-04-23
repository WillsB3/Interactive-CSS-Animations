$(document).ready(function() {

	var $viewport = $('.viewport'),
		$sidebar = $viewport.find('.sidebar'),
		sidebarOffset = 0,
		sidebarOffset = 0,
		sidebarWidth = 259,
		transEndEventNames ={
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition'    : 'transitionend',
			'OTransition'      : 'oTransitionEnd',
			'msTransition'     : 'MSTransitionEnd',
			'transition'       : 'transitionend'
		};

	function init () {
		var viewportHeight = $viewport.height();

		preventOverScroll(document.querySelector('.scroll-root'));

		// Set correct height on the content pane
		$('.content-wrapper').css({
			height: viewportHeight - $('.top-bar').height()
		});

		$viewport.find('.sidebar').css({
			height: viewportHeight
		});
	}

	function animateSidebar(direction, options) {
		var currentOffset = getElementPosition($sidebar),
			css = {},
			distance,
			targetOffset;

		if (direction === "OPEN") {
			targetOffset = sidebarWidth;
		} else if (direction === "CLOSED") {
			targetOffset = 0;
		} else {
			throw new Error("Unsupported direction supplied");
		}
			
		distance = Math.abs(currentOffset - targetOffset);

		// Apply animation styles
		css[vendorPrefixed('transition')] = 'all 250ms ease';

		// Force a style recalc
		$sidebar.offset();

		$element.on(getTransitionEndEvent(), function(evt) {
			if (transitionEventIs(evt, 'transform')) {
				$element.off(getTransitionEndEvent());
			}
		});

		$sidebar.css(css);
	}

	function handleHammer(ev) {
		
		// disable browser scrolling
		ev.gesture.preventDefault();

		switch(ev.type) {
			case 'dragright':
			case 'dragleft':
				// Stick to the finger
				var dragDelta = ev.gesture.deltaX,
					newOffset = sidebarOffset + dragDelta;

				if (newOffset < 0) {
					newOffset = 0;
				} else if (newOffset > sidebarWidth) {
					newOffset = sidebarWidth;
				}

				setElementPosition($viewport, {
					x: newOffset
				});

				break;

			case 'swipeleft':
				setElementPosition($viewport, {
					x: 0
				});

				break;

			case 'swiperight':
				setElementPosition($viewport, {
					x: sidebarWidth
				});

				break;

			case 'release':
				var releasedOffset = getElementPosition($viewport);

				if (releasedOffset.x > $viewport.width() / 2) {
					setElementPosition($viewport, {
						x: sidebarWidth
					});
				} else {
					setElementPosition($viewport, {
						x: 0
					});
				}

				break;
		}
	}

	function getTransitionEndEvent () {
		return transEndEventNames[Modernizr.prefixed('transition')];
	}

	function setElementPosition ($element, offset) {
		if (Modernizr.csstransforms3d) {
			$element.css("transform", "translate3d(" + offset.x + "px, 0, 0)");
		} else if (Modernizr.csstransforms) {
			$element.css("transform", "translate(" + offset.x + "px, 0)");
		}
	}

	function transitionEventIs (evt, transitionName) {
	   return evt.originalEvent.propertyName == vendorPrefixed(transitionName);
	}

	function getElementPosition ($el, options) {
		var isMatrix3d = null,
			matrix,
			offset = { x: 0, y: 0 },
			matrixValues = null,
			position,
			propertyName = null,
			supportsTransforms = Modernizr.csstransforms;

		options = $.extend({}, options);

		if (supportsTransforms && options.useTransforms !== false) {
			propertyName = vendorPrefixed('transform');
			matrix = $el.css(propertyName);

			if (matrix !== 'none' && matrix !== "") {
				// Check if we are dealing with a matrix or matrix3d (as per IE10)
				// so we can extract the correct values
				isMatrix3d = matrix.indexOf('matrix3d') !== -1;
				matrixValues = matrix.split('(')[1].split(')')[0].split(',');

				if (isMatrix3d) {
					offset.x = parseFloat(matrixValues[12]);
					offset.y = parseFloat(matrixValues[13]);
				} else {
					offset.x = parseFloat(matrixValues[4]);
					offset.y = parseFloat(matrixValues[5]);
				}
			}
		} else {
			position = $el.position();
			offset.x = position.left;
			offset.y = position.top;
		}

		return offset;
	}

	getPositionProperties = function (offsets, options) {
		var cssDelta = {},
			propertyName = null,
			propertyValue = '',
			supportsTransforms = Modernizr.csstransforms;
			supports3dTransforms = Modernizr.csstransforms3d;

		options = $.extend({}, options);

		if (supportsTransforms && options.useTransforms !== false) {
			propertyName = vendorPrefixed('transform');

			if (offsets.x !== undefined) {
				propertyValue += 'translateX(' + offsets.x + 'px) ';
			}

			if (offsets.y !== undefined) {
				propertyValue += 'translateY(' + offsets.y + 'px) ';
			}

			if (supports3dTransforms && options.use3dTransforms !== false) {
				propertyValue += 'translateZ(0)';
			}

			cssDelta[propertyName] = propertyValue.trim();
		} else {
			if (offsets.x) {
				cssDelta.left = offsets.x + 'px';
			}

			if (offsets.y) {
				cssDelta.top = offsets.y + 'px';
			}
		}

		return cssDelta;
	}

	function vendorPrefixed (prop) {
		return Modernizr.prefixed(prop).replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
	}

	var hammer = Hammer($viewport.get(0)).on('release dragleft dragright swipeleft swiperight', handleHammer);
	init();

});
