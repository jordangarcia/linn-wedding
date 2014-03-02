/**
 * Returns a promise that is resolved when all selected images
 * are finished resolving * either either by `onload` or `onerrer`
 *
 * Useage:
 * imagesLoaded('img').then(doStuff)
 *
 */
var Q = require('../../bower_components/q/q.js');

// shortcut to QSA
var $QSA = window.document.querySelectorAll.bind(window.document);

/**
 * Binds the image 'load' & 'error' event listener
 *
 * @param {Node}
 * @return {Promise}
 */
function bindImgListener(node) {
	var deferred = Q.defer();

	node.addEventListener('load', function() {
		deferred.resolve(this);
	});
	node.addEventListener('error', function() {
		deferred.resolve(this);
	});

	return deferred.promise;
}

module.exports = function imagesLoaded(selector) {
	var deferredImages = [];
	document.addEventListener('DOMContentLoaded', function(event) {
		Array.prototype.forEach.call($QSA(selector), function(node) {
			deferredImages.push(bindImgListener(node));
		});
	});

	return Q.all(deferredImages);
};
