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

/**
 * Firefly object
 *
 * @param {number} pos Pixel position
 * @constructor
 */
var Firefly = function(pos)
{
    this.off();

    this.blinkInterval = tools.getRandomArbitrary(100, 500);
    this.blinks        = tools.getRandomArbitrary(1, 10);
    this.pixel         = pos;
    this.count         = 0;
    this.color         = colors[ Math.round( Math.random() * (colors.length - 1)) ];

};


/**
 * Turn off all pixels
 */
Firefly.prototype.off = function() {
    //turn off all pixels
    for (var i = 0; i < numPixels; i++) {
        client.setPixel(i, 0, 0, 0);
    }
    client.writePixels();
};


/**
 * Start blink timer
 */
Firefly.prototype.start = function() {
    this.blinkTimer    = setInterval(this.flash.bind(this), this.blinkInterval);
};


/**
 * Flash the pixel
 */
Firefly.prototype.flash = function() {
    if (this.count > this.blinks) {
        clearInterval(this.blinkTimer);
        this.count = 0;
    }

    var r = this.color[0],
        g = this.color[1],
        b = this.color[2];

    if (this.count % 2) {
        client.setPixel(this.pixel, r, g, b);
    } else {
        client.setPixel(this.pixel, 0, 0, 0);
    }

    client.writePixels();
    this.count++;
};

/**
 * Brief pause before next pixel
 */
Firefly.prototype.pause = function() {
    // pause
    setTimeout(function(){}, 500);
};


/**
 * Output basic debugging information
 */
Firefly.prototype.debug = function()
{
    console.log(
        "Flash Interval: " + (this.blinkInterval / 1000).toString() + " secs | ",
        Math.floor(this.blinks / 2).toString() + " flashes | ",
        "Pos: " + this.pixel
    );
};


module.exports = Firefly;
