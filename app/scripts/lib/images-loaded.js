/**
 * Returns a promise that is resolved when all selected images
 * are finished resolving * either either by `onload` or `onerrer`
 *
 * Useage:
 * imagesLoaded('img').then(doStuff)
 *
 */
var $ = require('jquery');

/**
 * Binds the image 'load' & 'error' event listener
 *
 * @param {Node}
 * @return {Promise}
 */
function bindImgListener(node) {
	var deferred = $.Deferred();

	node.addEventListener('load', function() {
		deferred.resolve(this);
	});
	node.addEventListener('error', function() {
		deferred.resolve(this);
	});

	return deferred.promise();
}

module.exports = function imagesLoaded(selector) {
	var deferred = $.Deferred();
	var resolve = function() {
		deferred.resolve();
	};
	var reject = function() {
		deferred.reject();
	};

	document.addEventListener('DOMContentLoaded', function(event) {
		var deferredImages = [];

		$(selector).each(function(index, node) {
			deferredImages.push(bindImgListener(node));
		});

		// when all images are resolved, resolve the promise
		$.when.apply(null, deferredImages).then(resolve, reject);
	});

	return deferred.promise();
};
