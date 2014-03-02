var slideScroll = require('./lib/slide-scroll');
var imagesLoaded = require('./lib/images-loaded');

imagesLoaded('img.watch-image').then(function() {
	slideScroll('section', {
		linkSelector: '.scroll-link'
	});
});
