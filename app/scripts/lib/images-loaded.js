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
	var deferred = Q.defer();
	var resolve = function() {
		deferred.resolve();
	};
	var reject = function() {
		deferred.reject();
	};

	document.addEventListener('DOMContentLoaded', function(event) {
		var deferredImages = [];
		Array.prototype.forEach.call($QSA(selector), function(node) {
			deferredImages.push(bindImgListener(node));
		});
		// when all images are resolved, resolve the promise
		Q.all(deferredImages).then(resolve, reject);
	});

	return deferred.promise;
};
