export default class Gun {
    constructor(game) {
        this.game = game;
        this.width = 10;
        this.height = 150;
        this.x;
        this.y = this.game.height + this.height;
        this.boltTimer = 0;
        this.boltInterval = 100; // Delay between shots (not used since we are controlling single shots)
        this.canShoot = true; // Whether a new bolt can be fired
    }

    update() {
        // Handle space bar shooting
        if (this.game.keys.includes(' ')) {
            if (this.canShoot) {
                this.shoot(); // Fire immediately when space is pressed
                this.canShoot = false; // Prevent continuous shooting
            }
        } else {
            this.canShoot = true; // Reset shooting ability when space is released
        }
    }

    shoot() {
        // Get a bolt from the pool
        const bolt = this.game.getBolt(); // Assuming getBolt() gets a free bolt from the pool

        if (bolt) {
            // Calculate the angle between the gun tip and the aim
            const angle = this.game.getAngle(this.game.aim.x + this.game.aim.width / 2, this.game.aim.y + this.game.aim.height / 2, this.x, this.y - this.height);

            // Tip of the gun where the bolt should spawn (accounting for the gun rotation)
            const gunTipX = this.x + Math.cos(angle);
            const gunTipY = this.y - this.height + Math.sin(angle);

            // Speed and velocity
            const speed = 4; // Adjust the speed as needed
            const vx = speed * Math.cos(angle); // Horizontal velocity
            const vy = speed * Math.sin(angle); // Vertical velocity (negative since it should move upwards)

            // Start the bolt from the gun tip, with calculated velocity
            bolt.start(gunTipX, gunTipY, vx, vy);
        }
    }

    draw() {
        this.game.ctx.save();

        // Step 1: Move the origin to the tip of the gun (opposite the pivot)
        this.game.ctx.translate(this.x, this.y - this.height);

        // Step 2: Calculate the angle towards the aim and rotate the gun
        const angle = this.game.getAngle(this.game.aim.x + this.game.aim.width / 2, this.game.aim.y + this.game.aim.height / 2, this.x, this.y - this.height);
        this.game.ctx.rotate(angle + Math.PI / 2); // Adjust by 90 degrees to correct orientation

        // Step 3: Draw the gun so that it rotates from the tip, following the aim
        this.game.ctx.beginPath();
        this.game.ctx.fillStyle = "blue";

        // Now, the gun is drawn from its tip (0, 0) downward
        this.game.ctx.rect(-this.width / 2, -this.height, this.width, this.height);

        this.game.ctx.fill();
        this.game.ctx.restore();
    }
}
