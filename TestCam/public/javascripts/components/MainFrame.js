'use strict';

var MainFrame = function() {
	var proto = Object.create(HTMLElement.prototype);

	proto.createdCallback = function() {
		var self = this;
		var div = document.createElement('div');
		div.classList.add('container');
		div.classList.add('mainFrame');
		self.appendChild(div);
		var video = document.createElement('video');
		video.setAttribute('autoplay', 'autoplay');
		video.classList.add('mainVideo');
		div.appendChild(video);

		var constraints = { audio: false, video: true };

		// TODO
		navigator.webkitGetUserMedia(constraints, function(localMediaStream) {
			console.log("success");
			video.src = window.URL.createObjectURL(localMediaStream);
		}, function() {
			console.log("error");
		});
	};
	document.registerElement('x-mainframe', {
		prototype:proto
	});
};
MainFrame();
