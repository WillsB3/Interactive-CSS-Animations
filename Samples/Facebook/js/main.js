$(document).ready(function() {

	var $viewport = $('.viewport'),
		$sidebar = $viewport.find('.sidebar'),
		sidebarOffset = 0,
		sidebarWidth = 259;

	function init () {
		preventOverScroll(document.querySelector('.scroll-root'));

		// Set correct height on the content pane
		$('.content-wrapper').css({
			height: $(window).height()
		});
	}

	function handleHammer(ev) {
		console.log(ev);
		
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

				setElementOffset($viewport, {
					x: newOffset
				})

				break;
		}
	}

	function setElementOffset ($element, offset) {
		if (Modernizr.csstransforms3d) {
			$element.css("transform", "translate3d(" + offset.x + "px, 0, 0)");
		} else if (Modernizr.csstransforms) {
			$element.css("transform", "translate(" + offset.x + "px, 0)");
		}
	}

	var hammer = Hammer($viewport.get(0)).on('dragleft dragright', handleHammer);

	init();

});
