var OPC         = new require('./opc'),
    client      = new OPC('localhost', 7890),
    numPixels   = 50,
    colors = [
        [255, 26, 24], // red
        [255, 163, 23], // orange 1
        [255, 181, 23], // orange 2
        [233, 255, 11], // green
        [190, 253, 15], // green 2
        [237, 247, 1] // yellow
    ];

setInterval(function(){
    //turn off all pixels
    for (var i = 0; i < numPixels; i++) {
        client.setPixel(i, 0, 0, 0);
    }
    client.writePixels();

    var c = 0,
        limit = getRandomArbitrary(2, 10),
        pixel = Math.round( Math.random() * numPixels),
        colorIndex = Math.round( Math.random() * (colors.length - 1)),
        r          = colors[colorIndex][0],
        g          = colors[colorIndex][1],
        b          = colors[colorIndex][2];

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
    }, getRandomArbitrary(100, 500));

}, 3000);

function getRandomArbitrary(min, max)
{
    return Math.round(Math.random() * (max - min) + min);
};