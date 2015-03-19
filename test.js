var OPC         = new require('./opc'),
    client      = new OPC('localhost', 7890),
    numPixels   = 50;

var millis = new Date().getMilliseconds();

function setup()
{
    var setupMillis = new Date().getMilliseconds();
    client.setPixelCount(numPixels);
    // turn them all off
    for (var i = 0; i < numPixels; i++ ) {
        client.setPixel(i, 255, 128, 0);
    }

    client.writePixels();

    console.log(setupMillis);
    if (setupMillis > 300)
        clearInterval(timer);
}

var timer = setInterval(setup, 300);