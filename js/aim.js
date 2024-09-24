export default class Aim {
    constructor(game) {
        this.game = game;
        this.height = 70;
        this.width = 70;
        this.x = (this.game.width / 2);
        this.y = (this.game.height / 2);
        this.speedX = 700;
        this.speedY = 700;

        // Image
        this.image = new Image();
        this.image.src = './assets/crosshair.png'
    }
    update(deltaTime) {
        this.game.deltaTime = deltaTime;
        // Movement based on button state
        if (this.game.movingUp) this.y -= this.speedY * deltaTime / 1000;
        if (this.game.movingDown) this.y += this.speedY * deltaTime / 1000;
        if (this.game.movingLeft) this.x -= this.speedX * deltaTime / 1000;
        if (this.game.movingRight) this.x += this.speedX * deltaTime / 1000;

        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.x <= 0) this.x = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
        if (this.y <= 0) this.y = 0;

        if (this.game.keys.includes('ArrowUp')) this.y -= this.speedY * deltaTime / 1000;
        if (this.game.keys.includes('ArrowDown')) this.y += this.speedY * deltaTime / 1000;
        if (this.game.keys.includes('ArrowLeft')) this.x -= this.speedX * deltaTime / 1000;
        if (this.game.keys.includes('ArrowRight')) this.x += this.speedX * deltaTime / 1000;

    }
    draw() {
        this.game.ctx.save();
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = 'cyan';
        this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        // this.game.ctx.rect(this.x, this.y, this.height, this.width);
        this.game.ctx.stroke();
        this.game.ctx.restore();
    }
}