var $ = require('jquery');
var SHOW_CLASS = 'menu-showing';
var BUTTON_SELECTOR = '.show-menu';

function navbar(node, opts) {
	opts               = opts || {};
	var showClass      = opts.showClass || SHOW_CLASS;
	var buttonSelector = opts.buttonSelector || BUTTON_SELECTOR;
	var closeOnLink    = opts.closeOnLink || true;

	var $node = $(node);

	$node.on('click', buttonSelector, function(event) {
		$node.toggleClass(showClass);
	});

	if (closeOnLink) {
		$node.on('click', 'a:not(' + buttonSelector + ')', function() {
			$node.removeClass(showClass);
		});
	}
}

module.exports = navbar;
