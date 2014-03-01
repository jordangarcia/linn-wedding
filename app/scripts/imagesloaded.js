(function(window, document, Q, pluginName) {
	window[pluginName] = function ImagesLoaded(fnName) {
		var deferred = Q.defer();
		var numLoaded = 0;
		var numImages = 0;
		window[fnName] = function(img) {
			numLoaded++;
			console.log('image loaded', numImages, numLoaded);

			if (numImages && numLoaded === numImages) {
				deferred.resolve();
			}
		};

		setTimeout(function() {
			numImages = document.querySelectorAll('img[onload]').length;
		}, 0);

		return deferred.promise;
	};
})(window, document, Q, 'ImagesLoaded');
