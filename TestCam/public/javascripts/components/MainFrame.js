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

				var div = document.createElement('div');
				div.classList.add('container');
				div.classList.add('mainFrame');
				div.classList.add('text-center');
				self.appendChild(div);

				var video = document.createElement('video');
				video.setAttribute('autoplay', 'autoplay');
				video.setAttribute('poster', 'public/images/curry.jpg');
				MainFrameFuntion.settings.defaultSize(video);
				video.classList.add('mainVideo');
				div.appendChild(video);

				var canvas = document.createElement('canvas');
				MainFrameFuntion.settings.defaultSize(canvas);
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

				var stopPostImageInterval = function() {
					if(interval != null) {
						clearInterval(interval);
						interval = null;
						video.src = '#'
					}
					var stopAlert = new NotificationAlert({title: 'デバイス停止', msg : 'デバイスが停止しました。'});
					stopAlert.notify();
				}

				// TODO
				navigator.webkitGetUserMedia(constraints, function(localMediaStream) {
					console.log("Media success");
					console.log(localMediaStream);

					localMediaStream.onactive = function() {
						console.log("MediaStream onactive");
					};

					localMediaStream.oninactive = function() {
						console.log("MediaStream oninactive");
					};

					localMediaStream.onaddtrack = function() {
						console.log("MediaStream onaddtrack");
					};

					localMediaStream.onended = function() {
						console.log("MediaStream onended");
						stopPostImageInterval();
					};

					localMediaStream.onremovetrack = function() {
						console.log("MediaStream onremovetrack");
					};

					video.src = window.URL.createObjectURL(localMediaStream);
					interval = setInterval(postImage, 10000);
				}, function() {
					console.log("Media error");
				});
			};
			document.registerElement('x-mainframe', {
				prototype:proto
			});
		}
	}
};

MainFrameFuntion.settings.init();
