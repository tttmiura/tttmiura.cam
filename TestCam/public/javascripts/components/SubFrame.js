'use strict';
var SubFrameFuntion = {
	defaultSize :function(dom) {
		dom.setAttribute('width', '320');
		dom.setAttribute('height', '240');
	},

	resetImages :function() {
		SubFrameFuntion.deleteImages();
		SubFrameFuntion.getImagesList(function (data) {
			data.accessorList.forEach(SubFrameFuntion.appendImg);
		});
	},

	updateImages :function() {
		SubFrameFuntion.getImagesList(function (data) {
			data.accessorList.forEach(SubFrameFuntion.updateImg);
		});
	},

	updateImg : function(client) {
		var img = document.querySelector('img[client="' + client + '"]');
		if(img) {
			return;
		}
		SubFrameFuntion.appendImg(client);
	},

	deleteImg : function(client) {
		var img = document.querySelector('img[client="' + client + '"]');
		if(!img) {
			return;
		}
		var subFrame = document.querySelector('.subFrame');
		subFrame.removeChild(img);
	},

	appendImg : function(client) {
		var subFrame = document.querySelector('.subFrame');
		var img = document.createElement('img');
		img.setAttribute('client', client);
		SubFrameFuntion.defaultSize(img);

		var srcBase = '/getImage/' + client + '?';
		img.src = srcBase + new Date().getTime();
		subFrame.appendChild(img);

		var worker = new Worker("public/javascripts/worker/ReloadImg.js");
		worker.onmessage = function(message) {
			SubFrameFuntion.hasImg(client, function() {
				img.src = message.data.src;
			}, function() {
				worker.terminate();
				SubFrameFuntion.deleteImg(client);
			});
		}

		worker.postMessage({ src : srcBase });
	},

	hasImg : function(client, succesCallBack, errorCallBack) {
		$.ajax({
			type: "GET",
			url: "/hasImage/" + client,
			dataType: "json",
			success: function(data) {
				if(data.result) {
					succesCallBack(data);
				} else {
					errorCallBack(data);
				}
			},
			error: errorCallBack
		});
	},

	init : function() {
		var proto = Object.create(HTMLElement.prototype);
		proto.createdCallback = function() {
			var self = this;
			var div = document.createElement('div');
			div.classList.add('container');
			div.classList.add('subFrame');
			div.classList.add('text-left');
			self.appendChild(div);

			SubFrameFuntion.resetImages();
		};

		document.registerElement('x-subframe', {
			prototype:proto
		});

		SubFrameFuntion.interval = setInterval(SubFrameFuntion.updateImages, 10000);
	},

	deleteImages :function() {
		var subFrame = document.querySelector('.subFrame');
		var children = subFrame.childNodes;
		for (var i = 0; i < children.length; i++) {
			subFrame.removeChild(children.item(i));
		}
	},

	getImagesList : function(successCallBack, errorCallBack) {
		var sCallBack = successCallBack ? successCallBack : function(data){
			console.log("Ajax getImagesList success");
			console.log(data);
		};

		var eCallBack = errorCallBack ? errorCallBack : function(res, status, errorThrown){
			console.log("Ajax getImagesList error");
		};

		$.ajax({
			type: "GET",
			url: "/getImagesList",
			dataType: "json",
			success: sCallBack,
			error: eCallBack
		});
	}
};

SubFrameFuntion.init();
