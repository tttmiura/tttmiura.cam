'use strict';

var NotificationAlert = function(param) {
	this.setParam(param);
};

NotificationAlert.prototype.notify = function() {
	if(this.isNotification) {
		var notification = new Notification(this.title, this.options);
		notification.onclick = this.onclick ? this.onclick : function(){};
		if(this.timeout) {
			setTimeout(function() {
				notification.close();
			}, this.timeout);
		}
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
		if(param.title) {
			this.title = param.title;
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
		if(param.timeout) {
			this.timeout = param.timeout;
		}
	}
};

NotificationAlert.prototype.options = {
	dir: 'ltr',
	icon: 'public/images/curry.jpg'
};
NotificationAlert.prototype.title = '通知';
NotificationAlert.prototype.msg = '通知';
NotificationAlert.prototype.isNotification = false;

NotificationAlert.alert = function(title, msg) {
	var notificationAlert = new NotificationAlert({
		title : title,
		msg : msg,
		timeout : 30000
	});
	notificationAlert.notify();
};

if (("Notification" in window)) {
	if (Notification.permission === "granted") {
		NotificationAlert.prototype.isNotification = true;
	} else if (Notification.permission !== "denied") {
		Notification.requestPermission().then(function (permission) {
			if (permission === "granted") {
				NotificationAlert.prototype.isNotification = true;
			}
		});
	}
}
