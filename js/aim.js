export default class Aim {
    constructor(game) {
        this.game = game;
        this.height = 50;
        this.width = 50;
        this.x = (this.game.width / 2);
        this.y = (this.game.height / 2);
        this.speedX = 200;
        this.speedY = 200;
    }
    update() {
        if (this.game.mouse.x !== undefined && this.game.mouse.y !== undefined) {
            this.x = this.game.mouse.x - this.width;
            this.y = this.game.mouse.y - this.height;
        }
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