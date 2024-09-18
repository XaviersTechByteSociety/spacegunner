export default class Movement {
    constructor(game) {
        this.game = game;
        this.radius = 50;
        this.x = this.radius * 2;
        this.y = this.game.height - this.radius * 1.2;
        

        this.initX = this.x;
        this.initY = this.y;

        this.stickX = this.initX;
        this.stickY = this.initY;

        this.touchId = null;
    }

    draw() {
        this.game.ctx.lineWidth = 2;
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = '#e1e1e1';
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.game.ctx.stroke();

        this.game.ctx.beginPath();
        this.game.ctx.arc(this.stickX, this.stickY, this.radius / 2, 0, Math.PI * 2, true);
        this.game.ctx.stroke();
    }

    update(touchX, touchY) {
        const dx = touchX - this.x;
        const dy = touchY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.radius) {
            const angle = Math.atan2(dy, dx);
            this.stickX = this.x + Math.cos(angle) * this.radius;
            this.stickY = this.y + Math.sin(angle) * this.radius;
        } else {
            this.stickX = touchX;
            this.stickY = touchY;
        }
    }

    reset() {
        this.stickX = this.initX;
        this.stickY = this.initY;
        this.touchId = null;
    }
}