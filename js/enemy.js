export default class Enemy {
    constructor(game) {
        this.game = game;
        this.height = 100;
        this.width = 50;
        this.x = Math.floor(Math.random() * this.game.width) ;
        this.y = -this.height;
        this.speedY = 10;
        this.available = true;
    }
    update() {
        this.y += this.speedY;
    }
    draw() {
        this.game.ctx.beginPath();
        this.game.ctx.fillStyle = 'blue';
        this.game.ctx.rect(this.x, this.y, this.width, this.height);
        this.game.ctx.fill();
    }
}