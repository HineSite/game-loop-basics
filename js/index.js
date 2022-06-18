import { GameLoop } from './GameLoop.js';

(function () {
    let debugLogs = true;
    let gameLoop = new GameLoop(onRun, onStart, onStop, onPause, onResume, 60);
    let car = document.querySelector('#car');

    let roadLengthMeters = 300;
    let carSpeedMeters = 15; // meters/second

    let screenWidth = document.documentElement.clientWidth;
    let pixelsPerMeter = (screenWidth / roadLengthMeters);
    let carSpeedPixels = (carSpeedMeters * pixelsPerMeter); // pixels/second
    let documentHasFocus = true;
    let userPaused = false;

    gameLoop.logger = (type, message) => {
        logType(type, message);
    };

    gameLoop.initialize(() => {
        window.addEventListener('keydown', function(event) {
            if (event.key === ' ') { // space
                event.preventDefault();

                if (gameLoop.loopState === GameLoop.LoopState.STOPPED) {
                    gameLoop.start();
                }
                else if (gameLoop.loopState === GameLoop.LoopState.PAUSED) {
                    userPaused = false;
                    gameLoop.resume();
                }
                else if (gameLoop.loopState === GameLoop.LoopState.RUNNING) {
                    userPaused = true;
                    pause();
                }
            }
        });
    });

    function pause() {
        gameLoop.pause(() => {
            if (!userPaused && document.hasFocus()) {
                documentHasFocus = true;
                gameLoop.resume();
            }
        }, 600);
    }

    function onRun (delayMilli, delaySeconds) {
        if (!document.hasFocus()) {
            if (documentHasFocus) {
                pause();
            }

            documentHasFocus = false;
            return;
        }

        let moveDistance = (carSpeedPixels * delaySeconds);
        let currentLeft = car.offsetLeft;
        let newLeft = (car.offsetLeft + moveDistance);

        if (newLeft !== currentLeft) {
            log(GameLoop.LogType.DEBUG,
                'moving car', moveDistance.toFixed(4) + ' pixels to ' + newLeft.toFixed(4)
                + ' | Delay: ' + delayMilli.toFixed(4) + ' ms'
            );
        }

        if (newLeft < screenWidth) {
            car.style.left = newLeft + 'px';
        }
        else {
            gameLoop.stop();
        }
    }

    function onStart () {
        log(GameLoop.LogType.INFO, 'Loop State', 'Started');

        log(GameLoop.LogType.INFO, 'roadLengthMeters', roadLengthMeters);
        log(GameLoop.LogType.INFO, 'carSpeedMeters', carSpeedMeters);
        log(GameLoop.LogType.INFO, 'screenWidth', screenWidth);
        log(GameLoop.LogType.INFO, 'pixelsPerMeter', pixelsPerMeter);
        log(GameLoop.LogType.INFO, 'carSpeedPixels', carSpeedPixels);
        log(GameLoop.LogType.INFO, 'realWorldTime', (roadLengthMeters / carSpeedMeters) + ' seconds');
    }

    function onStop () {
        if (gameLoop.loopState !== GameLoop.LoopState.STOPPED)
            return;

        log(GameLoop.LogType.INFO, 'Loop State', 'Stopped');
    }

    function onPause () {
        if (gameLoop.loopState !== GameLoop.LoopState.PAUSED)
            return;

        log(GameLoop.LogType.INFO, 'Loop State', 'Paused');
    }

    function onResume () {
        log(GameLoop.LogType.INFO, 'Loop State', 'Resumed');
    }

    function log(type, title, message) {
        logType(type, title + ': ' + message);
    }

    function logType(type, message) {
        if (!debugLogs && type === GameLoop.LogType.DEBUG)
            return;

        console.log(type.description + ' - ' + message);
    }
})();
