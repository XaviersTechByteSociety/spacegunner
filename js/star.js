export default class Star {
    constructor(game) {
        this.game = game;
        this.x;
        this.y;
        this.z;
        this.radius = Math.random() * 2 + 1; // Random radius between 2 and 7
        this.speed = 15; // Speed at which stars move towards the screen
        this.available = true;
    }

    start() {
        this.available = false;
        this.x = Math.random() * this.game.width - this.game.width / 2; // Reset X near the center
        this.y = Math.random() * this.game.height - this.game.height / 2; // Reset Y near the center
        this.z = Math.random() * this.game.width; // Reset Z (depth)
    }

    reset() {
        this.available = true;
    }

    update(deltaTime) {
        if (!this.available) {
            this.z -= this.speed * 100 * deltaTime / 1000; // Decrease Z to make the stars move forward
            if (this.z <= 0) {
                this.reset(); // Reset star if it reaches the front
            }
        }
    }

    draw() {
        if (!this.available) {
            const scale = this.game.width / this.z; // Scale based on Z-depth
            const x = (this.x * scale) + this.game.width / 2; // Project X
            const y = (this.y * scale) + this.game.height / 2; // Project Y
            const radius = this.radius * scale; // Scale radius based on Z-depth

            this.game.ctx.beginPath();
            this.game.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.game.ctx.fillStyle = "white"; // Color of the stars
            this.game.ctx.fill();
        }
    }
}
