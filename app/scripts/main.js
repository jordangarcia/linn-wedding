var slideScroll = require('./lib/slide-scroll');
var imagesLoaded = require('./lib/images-loaded');

imagesLoaded('imageLoaded').then(function() {
	slideScroll('section', {
		linkSelector: '.scroll-link'
	});
});
