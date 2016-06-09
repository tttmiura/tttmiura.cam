'use strict';
var MainFrame = function() {
	var proto = Object.create(HTMLElement.prototype);

	var settings = {
		defaultSize :function(dom) {
			dom.setAttribute('width', '320');
			dom.setAttribute('height', '240');
		}
	};

	proto.createdCallback = function() {
		var self = this;

		var div = document.createElement('div');
		div.classList.add('container');
		div.classList.add('mainFrame');
		div.classList.add('text-center');
		self.appendChild(div);

		var video = document.createElement('video');
		video.setAttribute('autoplay', 'autoplay');
		settings.defaultSize(video);
		video.classList.add('mainVideo');
		div.appendChild(video);

		var canvas = document.createElement('canvas');
		settings.defaultSize(canvas);
		canvas.classList.add('dummyCanvas');
		var ctx = canvas.getContext('2d');
		div.appendChild(canvas);

		var constraints = { audio: false, video: true };

		var interval = null
		var postImage = function() {
			ctx.drawImage(video, 0, 0, 320, 240);
			var url = ctx.canvas.toDataURL("image/jpeg");
			$.ajax({
				type: "POST",
				url: "/postImage",
				data: {imgBase : url},
				dataType: "json",
				success: function (data) {
					console.log("Ajax success");
				},
				error: function (res, status, errorThrown) {
					console.log("Ajax error");
					if(interval != null) {
						clearInterval(interval);
					}
				}
			});
		};
		// TODO
		navigator.webkitGetUserMedia(constraints, function(localMediaStream) {
			console.log("Media success");
			video.src = window.URL.createObjectURL(localMediaStream);
			interval = setInterval(postImage, 60000);
		}, function() {
			console.log("Media error");
		});
	};
	document.registerElement('x-mainframe', {
		prototype:proto
	});
};
MainFrame();
