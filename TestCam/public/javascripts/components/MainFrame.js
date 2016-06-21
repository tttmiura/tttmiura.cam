'use strict';
var MainFrameFuntion = {
	settings : {
		defaultSize :function(dom) {
			dom.setAttribute('width', '320');
			dom.setAttribute('height', '240');
		},

		init : function() {
			var proto = Object.create(HTMLElement.prototype);

			proto.createdCallback = function() {
				var self = this;

				var containerDiv = document.createElement('div');
				containerDiv.classList.add('container');
				containerDiv.classList.add('mainFrame');
				containerDiv.classList.add('text-center');
				self.appendChild(containerDiv);

				var video = document.createElement('video');
				video.setAttribute('autoplay', 'autoplay');
				video.setAttribute('poster', 'public/images/curry.jpg');
				MainFrameFuntion.settings.defaultSize(video);
				video.classList.add('mainVideo');
				video.classList.add('videoReady');
				video.addEventListener('click', MainFrameFuntion.startVideo);
				video.interval = null;
				containerDiv.appendChild(video);

				var canvas = document.createElement('canvas');
				MainFrameFuntion.settings.defaultSize(canvas);
				canvas.classList.add(Config.snapCanvasClass);
				canvas.classList.add('mainCanvas');
				containerDiv.appendChild(canvas);
			};

			document.registerElement('x-mainframe', {
				prototype:proto
			});
		}
	},
	startVideo : function() {
		var video = document.querySelector('.videoReady');
		if(!video) {
			return;
		}

		video.classList.remove("videoReady");

		var constraints = { audio: false, video: true };

		// TODO
		navigator.webkitGetUserMedia(constraints, function(localMediaStream) {
			console.log("Media success");
			console.log(localMediaStream);

			localMediaStream.onactive = function() {
				console.log("MediaStream onactive");
				video.localMediaStream = localMediaStream;
			};

			localMediaStream.oninactive = function() {
				console.log("MediaStream oninactive");
			};

			localMediaStream.onaddtrack = function() {
				console.log("MediaStream onaddtrack");
			};

			localMediaStream.onended = function() {
				console.log("MediaStream onended");
				MainFrameFuntion.stopVideo(video);
			};

			localMediaStream.onremovetrack = function() {
				console.log("MediaStream onremovetrack");
			};

			video.src = window.URL.createObjectURL(localMediaStream);
			video.interval = setInterval(MainFrameFuntion.postImage, Config.postInterval);
		}, function(e) {
			console.log("Media error");
			console.log(e);
			NotificationAlert.alert('デバイス起動失敗', 'デバイスの起動に失敗しました。');
		});

	},
	postImage : function() {
		var video = document.querySelector('.mainVideo');
		if(!video) {
			return;
		}
		var canvas = document.querySelector('.mainCanvas');
		if(!canvas) {
			return;
		}
		var ctx = canvas.getContext('2d');
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
				if(video.interval != null) {
					clearInterval(video.interval);
					video.interval = null;
				}
			}
		});
	},
	stopVideo : function(video) {
		if(video.interval != null) {
			clearInterval(video.interval);
			video.interval = null;
			video.src = '#'
		}
		if(video.localMediaStream && video.localMediaStream != null) {
			video.localMediaStream.getVideoTracks()[0].stop();
			video.localMediaStream = null;
		}
		video.classList.add('videoReady');
		var alert = new NotificationAlert({
			title : 'デバイス停止',
			msg : 'デバイスが停止しました。'
		});
		alert.notify();
	}
};

MainFrameFuntion.settings.init();
