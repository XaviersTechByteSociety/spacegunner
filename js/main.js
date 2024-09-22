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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startUpCanvas.width = window.innerWidth;
    startUpCanvas.height = window.innerHeight;

    startScreen()

    // 
    start.disabled = false;


    // Handle start game
    start.addEventListener('click', startGame);


   

    // // ------------ FUNCTION DEFINITIONS ---------------
    // Function to check if its a mobile device
    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    // Startup Screen
    function startScreen() {
        const startup = new Startup(startUpCanvas, startUpCanvasCtx);
        let lastTime = 0;
        function animate(timeStamp) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            startUpCanvasCtx.clearRect(0, 0, startUpCanvas.width, startUpCanvas.height);
            startup.render(deltaTime);
            requestAnimationFrame(animate);
        }
        animate();
    }


    // Start the game
    let isGameStarted = false;
    function startGame() {
        if(isGameStarted) return; // prevent restarting the game

        start.disabled = true;
        toggleFullScreen();
        if (startUpScreen.classList.contains('flex')) {
            startUpScreen.classList.remove('flex');
            startUpScreen.classList.add('none');
        }
        startUpScreen.classList.add('none');
        if (canvas.classList.contains('none')) {
            canvas.classList.remove('none');
            canvas.classList.add('block')
            onscreenControls.classList.remove('none');
            onscreenControls.classList.add('flex');
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
        const game = new Game(canvas, ctx);
        let lastTime = 0;
        function animate(timeStamp) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.render(deltaTime);
            requestAnimationFrame(animate);
        }
        animate();
    }

})