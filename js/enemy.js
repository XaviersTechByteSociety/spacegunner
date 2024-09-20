export default class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.speed = 400; // Movement speed for both X and Y
        this.zoomW = 0.9; // Zoom for width in Z-plane
        this.zoomH = 0.18; // Zoom for height in Z-plane
        this.available = true;
        this.targetX = 0; // Target X for center movement
        this.targetY = 0; // Target Y for center movement
        this.inZPlane = false; // Flag to indicate Z-plane movement
    }

    start() {
        this.available = false;

        // Randomly spawn from the top left or right
        if (Math.random() < 0.5) {
            this.x = -this.width; // Spawn from the left
        } else {
            this.x = this.game.width + this.width; // Spawn from the right
        }

        this.y = Math.random() * (this.game.height * .9); // Start near the top

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

                if (distanceToCenter > 0.1) { // Prevent division by zero or small values
                    const moveX = (deltaX / distanceToCenter) * this.speed * deltaTime / 1000;
                    const moveY = (deltaY / distanceToCenter) * this.speed * deltaTime / 1000;
                
                    this.x += moveX;
                    this.y += moveY;

                    // const prevX = this.x;
                    // const prevY = this.y;
                    // if (prevX === this.x || prevY === this.y) console.log(`Enemy position: (${prevX}, ${prevY}), In Z-plane: ${this.inZPlane}`);
                }

                // If the enemy reaches the target center, switch to Z-plane movement
                if (distanceToCenter < 10) { // Threshold to determine when to start Z-plane
                    this.inZPlane = true;
                }
            } else {
                // Phase 2: Z-plane movement (move downward and grow in size)
                this.y += this.speed * 1.5 * deltaTime / 1000; // Move downward faster (toward the player)

                // Apply zoom to simulate forward movement
                if (this.height < 200) { // Cap the maximum size for 3D effect
                    this.width += this.zoomW;
                    this.height += this.zoomH;
                }
            }

            // Check for collision with bolts
            this.game.boltPool.forEach(bolt => {
                if (!bolt.available && this.game.checkCollision(this, bolt)) {
                    bolt.reset();
                    this.reset();
                }
            });

            // Check if enemy goes out of bounds
            if (this.y > this.game.height || this.x > this.game.width || this.x < -this.width) {
                this.reset();
            }
        }
    }

    draw() {
        if (!this.available) {
            this.game.ctx.save();

            // 3D transformation (scale the enemy as they move forward)
            const scaleFactor = 1 - (this.height / 300); // Adjust scale factor for perspective
            this.game.ctx.translate(this.x, this.y);
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









// export default class Enemy {
//     constructor(game) {
//         this.game = game;
//         this.width = 0;
//         this.height = 0;
//         this.x = 0;
//         this.y = 0;
//         this.speedX = Math.random() < 0.5 ? -Math.random() * 0.5 : Math.random() * 0.5;
//         this.speedY = 0.09; 
//         this.zoomW = 0.08; 
//         this.zoomH = 0.04;
//         this.available = true;
//     }

//     start() {
//         this.available = false;

//         // Initialize position
//         this.x = Math.floor(Math.random() * (this.game.width * 0.1)) + this.game.width * 0.45;
//         const landHeight = this.game.height * 0.5; // Assuming half the screen is land
//         this.y = landHeight;

//         this.width = 0;
//         this.height = 0;
//     }

//     reset() {
//         this.available = true;
//     }

//     update(deltaTime) {
//         if (!this.available) {
//             // Update position based on speed and zoom factors
//             this.x += this.speedX * (1 + this.width / 100);
//             this.y += this.speedY * (1 + this.height / 100);

//             // Apply zoom effect to create 3D illusion
//             if (this.height < 100) { // Limit the maximum height
//                 this.width += this.zoomW;
//                 this.height += this.zoomH;
//             }

//             this.game.boltPool.forEach(bolt => {
//                 if (!bolt.available && this.game.checkCollision(this, bolt)) {
//                     bolt.reset()
//                     this.reset()
//                 }
//             })
//             // Check if the spaceship has moved out of bounds
//             if (this.y > this.game.height || this.x > this.game.width || this.x < -this.width) {
//                 this.reset();
//             }
//         }
//     }

//     draw() {
//         if (!this.available) {
//             this.game.ctx.save();

//             // Apply 3D transformation (perspective)
//             const scaleFactor = 1 - (this.height / 200); // Adjust the scale factor as needed
//             this.game.ctx.translate(this.x, this.y);
//             this.game.ctx.scale(scaleFactor, scaleFactor);

//             this.game.ctx.beginPath();
//             this.game.ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
//             this.game.ctx.fillStyle = "cyan";
//             this.game.ctx.fill();
            
//             this.game.ctx.restore();
//         }
//     }
// }
