export default class Gun {
    constructor(game, x) {
        this.game = game;
        this.width = 10;
        this.height = 150;
        this.x = x;
        this.y = this.game.height + this.height;
        this.bulletTimer = 0;
        this.bulletInterval = 100; // Delay between shots (not used since we are controlling single shots)

        this.canShoot = true; // Whether a new bullet can be fired

        // Handle touch controls
        const shootButton = document.querySelector('.shoot');
        shootButton.addEventListener('touchstart', (event) => {
            event.preventDefault(); // Prevent default touch behavior
            if (this.canShoot) {
                this.shoot(); // Fire immediately when touched
                this.canShoot = false; // Prevent continuous shooting
            }
        });

        shootButton.addEventListener('touchend', (event) => {
            event.preventDefault(); // Prevent default touch behavior
            this.canShoot = true; // Allow shooting again when the touch ends
        });
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
        // Get a bullet from the pool
        const bullet = this.game.getBolt(); // Assuming getBolt() gets a free bullet from the pool

        if (bullet) {
            // Calculate the angle between the gun tip and the aim
            const angle = this.game.getAngle(this.game.aim.x + this.game.aim.width / 2, this.game.aim.y + this.game.aim.height / 2, this.x, this.y - this.height);

            // Tip of the gun where the bullet should spawn (accounting for the gun rotation)
            const gunTipX = this.x + Math.cos(angle);
            const gunTipY = this.y - this.height + Math.sin(angle);

            // Speed and velocity
            const speed = 4; // Adjust the speed as needed
            const vx = speed * Math.cos(angle); // Horizontal velocity
            const vy = speed * Math.sin(angle); // Vertical velocity (negative since it should move upwards)

            // Start the bullet from the gun tip, with calculated velocity
            bullet.start(gunTipX, gunTipY, vx, vy);
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
