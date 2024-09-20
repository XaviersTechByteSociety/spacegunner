import Game from "./game.js";

window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    const gameControls = document.querySelector('.gameControls');
    const onscreenControls = document.querySelector('.onscreenControls');
    // const start = document.querySelector('#start');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;



    // Check if canvas display none 
    // if (canvas.classList.contains('none')) {
    //     // remove all the control buttons
    //     onscreenControls.classList.remove('flex', 'none');
    //     onscreenControls.classList.add('none');
    //     gameControls.classList.remove('flex', 'none');
    //     gameControls.classList.add('none');
    // } else {
    //     // TODO - 
    //     onscreenControls.classList.remove('flex', 'none');
    //     onscreenControls.classList.add('flex');


        // set gameControls display flex if its a mobile device.
        // and display none if its not.
        // create the game object
    // }
    
    if (isMobileDevice()) {
        gameControls.classList.remove('flex', 'none');
        gameControls.classList.add('flex');
    } else {
        gameControls.classList.remove('flex', 'none');
        gameControls.classList.add('none');
    }

    // Function to check if its a mobile device
    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    startGame()
    function startGame() {
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