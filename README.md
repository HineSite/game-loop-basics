# Game Loop Basics
A simple demonstration of the calculations used to move an object across the screen in a javascript loop with inconsistent loop times.
The calculations are based on a car moving across the screen at a predefined speed.
This demonstration also shows the conversion of real world measurements into pixels.

# Explanation
### World Conversions
For this demonstration, the road's length and the car's speed have arbitrarily been set to 300 meters and 15 meters per second, respectively.
To move the car in pixels, the road's length and the car's speed must be converted to pixel measurements.

Since the road is the width of the screen, the screen's width in pixels can be used to represent the road's length.

Some simple math will be needed to convert the car's speed to pixels.
To convert meters per second into pixels per second, it is necessary to know how many pixels represent 1 meter.
To do that, the road's length in pixels (i.e. the screen width) is divided by the road length in meters.

The calculation for a screen that is 1920px wide would look like this:
```
 1920 px / 300 m = 6.4 px/m
```

To convert the speed of the car from meters per second to pixels per second, 
the pixels per meters are multiplied by the speed of the car in meters per second. Like so:
```
6.4 px/m * 15 m/s = 96 px/s
```

This means the car needs to move at 96 pixels per second to reach the end of the road
in the same time it would take an actual car moving at 15 meters per second to reach the end
of a 300 meter long road.

### Loop Calculations
Because of limited CPU resources, the frequency at which the car's position can be updated is limited.
The more frequently the car's position is updated, the smoother the car's movement across the screen will be.
Games typically strive to reach 120 to 240 updates per second (i.e. frames per second) on high-end hardware.

In this demonstration, the frames per second (fps) are controlled by changing the main loop's javascript timeout delay.
The javascript timeout delay is specified in milliseconds. To target 60 frames per second, the delay is set to 17 milliseconds.
60 frames per second would actually be an interval of 16.667 milliseconds, but the javascript timeout only allows for whole numbers, so it is necessary to round.

The millisecond interval used for the loop delay can be calculated by dividing 1 second in milliseconds by the target frame rate (fps).
```
1000 ms / 60 fps = 16.667 ms
```

Depending on the CPU load, the loop may or may not be executed every 17 milliseconds.
Therefore, to keep the cars speed consistent, and to prevent the car from arriving at the end of the road too early or too late, it is necessary to compensate for the inconsistent delays.
To do so, a timestamp is generated during each loop run, and is used to calculate the actual time that has passed since the last run.
The math for this is simply subtracting the last timestamp with the timestamp for the current loop run.
```
currentTimestamp - lastTimestamp = actualDelay
```

### Calculating the Car's actual movement
For this demonstration, the car is moving at 96 pixels per second, but the loop is updating the cars position about 60 times per second.
In other words, the cars position is only moving a few pixels each time the main loop is run.
To calculate just how many pixels the car needs to move, the car's speed (in pixels per second) is multiplied by the time (in seconds) passed since the last position update.
Assuming the time passed since the last position update is 17 milliseconds, the math would look like this:
```
96 px/s * (17 ms / 1000 ms) = 1.632 px
```
Put another way, the car moves 1.632 pixels every 17 milliseconds.

# Problems and Limitations
The main problem with this demonstration is the precision of the timestamp.
Depending on the browser and its settings, the timestamp may be rounded to the nearest 100 milliseconds or more.
This means, when targeting sub 100 millisecond delays, there is no way to adjust for the actual time passed between loops, as it will be very likely less than 100 milliseconds.

The effects of this means the calculated delay (actualDelay), will be 0 milliseconds for several loops, then will jump to 100 milliseconds for a loop.
In other words, the car's position will only be updated once every 100 milliseconds, preventing smooth movement.

Despite the low precision of the timestamp in some browsers, the loop will still run at the desired 17 millisecond interval. 
So, when the actual delay cannot be accurately calculated, it is best to simply rely on the timeout and assume the actual interval is constant and accurate.
To avoid inaccurately calculating the delay, the precision is checked during the initialization of the game loop and a flag is set to only allow delay adjustments if the precision is greater than the target loop delay.

In addition to low precision timestamps, some browsers/settings will introduce some amount of randomness to the delay provided to the javascript timeout.
This makes it doubly important to adjust for the real/actual time passed between updates.
