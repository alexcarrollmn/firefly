
var Utilities = {

}

/**
 * Clone of Processing Map function
 *
 * @param value
 * @param start1
 * @param stop1
 * @param start2
 * @param stop2
 * @returns {*}
 */
Utilities.map = function(value, start1, stop1, start2, stop2)
{
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};


/**
 * Get milliseconds since program start
 * @returns {number}
 */
Utilities.millis = function()
{
    var d = new Date(),
        n = d.getMilliseconds();    

    return n - startMillis;
};


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 *
 * @param min
 * @param max
 * @returns {number}
 */
Utilities.getRandomArbitrary = function(min, max)
{
  return Math.round(Math.random() * (max - min) + min);
};



module.exports = Utilities;