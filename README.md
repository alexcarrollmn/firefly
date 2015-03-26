# Firefly
Mimics the blinking patterns of fireflies using 12mm WS2811 LED strings, Fadecandy, and Raspberry Pi.

### firefly.js
Main controller file. Runs the random interval timers that drive the colors and blink-rates of the LEDs.

### utilities.js
Utility functions

### firefly-blink.js
Test code, originally modified from the Arduino code for [Spooky LED Eyes on Adafruit](https://learn.adafruit.com/random-spooky-led-eyes/). Namely used as a demo to get an idea of how Node.js works with Fadecandy.
