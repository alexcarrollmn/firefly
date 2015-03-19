/* #!/usr/bin/env node */

var OPC         = new require('./opc'),
    client      = new OPC('localhost', 7890),
    countdown   = 0,
    numPixels   = 50,
    prevPixel   = 0,
    maxEyes     = 3, // maximum number of concurrently active blinkers
    pixel       = -1,
    deadTimeMin = 50,
    deadTimeMax = 500,
    pixelMatrix = [],
    intervalMin = 10,
    intervalMax = 300,
    stepInterval = 10,
    lastStep = 0,
    startMillis = 0,
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
      
    this.m_pos;  // position of the 'left' eye.  the 'right' eye is m_pos + 1
      
    this.m_red;  // RGB components of the color
    this.m_green;
    this.m_blue;
      
    this.m_increment;  // ramp increment - determines blink speed
    this.m_repeats;  // not used
    this.m_intensity;  // current ramp intensity

    this.StartBlink = function(pos) {
        this.m_pos = pos;
        
        // Pick a random color - skew toward red/orange/yellow part of the spectrum for extra creepyness
        this.m_red   = getRandomArbitrary(150, 255);
        this.m_green = Math.random() * 100;
        this.m_blue  = 0;
        
        this.m_repeats += getRandomArbitrary(1, 3);
        
        // set blink speed and deadtime between blinks
        this.m_increment = getRandomArbitrary(1, 6);
        this.m_deadTime  = getRandomArbitrary(deadTimeMin, deadTimeMax);
        console.log(this.m_deadTime);
        // Mark as active and start at intensity zero
        this.m_active = true;
        this.m_intensity = 0;
    };

    this.step = function() {
        // console.log(this.m_active, this.m_deadTime);
        if (!this.m_active) { 
            // count down the dead-time when the blink is done
            if (this.m_deadTime > 0) {
                this.m_deadTime--;
            }

            return;
        }
        
        // Increment the intensity
        this.m_intensity += this.m_increment;
        if (this.m_intensity >= 75) {
            this.m_increment = -this.m_increment;
            this.m_intensity += this.m_increment;
        }

        if (this.m_intensity <= 0) {
            // make sure pixels all are off
            var offTimer = setInterval(this.off, 300);
            if (--this.m_repeats <= 0) {
                this.m_active = false;
            } else {
                this.m_increment = getRandomArbitrary(1, 5);
                clearInterval(offTimer);
            }
            return;
        }
        
        // Generate the color at the current intensity level
        var r =  this.m_red; //Math.round(map(this.m_red, 0, 255, 0, this.m_intensity)),
            g =  0; //Math.round(map(this.m_green, 0, 255, 0, this.m_intensity)),
            b =  0; //Math.round(map(this.m_blue, 0, 255, 0, this.m_intensity));
         
        // Write to both 'eyes'
        client.setPixel(this.m_pos, r, 0, 0);
        client.setPixel(this.m_pos + 1, r, 0, 0);
        client.writePixels();
    }


    this.off = function() {
        client.setPixel(m_pos, 0, 0, 0);
        client.setPixel(m_pos + 1, 0, 0, 0);
        client.writePixels();
    }
}



/**
 * Clone of Processing Map function
 */
function map(value, start1, stop1, start2, stop2)
{
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}


function millis()
{
    var d = new Date(),
        n = d.getMilliseconds();    

    return n - startMillis;
}


// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}


function setup()
{
    countdown = 0;
    var d = new Date(),
        n = d.getMilliseconds();    
    startMillis = n;

    for (i = 0; i < maxEyes; i++) {
        blinkers[i] = new Firefly();
    }
    
    client._reconnect();
    setInterval(loop, 500);
}


function loop()
{
    if (millis() - lastStep > stepInterval) {
    // console.log(millis(), lastStep, stepInterval, (millis() - lastStep > stepInterval));
        lastStep = millis();
        --countdown;
        for(var i = 0; i < maxEyes; i++) {
          // Only start a blink if the countdown is expired and there is an available blinker
          if ((countdown <= 0) && (blinkers[i].m_active == false)) {
            newPos = getRandomArbitrary(0, numPixels / 2) * 2;

            for(var j = 0; j < maxEyes; j++) {
              // avoid active or recently active pixels
              if ((blinkers[j].m_deadTime > 0) && (Math.abs(newPos - blinkers[j].m_pos) < 4)) {
                console.log(" Collision -");
                console.log(newPos);
                newPos = -1;  // collision - do not start
                break;
              }
            }

            // if we have a valid pixel to start with...
            if (newPos >= 0) {
                console.log(i);
                console.log(" Activate - ");
                console.log(newPos);
                blinkers[i].StartBlink(newPos);  
                countdown = getRandomArbitrary(intervalMin, intervalMax);  // random delay to next start
            }
          }
          // step all the state machines
           blinkers[i].step();
        }
        // update the strip
        client.writePixels();
    }
}

setup();