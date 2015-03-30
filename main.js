var Firefly = require('./firefly'),
	tools   = require('./utilities'),
	numPixels   = 50;


var fireflyTimer = setInterval(runFirefly, 1000); // initial interval, changes while program is running

function runFirefly()
{
	if (fireflyTimer) {
		clearInterval(fireflyTimer);
	}

	var interval = tools.getRandomArbitrary(3000, 20000),
		pos 	 = Math.round( Math.random() * numPixels),
		firefly  = new Firefly(pos);

		firefly.debug();
		
    // start a new timer
    fireflyTimer = setInterval(runFirefly, interval);
}

// function flash()
// {
//     if (parent) {
//         clearInterval(parent);
//     }

//     var c = 0,
//         limit = tools.getRandomArbitrary(2, 10),
//         pixel = Math.round( Math.random() * numPixels),
//         colorIndex = Math.round( Math.random() * (colors.length - 1)),
//         r          = colors[colorIndex][0],
//         g          = colors[colorIndex][1],
//         b          = colors[colorIndex][2];

//     console.log((interval / 1000).toString() + " secs | ", limit.toString() + " flashes | ", "Pos: " + pixel);
//     var flashTimer = setInterval(function(){
//         if (c > limit) {
//             clearInterval(flashTimer);
//             c = 0;
//         }

//         if (c % 2) {
//             client.setPixel(pixel, r, g, b);
//         } else {
//             client.setPixel(pixel, 0, 0, 0);
//         }

//         client.writePixels();
//         c++;
//     }, tools.getRandomArbitrary(100, 500));

//     // pause
//     setTimeout(function(){}, 500);

