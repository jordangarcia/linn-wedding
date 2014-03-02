var slideScroll = require('./lib/slide-scroll');
var imagesLoaded = require('./lib/images-loaded');
var isMobile = require('./lib/is-mobile');

if (!isMobile()) {
  imagesLoaded('img.watch-image').then(function() {
    slideScroll('section', {
      linkSelector: '.scroll-link'
    });
  });
}
