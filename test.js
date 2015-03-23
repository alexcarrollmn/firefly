var OPC         = new require('./opc'),
    client      = new OPC('localhost', 7890),
    numPixels   = 50;

var millis = new Date().getMilliseconds();

function randomColors()
{
    var setupMillis = new Date().getMilliseconds();
    client.setPixelCount(numPixels);
    // turn them all off
    for (var i = 0; i < numPixels; i++ ) {
        var r = clamp(Math.round( ((128 + setupMillis * 0.002) + 255) * Math.random() ) * 0.75, 255),
            g = clamp(Math.round( ((128 + setupMillis * 0.002) + 255) * Math.random() ) * 0.75, 255),
            b = clamp(Math.round( ((128 + setupMillis * 0.002) + 255) * Math.random() ) * 0.75, 255);
        console.log("red: " + r, "green: " + g, "blue: " + b);
        client.setPixel(i, r, g, b);
    }

    client.writePixels();
}

function blinkOne()
{
    // var setupMillis = new Date().getMilliseconds();
    client.setPixelCount(numPixels);

    // turn off all pixels
    for (var i = 0; i < numPixels; i++) {
        client.setPixel(i, 0, 0, 0);
    }
    client.writePixels();

    // var timer = setInterval(function(){
        client.setPixel(Math.round(Math.random() * numPixels), 128, 0, 0);
        client.writePixels();
    // }, 500);
}

function clamp(value, max)
{
    if (value > max) {
        return max;
    }

    return value;
}

var timer = setInterval(blinkOne, 1000);