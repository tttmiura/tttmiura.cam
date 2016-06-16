
onmessage = function(message) {
	var baseTime = new Date().getTime();

	while(true) {
		var currentTime = new Date().getTime();

		if((currentTime - baseTime) < 10000) {
			continue;
		}

		baseTime = currentTime;
		postMessage({src : message.data.src +  currentTime});
	}
};
