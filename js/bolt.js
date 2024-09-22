export default class Bolt {
    constructor(game) {
        this.game = game;
        this.height;
        this.width;
        this.speedX;
        this.speedY;
        this.zoomH = 1;
        this.zoomW = 1 / 2;
        this.available = true;
        this.rotation = 0; // Store the initial rotation of the bullet
        this.distanceTraveled = 0; // Track how far the bolt has traveled
        this.maxDistance = 500; // Set the max distance the bolt can travel
        this.deceleration = 0.95; // Deceleration factor to slow down the bolt
    }

    start(x, y, speedX, speedY) {
        this.available = false;
        this.height = 20;
        this.width = 10;
        this.x = x;
        this.y = y;
        this.speedX = speedX * 500;
        this.speedY = speedY * 500;

        this.distanceTraveled = 0; // Reset distance traveled on start
        this.rotation = Math.atan2(speedY, speedX); // Store the angle
    }

    reset() {
        this.available = true;
    }

    update(deltaTime) {
        if (!this.available) {
            // Calculate distance to move this frame
            const distanceX = this.speedX * deltaTime / 1000;
            const distanceY = this.speedY * deltaTime / 1000;
            this.x += distanceX;
            this.y += distanceY;

            // Increase the distance traveled by the bolt
            this.distanceTraveled += Math.hypot(distanceX, distanceY);

            // Slow down the bolt gradually
            this.speedX *= this.deceleration;
            this.speedY *= this.deceleration;

            // Reduce the size of the bolt to simulate distance effect
            if (this.height > 0 || this.width > 0) {
                this.height -= this.zoomH;
                this.width -= this.zoomW;
            }

            // Check if the bolt has traveled its max distance or gone out of bounds
            if (this.distanceTraveled >= this.maxDistance || this.x > this.game.width || this.x < 0 || this.y > this.game.height || this.y < 0) {
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

            // Move to the position of the bolt
            this.game.ctx.translate(this.x, this.y);

            // Use the stored rotation angle
            this.game.ctx.rotate(this.rotation + Math.PI / 2); // Rotate the bolt

            // Draw the bolt as a rectangle
            this.game.ctx.beginPath();
            this.game.ctx.fillStyle = "cyan";
            this.game.ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.game.ctx.fill();
            this.game.ctx.restore();
        }
    }
}
