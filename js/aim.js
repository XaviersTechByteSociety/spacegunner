export default class Aim {
    constructor(game) {
        this.game = game;
        this.height = 50;
        this.width = 50;
        this.x = (this.game.width / 2);
        this.y = (this.game.height / 2);
        this.speedX = 600;
        this.speedY = 600;

        // State for button presses
        this.movingUp = false;
        this.movingDown = false;
        this.movingLeft = false;
        this.movingRight = false;

        // Set up event listeners for button presses
        document.querySelector('.up').addEventListener('touchstart', () => this.movingUp = true);
        document.querySelector('.up').addEventListener('touchend', () => this.movingUp = false);
        document.querySelector('.down').addEventListener('touchstart', () => this.movingDown = true);
        document.querySelector('.down').addEventListener('touchend', () => this.movingDown = false);
        document.querySelector('.left').addEventListener('touchstart', () => this.movingLeft = true);
        document.querySelector('.left').addEventListener('touchend', () => this.movingLeft = false);
        document.querySelector('.right').addEventListener('touchstart', () => this.movingRight = true);
        document.querySelector('.right').addEventListener('touchend', () => this.movingRight = false);
    }
    update(deltaTime) {
        this.game.deltaTime = deltaTime;
        // Movement based on button state
        if (this.movingUp) this.y -= this.speedY * deltaTime / 1000;
        if (this.movingDown) this.y += this.speedY * deltaTime / 1000;
        if (this.movingLeft) this.x -= this.speedX * deltaTime / 1000;
        if (this.movingRight) this.x += this.speedX * deltaTime / 1000;

        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.x <= 0) this.x = this.width;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
        if (this.y <= 0) this.y = this.height;

        if (this.game.keys.includes('ArrowUp')) this.y -= this.speedY * deltaTime / 1000;
        if (this.game.keys.includes('ArrowDown')) this.y += this.speedY * deltaTime / 1000;
        if (this.game.keys.includes('ArrowLeft')) this.x -= this.speedX * deltaTime / 1000;
        if (this.game.keys.includes('ArrowRight')) this.x += this.speedX * deltaTime / 1000;

    }
    draw() {
        this.game.ctx.save();
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = 'cyan';
        this.game.ctx.rect(this.x, this.y, this.height, this.width);
        this.game.ctx.stroke();
        this.game.ctx.restore();
    }
}