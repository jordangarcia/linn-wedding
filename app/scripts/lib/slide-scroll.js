var $ = require('jquery');
var debounce = require('underscore').debounce;

var OFFSET_START = 'data-offset-start';
var OFFSET_END   = 'data-offset-end';

var DEFAULTS = {
	linkSelector: null
};

/**
 * Main method
 */
function main(selector, opts) {
	var opts      = $.extend(true, {}, DEFAULTS, opts);
	var $sections = $(selector);

	calculateOffsets($sections);

	$(document).on('scroll', function(event) {
		scrollTo($sections, Math.max(window.scrollY, 0));
	});

	// debounce offset calculation handler
	handleResize = debounce(function() {
		console.log('hey');
		calculateOffsets($sections);
	}, 300);

	$(window).on('resize', handleResize);

	if (opts.linkSelector) {
		$(opts.linkSelector).each(function(index, node) {
			$(node).on('click', function(event) {
				var $target = $(node.getAttribute('href'));
				var targetY = $target[0].getAttribute(OFFSET_START);

				scrollTo($sections, targetY);
			});
		});
	}
}

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
 *
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

function calculateOffsets($sections) {
	console.log('calc offset');
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
 */
function scrollTo($sections, pos) {
	var ind            = getSectionInd($sections, pos);
	var currentSection = $sections[ind];
	var height         = getSectionHeight(currentSection);
	var translateY     = pos - currentSection.getAttribute(OFFSET_START);

	unfuckify($sections, ind);
	$translateY(currentSection, -translateY);
}

module.exports = main;
