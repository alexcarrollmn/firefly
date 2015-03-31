var Firefly = require('./firefly'),
	tools   = require('./utilities'),
	numPixels   = 50;


var fireflyTimer = setInterval(runFirefly, 1000); // initial interval, changes while program is running

/**
 * Run Firefly program
 */
function runFirefly()
{
	if (fireflyTimer) {
		clearInterval(fireflyTimer);
	}

	var interval = tools.getRandomArbitrary(3000, 20000),
		pos 	 = Math.round( Math.random() * numPixels),
		fly  = new Firefly(pos);

	fly.start();
	fly.pause();
	fly.debug();
		
    // start a new timer
    fireflyTimer = setInterval(runFirefly, interval);
	console.log((interval / 1000).toString() + " secs");
}