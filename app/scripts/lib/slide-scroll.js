var $ = require('jquery');

var OFFSET_START = 'data-offset-start';
var OFFSET_END   = 'data-offset-end';
var UP           = 'up';
var DOWN         = 'down';

/**
 * shortcut method to translate an element
 * @param {Element} el
 * @param {Integer} val pixel value to translate
 */
function $translateY(el, val) {
	el.style.webkitTransform = 'translateY(' + val + 'px)';
}

/**
 * @param {NodeList} sections
 * @param {Integer} offset of the top of the viewport
 * @return {Integer} index of the section the top of the viewport is over
 */
function getSectionInd($sections, offset) {
	var ind = null;
	$sections.each(function(index) {
		if (
			this.getAttribute(OFFSET_START) <= offset &&
			this.getAttribute(OFFSET_END) > offset
		) {
			// save index
			ind = index;
			return false;
		}
	});
	return ind;
}

/**
 * Gets the height of section based on offsets
 *
 * @param {Node} section
 */
function getSectionHeight(section) {
	return section.getAttribute(OFFSET_END) - section.getAttribute(OFFSET_START);
}

function init($sections) {
	var offset         = 0;
	var zIndex         = 1000;
	var viewportHeight = window.innerHeight;

	$sections.each(function(index, section) {
		var height = section.offsetHeight;

		// set the zIndex and position for proper stacking order
		section.style.zIndex = --zIndex;
		section.style.position = 'fixed';

		// each section must be at least the height of the viewport
		if (height < viewportHeight) {
			height = viewportHeight;
			section.style.minHeight = height + 'px';
		}

		// attach the offset start and offset end to node
		section.setAttribute(OFFSET_START, offset);
		// increment the entire offset
		offset += height;
		section.setAttribute(OFFSET_END, offset);
	});

	// fake the document body height since everythign is position fixed
	document.body.style.height = offset + 'px';
}

function unfuckify($sections, currInd) {
	// unfuckify other sections
	$sections.each(function(sectionInd, section) {
		if (sectionInd === currInd) {
			return;
		}

		if (sectionInd > currInd) {
			$translateY(section, 0);
		} else {
			$translateY(section, -getSectionHeight(section));
		}
	});
}


/**
 * Scrolls to a position on the page
 *
 * @param {Integer} pos
 * @param {UP|DOWN} dir
 */
function scrollTo($sections, pos, dir) {
	var ind            = getSectionInd($sections, pos);
	var currentSection = $sections[ind];
	var height         = getSectionHeight(currentSection);
	var translateY     = pos - currentSection.getAttribute(OFFSET_START);

  unfuckify($sections, ind);

	if (dir === UP && translateY < 100) {
		console.log(dir, 'engage')
		translateY = 0;
	} else if (dir === DOWN && height - translateY < 100) {
		console.log(dir, 'engage')
		translateY = height;
	}

  $translateY(currentSection, -translateY);
}

/**
 * Returns an event
 */
function createOnScroll($sections) {
  var lastScrollY = 0;

  return function scrollHandler(event) {
    var scrollY = window.scrollY;
    var dir     = (lastScrollY > scrollY) ? UP : DOWN;
    lastScrollY = scrollY;

    scrollTo($sections, scrollY, dir);
  }
}

module.exports = function slideScroll(selector, opts) {
  var $sections = $(selector);
  init($sections);
  $(document).on('scroll', createOnScroll($sections));

	//if (opts.linkSelector) {
		//Array.prototype.slice.call($qsa(opts.linkSelector)).forEach(function(node) {
			//node.addEventListener('click', function(event) {
				//sections.forEach(function(node) {
					//$translateY(node, 0);
				//});
			//});
		//});
	//}
}
