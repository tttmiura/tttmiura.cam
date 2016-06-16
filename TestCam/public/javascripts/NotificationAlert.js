'use strict';

var isNotification = false;
if (("Notification" in window)) {
	if (Notification.permission === "granted") {
		isNotification = true;
	} else if (Notification.permission !== "denied") {
		Notification.requestPermission().then(function (permission) {
			if (permission === "granted") {
				isNotification = true;
			}
		});
	}
}
var NotificationAlert = function(param) {
	this.setParam(param);
};

NotificationAlert.prototype.notify = function() {
	if(isNotification) {
		var notification = new Notification(this.title, this.options);
		notification.onclick = this.onclick ? this.onclick : function(){};
	} else {
		alert(this.msg);
	}
};

NotificationAlert.prototype.setParam = function(param) {
	if(param) {
		if(param.msg) {
			this.msg = param.msg;
			this.options.body = param.msg;
		}
		if(param.body) {
			this.options.body = param.body;
		}
		if(param.tag) {
			this.options.tag = param.tag;
		}
		if(param.dir) {
			this.options.dir = param.dir;
		}
		if(param.onclick) {
			this.onclick = param.onclick;
		}
	}
};
NotificationAlert.prototype.options = {
	dir: 'ltr',
	icon: 'public/pc_profAni03.gif'
};
NotificationAlert.prototype.title = '通知';
NotificationAlert.prototype.msg = '通知';
