'use strict';
var SubFrame = function() {
	var proto = Object.create(HTMLElement.prototype);
	var settings = {
		defaultSize :function(dom) {
			dom.setAttribute('width', '320');
			dom.setAttribute('height', '240');
		},

		resetImages :function() {
			var subFrame = document.querySelector('.subFrame');
			var children = subFrame.childNodes;
			for (var i = 0; i < children.length; i++) {
				subFrame.removeChild(children.item(i));
			}

			$.ajax({
				type: "GET",
				url: "/getImagesList",
				dataType: "json",
				success: function (data) {
					console.log("Ajax getImagesList success");
					console.log(data);
					data.accessorList.forEach(settings.appendImg);
				},
				error: function (res, status, errorThrown) {
					console.log("Ajax getImagesList error");
				}
			});
		},

		appendImg : function(client) {
			var subFrame = document.querySelector('.subFrame');
			var img = document.createElement('img');
			settings.defaultSize(img);

			var srcBase = '/getImage/' + client + '?';
			img.src = srcBase + new Date().getTime();
			subFrame.appendChild(img);
			var worker = new Worker("public/javascripts/worker/ReloadImg.js");
			worker.onmessage = function(result) {
				console.log(result);
				if(result.src) {
					img.src = result;
				} else {
					worker.terminate();
				}
			}
			worker.postMessage({ src : srcBase });
		}
	};

	proto.createdCallback = function() {
		var self = this;

		var div = document.createElement('div');
		div.classList.add('container');
		div.classList.add('subFrame');
		div.classList.add('text-left');
		self.appendChild(div);

		settings.resetImages();
	};
	document.registerElement('x-subframe', {
		prototype:proto
	});
};
SubFrame();
