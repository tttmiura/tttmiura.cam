onmessage = function(srcBase) {
	var baseTime = new Date().getTime();
	while(true) {
		var currentTime = new Date().getTime();
		if((currentTime - baseTime) < 60000) {
			continue;
		}
		baseTime = currentTime;
		postMessage({ src : srcBase +  currentTime});
	}
};
