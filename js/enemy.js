export default class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 0;
        this.height = 0;
        this.x;
        this.y;
        this.spawnSide = Math.floor(Math.random() * 3) + 1; // Random number from 1 to 3
        if (this.spawnSide === 1) {
            this.spawnSide = 'right'; // 1 for right
        } else if (this.spawnSide === 2) {
            this.spawnSide = 'top'; // 2 for top
        } else if (this.spawnSide === 3) {
            this.spawnSide = 'left'; // 3 for left
        }
        this.speed = 400; // Movement speed for both X and Y
        this.zoomW = 0.9; // Zoom for width in Z-plane
        this.zoomH = 0.18; // Zoom for height in Z-plane
        this.available = true;
        this.targetX = 0; // Target X for center movement
        this.targetY = 0; // Target Y for center movement
        this.inZPlane = false; // Flag to indicate Z-plane movement
        this.rotation = 0; // Rotation angle
        this.zDirectionX = 1.5; // X direction when moving in Z-plane
        this.zDirectionY = 1.2; // Y direction when moving in Z-plane
    }



    start() {
        this.available = false;
    
         // Randomly spawn from the left, right, or top
        if (this.spawnSide === 'left') {
            this.x = -this.width; // Spawn from the left
            this.y = Math.random() * this.game.height; // Random Y position
        } else if (this.spawnSide === 'right') {
            this.x = this.game.width; // Spawn from the right
            this.y = Math.random() * this.game.height; // Random Y position
        } else if (this.spawnSide === 'top') {
            this.x = Math.random() * this.game.width; // Random X position
            this.y = 0; // Spawn from the top
        }
    
    
        // Set a target point near the center, add some variation to avoid always hitting exact center
        this.targetX = (this.game.width / 2) + (Math.random() * this.game.width * 0.5 - this.game.width * 0.25); 
        this.targetY = (this.game.height * 0.3) + (Math.random() * this.game.height * 0.4 - this.game.height * 0.2);
    
        // Reset size and Z-plane movement
        this.width = 40;
        this.height = 20;
        this.inZPlane = false;
    }
    

    reset() {
        this.available = true;
    }

    update(deltaTime) {
        if (!this.available) {
            // Phase 1: Move toward the center (X, Y plane)
            if (!this.inZPlane) {
                const deltaX = this.targetX - this.x;
                const deltaY = this.targetY - this.y;
                const distanceToCenter = Math.hypot(deltaX, deltaY);

                // Calculate rotation angle towards the target
                this.rotation = Math.atan2(deltaY, deltaX);

                if (distanceToCenter > 0.1) { // Prevent division by zero or small values
                    const moveX = (deltaX / distanceToCenter) * this.speed * deltaTime / 1000;
                    const moveY = (deltaY / distanceToCenter) * this.speed * deltaTime / 1000;
                

                    this.x += moveX;
                    this.y += moveY;
                }

                // If the enemy reaches the target center, switch to Z-plane movement
                if (distanceToCenter < 10) { // Threshold to determine when to start Z-plane
                    this.inZPlane = true;

                    // Set a diagonal direction for Z-plane movement
                    this.zDirectionX = (Math.random() < 0.5 ? -1 : 1) * Math.random(); // Random diagonal direction
                }
            } else {
                // Phase 2: Z-plane movement (move diagonally and grow in size)
                this.x += this.zDirectionX * this.speed * deltaTime / 1000; // Move diagonally in X
                this.y += this.zDirectionY * this.speed * deltaTime / 1000; // Move downward faster (toward the player)

                // Apply zoom to simulate forward movement
                if (this.height < 200) { // Cap the maximum size for 3D effect
                    this.width += this.zoomW;
                    this.height += this.zoomH;
                }
            }

            // Check for collision with bolts
            this.game.boltPool.forEach(bolt => {
                if (!bolt.available && this.game.checkCollision(this, bolt)) {
                    this.game.score += 1;
                    bolt.reset();
                    this.reset();
                }
            });

            // Check if enemy goes out of bounds
            if (this.y > this.game.height || this.x > this.game.width || this.x < -this.width) {
                this.reset();
                if (this.game.life > 0) this.game.life -= 1;
            }
        }
    }

    draw() {
        if (!this.available) {
            this.game.ctx.save();

            // Move to the position of the enemy
            this.game.ctx.translate(this.x, this.y);

            // Apply rotation in the X-Y plane based on the movement direction
            if (!this.inZPlane) {
                this.game.ctx.rotate(this.rotation); // Rotate the enemy to face the movement direction
            }

            // 3D transformation (scale the enemy as they move forward)
            const scaleFactor = 1 - (this.height / 300); // Adjust scale factor for perspective
            this.game.ctx.scale(scaleFactor, scaleFactor);

            // Draw the enemy spaceship
            this.game.ctx.beginPath();
            this.game.ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.game.ctx.fillStyle = "cyan";
            this.game.ctx.fill();

            this.game.ctx.restore();
        }
    }
}
