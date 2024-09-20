export default class Bolt {
    constructor(game) {
        this.game = game;
        this.height;
        this.width;
        this.speedX;
        this.speedY;
        this.zoomH = 1;
        this.zoomW = .5;
        this.available = true;
        this.rotation = 0; // Store the initial rotation of the bullet
    }

    start(x, y, speedX, speedY) {
        this.available = false;
        this.height = 20;
        this.width = 10;
        this.x = x;
        this.y = y;
        this.speedX = speedX * 500;
        this.speedY = speedY * 500;

        // Calculate the initial angle only once when the bolt is fired
        this.rotation = Math.atan2(speedY, speedX); // Store the angle
    }

    reset() {
        this.available = true;
    }

    update(deltaTime) {
        if (!this.available) {
            this.x += this.speedX * deltaTime / 1000;
            this.y += this.speedY * deltaTime / 1000;

            if (this.height > 0 || this.width > 0) {
                this.height -= this.zoomH;
                this.width -= this.zoomW;
            }

            // Check if the bullet is out of bounds and reset it
            if (this.y > this.game.height || this.x > this.game.width || this.x < 0 || this.y < 0) {
                this.reset();
            }
            if (this.height <= 0 || this.width <= 0) {
                this.reset();
            }
            
        }
    }

    draw() {
        if (!this.available) {
            this.game.ctx.save();

            // Move to the position of the bullet
            this.game.ctx.translate(this.x, this.y);
            // this.game.ctx.translate(this.x, this.y - this.height);

            // Use the stored rotation angle instead of recalculating it
            this.game.ctx.rotate(this.rotation + Math.PI / 2); // Fixed rotation of the bullet

            // Draw the bolt as a rectangle
            this.game.ctx.beginPath();
            this.game.ctx.fillStyle = "cyan";

            this.game.ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

            this.game.ctx.fill();
            this.game.ctx.restore();
        }
    }
}
