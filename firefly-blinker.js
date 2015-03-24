/* #!/usr/bin/env node */

var OPC         = new require('./opc'),
    client      = new OPC('localhost', 7890),
    tools       = require('./utilities'),
    countdown   = 0,
    numPixels   = 50,
    maxEyes     = 12, // maximum number of concurrently active blinkers
    deadTimeMin = 50,
    deadTimeMax = 500,
    intervalMin = 10,
    intervalMax = 300,
    colors      = [
        [255, 26, 24], // red
        [255, 163, 23], // orange 1
        [255, 181, 23], // orange 2
        [233, 255, 11], // green
        [190, 253, 15], // green 2
        [237, 247, 1] // yellow
    ],
    blinkers = [];
 
 
/**
 * Adapted from https://learn.adafruit.com/random-spooky-led-eyes/
 */
var Firefly = function()
{
    this.m_active = false;  // blinker is in use.
    this.m_deadTime;  // don't re-use this pair immediately
      
    this.m_pos;
      
    this.m_red;
    this.m_green;
    this.m_blue;
      
    this.m_increment;  // ramp increment - determines blink speed
    this.m_repeats;  // not used
    this.m_intensity;  // current ramp intensity

    this.StartBlink = function(pos) {
        this.m_pos = pos;
        
        // Pick a random color
        var colorInt = tools.getRandomArbitrary(0, (colors.length - 1)),
            color    = colors[ colorInt ];
    
        this.m_red   = color[0];
        this.m_green = color[1];
        this.m_blue  = color[2];
        
        this.m_repeats = Math.round( Math.random() * 3 );
        
        // set blink speed and deadtime between blinks
        this.m_increment = Math.round( Math.random() * 6 );
        this.m_deadTime  = tools.getRandomArbitrary(deadTimeMin, deadTimeMax);

        // Mark as active and start at intensity zero
        this.m_active = true;
        this.m_intensity = 0;   
    };

    this.step = function() {

        if (!this.m_active) {
            // count down the dead-time when the blink is done
            if (this.m_deadTime > 0) {
                this.m_deadTime--;
            }

            return;
        }

        // Increment the intensity
        this.m_intensity += this.m_increment;
        if (this.m_intensity >= 255) {
            this.m_increment = -this.m_increment;
            this.m_intensity += this.m_increment;
        }

        if (this.m_intensity <= 0) {
            if (--this.m_repeats <= 0) {
                this.m_active = false;
            } else {
                this.m_increment = Math.round( Math.random() * 6 );
            }
            return;
        }
        
        // Generate the color at the current intensity level
        var r = Math.round(tools.map(this.m_red, 0, 255, 0, this.m_intensity)),
            g = Math.round(tools.map(this.m_green, 0, 255, 0, this.m_intensity)),
            b = Math.round(tools.map(this.m_blue, 0, 255, 0, this.m_intensity));
         
        client.setPixel(this.m_pos, r, g, b);
    }
}

function setup()
{
    countdown = 0;

    for (i = 0; i < maxEyes; i++) {
        blinkers[i] = new Firefly();
    }
        
    setInterval(loop, 50);
}


function loop()
{
    for (var i = 0; i < numPixels; i++) {
        client.setPixel(i, 0, 0, 0);
    }
    client.writePixels();

    --countdown;
    for(var i = 0; i < maxEyes; i++) {
        // Only start a blink if the countdown is expired and there is an available blinker
        if ((countdown <= 0) && (blinkers[i].m_active == false)) {
            newPos = tools.getRandomArbitrary(0, numPixels / 2) * 2;
            console.log(newPos);
            for(var j = 0; j < maxEyes; j++) {
              // avoid active or recently active pixels
                if ((blinkers[j].m_deadTime > 0) && (Math.abs(newPos - blinkers[j].m_pos) < 4)) {
                    console.log(" Collision -");
                    newPos = -1;  // collision - do not start
                    break;
                }
            }

            // if we have a valid pixel to start with...
            if (newPos >= 0) {
                console.log(i);
                console.log(" Activate - ");
                blinkers[i].StartBlink(newPos);  
                countdown = tools.getRandomArbitrary(intervalMin, intervalMax);  // random delay to next start
            }
        }
        // step all the state machines
        blinkers[i].step();
    }

    // update the strip
    client.writePixels();
}

setup();