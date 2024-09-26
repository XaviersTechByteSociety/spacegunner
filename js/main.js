import Startup from "./startup.js";
import Game from "./game.js";

window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const startUpCanvas = document.querySelector('#startUpCanvas');
    const ctx = canvas.getContext('2d');
    const startUpCanvasCtx = startUpCanvas.getContext('2d');
    const gameControls = document.querySelector('.gameControls');
    const onscreenControls = document.querySelector('.onscreenControls');
    const startUpScreen = document.querySelector('#startUpScreen');
    const start = document.querySelector('#start');
    const gameOverScreen = document.querySelector('#gameOverScreen');
    const restart = document.querySelector('#restart');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startUpCanvas.width = window.innerWidth;
    startUpCanvas.height = window.innerHeight;

    let isGameStarted = false;
    let startup = null;
    let game = null;

    startScreen();

    // Handle start and restart
    start.addEventListener('click', startGame)
    restart.addEventListener('click', restartGame)


    // // ------------ FUNCTION DEFINITIONS ---------------
    // Function to check if its a mobile device
    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
    function fullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    }
    function startScreen() {
        startUpScreen.classList.add('flex');
        gameOverScreen.classList.add('none');
        startup = new Startup(startUpCanvas, startUpCanvasCtx);
        animateStartup();
    }

    function animateStartup() {
        animateStartup();
    }

    function animateStartup() {
        let lastTime = 0;
        function animate(timeStamp) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            if (startup) {
                startUpCanvasCtx.clearRect(0, 0, startUpCanvas.width, startUpCanvas.height);
                startup.render(deltaTime);
                requestAnimationFrame(animate);
            }
        }
        animate();
    }
    lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        if (startup) {
            startUpCanvasCtx.clearRect(0, 0, startUpCanvas.width, startUpCanvas.height);
            startup.render(deltaTime);
            requestAnimationFrame(animate);
        }
    }
    animate();


    // End the game.
    function endGame() {
        if (game) {
            game.destroy();
            game = null;
        }
        if (canvas.classList.contains('block')) {
            canvas.classList.remove('block');
            canvas.classList.add('none');
        }
        if (gameOverScreen.classList.contains('none')) {
            gameOverScreen.classList.remove('none');
            gameOverScreen.classList.add('flex');
        }
        if (onscreenControls.classList.contains('flex')) {
            onscreenControls.classList.remove('flex');
            onscreenControls.classList.add('none');
        }
        if (isMobileDevice()) {
            gameControls.classList.remove('flex', 'none');
            gameControls.classList.add('none');
        }
    }

    // Restart Game
    function restartGame() {
        isGameStarted = false;
        if (gameOverScreen.classList.contains('flex')) {
            gameOverScreen.classList.remove('flex');
            gameOverScreen.classList.add('none');
        }

        startGame();
    }

    // Start the game
    function startGame() {
        if (isGameStarted) return; // prevent restarting the game

        fullScreen();
        isGameStarted = true;
        start.disabled = true;

        // delete startup;
        if (startup) {
            startup.destroy();
            startup = null;
        }
        if (game) {
            game.destroy();
            game = null;
        }
        if (startUpScreen.classList.contains('flex')) {
            startUpScreen.classList.remove('flex');
            startUpScreen.classList.add('none');
        }
        if (canvas.classList.contains('none')) {
            canvas.classList.remove('none');
            canvas.classList.add('block')
            if (onscreenControls.classList.contains('none')) {
                onscreenControls.classList.remove('none');
                onscreenControls.classList.add('flex');
            }
            if (isMobileDevice()) {
                gameControls.classList.remove('flex', 'none');
                gameControls.classList.add('flex');
            } else {
                gameControls.classList.remove('flex', 'none');
                gameControls.classList.add('none');
            }
        }
        initGame()
    }


    // Initialize the game, create the game object
    function initGame() {
        game = new Game(canvas, ctx);
        let lastTime = 0;
        function animate(timeStamp) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (game.checkGameOver()) {
                endGame()
                return;
            }
            game.render(deltaTime);
            requestAnimationFrame(animate);
        }
        animate();
    }

})