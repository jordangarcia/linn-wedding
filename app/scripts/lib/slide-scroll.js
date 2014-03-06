var $qsa = window.document.querySelectorAll.bind(window.document);

/**
 * shortcut method to translate an element
 * @param {Element} el
 * @param {Integer} val pixel value to translate
 */
function $translateY(el, val) {
	el.style.webkitTransform = 'translateY(' + val + 'px)';
}

module.exports = function slideScroll(selector, opts) {
	opts = opts || {};
	var offset         = 0;
	var zIndex         = 1000;
	var viewportHeight = window.innerHeight;
	var OFFSET_START   = 'data-offset-start';
	var OFFSET_END     = 'data-offset-end';

	var sections = Array.prototype.slice.call($qsa(selector), 0);

	sections.forEach(function(section) {
		var height = section.offsetHeight;

		// set the zindex and position for proper stacking order
		section.style.zIndex = --zIndex;
		section.style.position = 'fixed';
		//debugger;
		//section.style.webkitTransition = '-webkit-transform: 40ms';

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

	document.body.style.height = offset + 'px';

	/**
	 * @param {Integer} offset of the top of the viewport
	 * @return {Integer} index of the section the top of the viewport is over
	 */
	function getSectionInd(offset) {
		var section = sections.filter(function(node) {
			return (
				node.getAttribute(OFFSET_START) < offset &&
				node.getAttribute(OFFSET_END) > offset
			);
		})[0];

		return sections.indexOf(section);
	}

	document.addEventListener('scroll', function(event) {
		var scrollY        = window.scrollY;
		var ind            = getSectionInd(scrollY);
		if (ind === -1) {
			return;
		}

		var currentSection = sections[ind];
		var offsetStart = currentSection.getAttribute(OFFSET_START);
		var offsetEnd = currentSection.getAttribute(OFFSET_END);
		var height = offsetEnd - offsetStart;

		//sections.forEach(function(section) {
			//if (section !== currentSection) {
				//$translateY(section, 0);
			//}
		//});


		console.log(scrollY, currentSection);
		var translateY = scrollY - offsetStart;

		if (translateY - 200 < height) {
			translateY = height;
		}
		$translateY(currentSection, -translateY);
	});

	if (opts.linkSelector) {
		Array.prototype.slice.call($qsa(opts.linkSelector)).forEach(function(node) {
			node.addEventListener('click', function(event) {
				sections.forEach(function(node) {
					$translateY(node, 0);
				});
			});
		});
	}
}
