export default class Star {
    constructor(game) {
        this.game = game;
        this.x;
        this.y;
        this.z;
        this.radius = Math.random() * 2 + 1; // Random radius between 2 and 7
        this.speed = Math.random() * 10 + 2; // Speed based on Z-depth
        this.available = true;
        this.z = Math.random() * this.game.width * 2; // Simulate depth with a random Z-distance
    }

    start() {
        this.available = false;
        this.x = Math.random() * this.game.width - this.game.width / 2; // X near the center
        this.y = Math.random() * this.game.height - this.game.height / 2; // Y near the center
        this.z = Math.random() * this.game.width * 2; // Random depth from far away to close
    }

    reset() {
        this.available = true;
        this.z = Math.random() * this.game.width * 2; // Reset depth to a faraway value
    }

    update(deltaTime) {
        if (!this.available) {
            this.z -= this.speed * 100 * deltaTime / 1000; // Stars move faster as they get closer
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
