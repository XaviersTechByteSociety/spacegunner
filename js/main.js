import Startup from "./startup.js";
import Game from "./game.js";
import { userCred } from "./authentication/authentication.js";
import { getDocument, updateDocument, userHighScore, getLeaderboard } from "./database/database.js";
import { auth } from "../firebase/firebase-conf.js";

window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('#loadingScreen');
    if(loadingScreen) loadingScreen.classList.remove('none')
    const canvas = document.querySelector('#canvas');
    const startUpCanvas = document.querySelector('#startUpCanvas');
    const ctx = (canvas) ? canvas.getContext('2d') : null;
    const startUpCanvasCtx = (startUpCanvas) ? startUpCanvas.getContext('2d') : null;
    const gameControls = document.querySelector('.gameControls');
    const onscreenControls = document.querySelector('.onscreenControls');
    const startUpScreen = document.querySelector('#startUpScreen');
    const start = document.querySelector('#start');
    const gameOverScreen = document.querySelector('#gameOverScreen');
    const restart = document.querySelector('#restart');
    const highScoreSpan = document.querySelector('#highScore');
    const scoreSpan = document.querySelector('#score');
    const singupGameover = document.querySelector('#signup-gameover');
    const leaderboard = document.querySelector('#leaderboard');
    const userName = document.querySelector('#userName');

    if (canvas) canvas.width = window.innerWidth;
    if (canvas) canvas.height = window.innerHeight;
    if (startUpCanvas) startUpCanvas.width = window.innerWidth;
    if (startUpCanvas) startUpCanvas.height = window.innerHeight;

    let isGameStarted = false;
    let startup = null;
    let game = null;


    startScreen();

    // Handle start and restart
    if (start) start.addEventListener('click', startGame)
    if (restart) restart.addEventListener('click', restartGame)

    // if (auth.currentUser) {
    //     if(leaderboard) leaderboard.classList.remove('none', 'block');
    //     if(leaderboard) leaderboard.classList.add('block');
    //     if (singupGameover) singupGameover.classList.remove('none', 'block');
    //     if (singupGameover) singupGameover.classList.add('none');
    // } else {
    //     if(leaderboard) leaderboard.classList.remove('none', 'block');
    //     if(leaderboard) leaderboard.classList.add('none');
    //     if (singupGameover) singupGameover.classList.remove('none', 'block');
    //     if (singupGameover) singupGameover.classList.add('block')
    // }
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            if (userName) userName.textContent = (userCred.name) ? userCred.name : 'N/A'; 
            if (leaderboard) leaderboard.classList.remove('none', 'block');
            if (leaderboard) leaderboard.classList.add('block');
            if (singupGameover) singupGameover.classList.remove('none', 'block');
            if (singupGameover) singupGameover.classList.add('none');

            // Populate leaderboard if necessary
            populateLeaderboard();
        } else {
            // User is not signed in.
            if (userName) userName.textContent = 'Guest';
            if (leaderboard) leaderboard.classList.remove('none', 'block');
            if (leaderboard) leaderboard.classList.add('none');
            if (singupGameover) singupGameover.classList.remove('none', 'block');
            if (singupGameover) singupGameover.classList.add('block');
        }
    });


    // // ------------ FUNCTION DEFINITIONS ---------------
    // Function to check if its a mobile device

    // Function to populate the leaderboard
    function populateLeaderboard() {
        const leaderboardTable = document.querySelector('#leaderboard-table');
        if (leaderboardTable)  leaderboardTable.innerHTML = ''; // Clear existing rows

        // Fetch the leaderboard data
        getLeaderboard().then((users) => {
            users.forEach((user, index) => {
                const row = document.createElement('tr');
                if (row) {
                    row.innerHTML = `
                    <td>${user.displayName || 'Anonymous'}</td>
                    <td>${user.highScore}</td>
                `;
                }
                if (leaderboardTable) leaderboardTable.appendChild(row);
            });
        }).catch(err => {
            console.error("Failed to load leaderboard:", err);
        });
    }

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
    function fullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    }
    function startScreen() {
        if (startUpScreen) startUpScreen.classList.add('flex');
        if (gameOverScreen) gameOverScreen.classList.add('none');
        startup = new Startup(startUpCanvas, startUpCanvasCtx);
        if(startup) {
            if(loadingScreen) loadingScreen.classList.add('none')
        }
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
                if (startUpCanvasCtx) startUpCanvasCtx.clearRect(0, 0, startUpCanvas.width, startUpCanvas.height);
                startup.render(deltaTime);
                requestAnimationFrame(animate);
            }
        }
        animate();
    }
    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        if (startup) {
            if (startUpCanvasCtx) startUpCanvasCtx.clearRect(0, 0, startUpCanvas.width, startUpCanvas.height);
            startup.render(deltaTime);
            requestAnimationFrame(animate);
        }
    }
    animate();


    // End the game.
    function endGame() {
        game.calculateHighScore();
        scoreSpan.innerText = game.score;

        if (auth.currentUser) {
            updateDocument(userCred.uid, game.highScore).then(() => {
                // Fetch the high score after updating
                getDocument(userCred.uid).then(() => {
                    if (gameOverScreen) highScoreSpan.innerText = userHighScore.highScore;

                    populateLeaderboard();
                });
            });
        }



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


    function initGame() {
        game = new Game(canvas, ctx);
        if (auth.currentUser) {
            getDocument(userCred.uid).then(() => { // Wait for the document to be fetched
                game.highScore = userHighScore.highScore; // Set the game's high score
            });
        }

        let lastTime = 0;
        function animate(timeStamp) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (game.checkGameOver()) {
                endGame();
                return;
            }
            game.name = (userCred.name) ? userCred.name : null;
            game.render(deltaTime);
            requestAnimationFrame(animate);
        }
        animate();
    }

})