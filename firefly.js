var OPC         = new require('./opc'),
    client      = new OPC('localhost', 7890),
    tools       = require('./utilities'),
    numPixels   = 50,
    colors = [
        [255, 26, 24], // red
        [255, 155, 125], // red
        [255, 163, 23], // orange 1
        [255, 181, 23], // orange 2
        [237, 247, 1], // yellow
        [253, 253, 199], // yellow,
        [233, 255, 11], // green
        [190, 253, 15], // green 2
        [199, 229, 255], // blue
        [102, 184, 255] // blue
    ];

var Firefly = function()
{
    this.interval   = tools.getRandomArbitrary(3000, 20000);
    this.blinks     = tools.getRandomArbitrary(1, 10);
    this.pixel      = Math.round( Math.random() * numPixels);
    this.colorIndex = Math.round( Math.random() * (colors.length - 1));
    this.parentTimer = null;
    this.blinkTimer  = null;

    /**
     * Turn off all pixels
     */
    this.off = function() {
        //turn off all pixels
        for (var i = 0; i < numPixels; i++) {
            client.setPixel(i, 0, 0, 0);
        }
        client.writePixels();
    };


    /**
     * Brief pause before next pixel
     */
    this.pause = function() {
        // pause
        setTimeout(function(){}, 500);
    }
};

function flash()
{
    if (parent) {
        clearInterval(parent);
    }

    var c = 0,
        limit = tools.getRandomArbitrary(2, 10),
        pixel = Math.round( Math.random() * numPixels),
        colorIndex = Math.round( Math.random() * (colors.length - 1)),
        r          = colors[colorIndex][0],
        g          = colors[colorIndex][1],
        b          = colors[colorIndex][2];

    console.log((interval / 1000).toString() + " secs | ", limit.toString() + " flashes | ", "Pos: " + pixel);
    var flashTimer = setInterval(function(){
        if (c > limit) {
            clearInterval(flashTimer);
            c = 0;
        }

        if (c % 2) {
            client.setPixel(pixel, r, g, b);
        } else {
            client.setPixel(pixel, 0, 0, 0);
        }

        client.writePixels();
        c++;
    }, tools.getRandomArbitrary(100, 500));

    // pause
    setTimeout(function(){}, 500);

    // start a new timer
    parent = setInterval(flash, interval);
}
var parent = setInterval(flash, 3000);
