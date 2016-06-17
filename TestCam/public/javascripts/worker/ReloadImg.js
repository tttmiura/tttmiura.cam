importScripts('/public/javascripts/Config.js');

onmessage = function(message) {
	var baseTime = new Date().getTime();

	while(true) {
		var currentTime = new Date().getTime();

		if((currentTime - baseTime) < Config.reloadInterval) {
			continue;
		}

		baseTime = currentTime;
		postMessage({src : message.data.src +  currentTime});
	}
};
