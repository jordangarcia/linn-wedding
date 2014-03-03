var $ = require('jquery');
var slideScroll = require('./lib/slide-scroll');
var imagesLoaded = require('./lib/images-loaded');
var isMobile = require('./lib/is-mobile');
var navbar = require('./navbar');

if (!isMobile()) {
	imagesLoaded('img.watch-image').then(function() {
		slideScroll('section', {
			linkSelector: '.scroll-link'
		});
	});
}

$(function() {
	navbar($('.navbar')[0]);
});
