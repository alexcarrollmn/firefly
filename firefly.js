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
    ],
    self = null;

var Firefly = function(pos)
{
    self = this;
    this.off();

    this.interval      = tools.getRandomArbitrary(3000, 20000);
    this.blinkInterval = tools.getRandomArbitrary(100, 500);
    this.blinks        = tools.getRandomArbitrary(1, 10);
    this.pixel         = pos;
    this.count         = 0;
    this.color         = colors[ Math.round( Math.random() * (colors.length - 1)) ];
    this.blinkTimer    = setInterval(this.flash, this.blinkInterval);

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
 * Flash the pixel
 */
Firefly.prototype.flash = function() {
    if (self.count > self.limit) {
        clearInterval(this.blinkTimer);
        self.count = 0;
    }

    var r = self.color[0],
        g = self.color[1],
        b = self.color[2];

    if (self.count % 2) {
        client.setPixel(self.pixel, r, g, b);
    } else {
        client.setPixel(self.pixel, 0, 0, 0);
    }

    client.writePixels();
    self.count++;
};


/**
 * Brief pause before next pixel
 */
Firefly.prototype.pause = function() {
    // pause
    setTimeout(function(){}, 500);
};

Firefly.prototype.debug = function()
{
    console.log(
        // (interval / 1000).toString() + " secs | ",
        "Flash Interval: " + (this.blinkInterval / 1000).toString() + " secs | ", 
        Math.floor(this.limit / 2).toString() + " flashes | ", 
        "Pos: " + this.pos
    );    
}

module.exports = Firefly;