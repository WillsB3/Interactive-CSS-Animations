$(document).ready(function() {
	preventOverScroll(document.querySelector('.scroll-root'));

	// Set correct height on the content pane
	$('.content-wrapper').css({
		height: $(window).height()
	});
});
