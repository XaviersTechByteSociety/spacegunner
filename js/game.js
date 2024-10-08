import Gun from "./gun.js";
import Aim from "./aim.js";
import Bolt from "./bolt.js";
import Enemy from "./enemy.js";
import Star from "./star.js";

export default class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.width = canvas.width;
        this.height = canvas.height;

        this.gunX = this.width * .25;
        this.gun2X = this.width * .75;

        this.aim = new Aim(this, 100);
        this.gun = new Gun(this);
        this.gun2 = new Gun(this);
        this.gun.x = this.gunX;
        this.gun2.x = this.gun2X;
        this.star = new Star(this);

        this.boltPool = [];
        this.numberOfbolt = 500;
        this.createBoltPool();
        this.score = 0;
        this.highScore = 0;
        this.life = 10;
        this.name = null;

        this.enemyPool = [];
        this.numberOfEnemies = 300;
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.createEnemyPool();

        this.starPool = [];
        this.numberOfStars = 3000; // Define the number of stars you want to create
        this.starTimer = 0;
        this.starInterval = 10; // Adjust the interval to control star creation
        this.createStarPool();


        this.keys = [];

        // State for button presses
        this.movingUp = false;
        this.movingDown = false;
        this.movingLeft = false;
        this.movingRight = false;

        this.start();
    }

    calculateHighScore() {
        if(this.score > this.highScore) {
            this.highScore = this.score;
        } else {
            this.highScore = this.highScore;
        }
    }
    // Basic utility functions
    debounce(func, delay) {
        let timeout;
        return function (...args) {

            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
    toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    start() {
        this.resize(window.innerWidth, window.innerHeight);
        this.addEventListeners();
    }
    // Cleanup method
    checkGameOver() {
        if (this.life <= 0) {
            
            return true;
        }
        return false;
    }

    destroy() {
        // Clear arrays that hold object instances
        this.boltPool = [];
        this.enemyPool = [];
        this.starPool = [];

        // Remove event listeners
        this.removeEventListeners();

        // Nullify key objects
        // this.aim = null;
        // this.gun = null;
        // this.gun2 = null;

        // Nullify canvas and context
        this.canvas = null;
        this.ctx = null;

        // this.gun.canShoot = true;
        // this.gun2.canShoot = true;
    }

    // Add references to the listeners so they can be removed later
    addEventListeners() {
        this.debounceResize = this.debounce((e) => {
            this.resize(e.target.innerWidth, e.target.innerHeight);
        }, 100);

        this.keydownListener = (e) => {
            if (this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        };
        this.keyupListener = (e) => {
            const index = this.keys.indexOf(e.key);
            if (index > -1) {
                this.keys.splice(index, 1);
            }
        };

        this.fullScreenListener = () => {
            this.toggleFullScreen();
        };

        this.resetListener = () => {
            window.location.reload();
        };

        window.addEventListener('resize', this.debounceResize);
        window.addEventListener('keydown', this.keydownListener);
        window.addEventListener('keyup', this.keyupListener);
        document.querySelector('#fullScreenButton').addEventListener('click', this.fullScreenListener);
        document.querySelector('#resetButton').addEventListener('click', this.resetListener);
        const up = document.querySelector('.up');
        up.addEventListener('touchstart', () => {
            up.classList.remove('bg-blue', 'bg-blue-active');
            up.classList.add('bg-blue-active')
            this.movingUp = true;
        })
        up.addEventListener('touchend', () => {
            up.classList.remove('bg-blue', 'bg-blue-active');
            up.classList.add('bg-blue')
            this.movingUp = false;
        })
        const down = document.querySelector('.down');
        down.addEventListener('touchstart', () => {
            down.classList.remove('bg-blue', 'bg-blue-active');
            down.classList.add('bg-blue-active')
            this.movingDown = true;
        })
        down.addEventListener('touchend', () => {
            down.classList.remove('bg-blue', 'bg-blue-active');
            down.classList.add('bg-blue')
            this.movingDown = false;
        })
        const left = document.querySelector('.left');
        left.addEventListener('touchstart', () => {
            left.classList.remove('bg-blue', 'bg-blue-active');
            left.classList.add('bg-blue-active')
            this.movingLeft = true;
        })
        left.addEventListener('touchend', () => {
            left.classList.remove('bg-blue', 'bg-blue-active');
            left.classList.add('bg-blue')
            this.movingLeft = false;
        })
        const right = document.querySelector('.right');
        right.addEventListener('touchstart', () => {
            right.classList.remove('bg-blue', 'bg-blue-active');
            right.classList.add('bg-blue-active')
            this.movingRight = true;
        })
        right.addEventListener('touchend', () => {
            right.classList.remove('bg-blue', 'bg-blue-active');
            right.classList.add('bg-blue')
            this.movingRight = false;
        })
        // Handle touch controls
        const shootButton = document.querySelector('.shoot');
        shootButton.addEventListener('touchstart', (event) => {
            if (event.cancelable) {
                event.preventDefault();
            }
            // Shoot button bg color
            shootButton.classList.remove('bg-red', 'bg-red-active')
            shootButton.classList.add('bg-red-active');
            // Check and shoot for both guns
            if (this.gun.canShoot) {
                this.gun.shoot(); // Fire gun1
                this.gun.canShoot = false; // Prevent continuous shooting for gun1
            }
            if (this.gun2.canShoot) {
                this.gun2.shoot(); // Fire gun2
                this.gun2.canShoot = false; // Prevent continuous shooting for gun2
            }
        });

        shootButton.addEventListener('touchend', (event) => {
            if (event.cancelable) {
                event.preventDefault();
            }
            // Reset shoot button bg color
            shootButton.classList.remove('bg-red', 'bg-red-active');
            shootButton.classList.add('bg-red');
            this.gun.canShoot = true; // Allow shooting again when the touch ends
            this.gun2.canShoot = true; // Allow shooting again when the touch ends
        });
    }

    removeEventListeners() {
        window.removeEventListener('resize', this.debounceResize);
        window.removeEventListener('keydown', this.keydownListener);
        window.removeEventListener('keyup', this.keyupListener);
        document.querySelector('#fullScreenButton').removeEventListener('click', this.fullScreenListener);
        document.querySelector('#resetButton').removeEventListener('click', this.resetListener);
        document.querySelector('.up').removeEventListener('touchstart', this.movingUpStart);
        document.querySelector('.up').removeEventListener('touchend', this.movingUpEnd);
        document.querySelector('.down').removeEventListener('touchstart', this.movingUpStart);
        document.querySelector('.down').removeEventListener('touchend', this.movingUpEnd);
        document.querySelector('.left').removeEventListener('touchstart', this.movingUpStart);
        document.querySelector('.left').removeEventListener('touchend', this.movingUpEnd);
        document.querySelector('.right').removeEventListener('touchstart', this.movingUpStart);
        document.querySelector('.right').removeEventListener('touchend', this.movingUpEnd);
        document.querySelector('.shoot').removeEventListener('touchstart', this.movingUpStart);
        document.querySelector('.shoot').removeEventListener('touchend', this.movingUpEnd);
    }


    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.aim.x = (this.width / 2) - (this.aim.width / 2);
        this.aim.y = (this.height / 2) - (this.aim.height / 2);
        this.gun.y = this.height + this.gun.height;
        this.gun2.y = this.height + this.gun2.height;
        this.gunX = this.width * .25;
        this.gun2X = this.width * .75;
        this.gun.x = this.gunX;
        this.gun2.x = this.gun2X;
    }

    // game logic : Calculation functions
    checkCollision(rect1, rect2) {
        // Extract the coordinates and dimensions of the rectangles
        const rect1Left = rect1.x;
        const rect1Right = rect1.x + rect1.width;
        const rect1Top = rect1.y;
        const rect1Bottom = rect1.y + rect1.height;

        const rect2Left = rect2.x;
        const rect2Right = rect2.x + rect2.width;
        const rect2Top = rect2.y;
        const rect2Bottom = rect2.y + rect2.height;

        // Check for overlap
        if (rect1Right < rect2Left || // Rect1 is to the left of Rect2
            rect1Left > rect2Right || // Rect1 is to the right of Rect2
            rect1Bottom < rect2Top || // Rect1 is above Rect2
            rect1Top > rect2Bottom) { // Rect1 is below Rect2
            return false; // No collision
        }

        return true; // Collision detected
    }

    getAngle(obj1X, obj1Y, obj2X, obj2Y) {
        const dx = obj1X - obj2X;
        const dy = obj1Y - obj2Y;
        this.angle = Math.atan2(dy, dx);
        return this.angle;
    }
    isInside(obj1X, obj1Y, obj2X, obj2Y, Obj2Radius) {
        const dx = obj1X - obj2X;
        const dy = obj1Y - obj2Y;
        return Math.hypot(dx, dy) < Obj2Radius;
    }

    // Bolt creation
    createBoltPool() {
        for (let i = 0; i < this.numberOfbolt; i++) {
            this.boltPool.push(new Bolt(this))
        }
    }
    getBolt() {
        if (!this.boltPool) {
            return null;
        } else {
            const foundbolt = this.boltPool.find(bolt => bolt.available);
            return foundbolt ? foundbolt : undefined;
        }
    }

    // Enemy creation
    createEnemyPool() {
        for (let i = 0; i < this.numberOfEnemies; i++) {
            this.enemyPool.push(new Enemy(this));
        }
    }
    getEnemy() {
        if (!this.enemyPool) {
            return null;
        } else {
            const foundEnemy = this.enemyPool.find(enemy => enemy.available);
            return foundEnemy ? foundEnemy : undefined;
        }
    }
    handleEnemy(deltaTime) {
        if (this.enemyTimer < this.enemyInterval) {
            this.enemyTimer += deltaTime;
        } else {
            this.enemyTimer = 0;
            const enemy = this.getEnemy();
            if (enemy) {
                enemy.start();
            }
        }
    }

    // Star creation
    createStarPool() {
        for (let i = 0; i < this.numberOfStars; i++) {
            this.starPool.push(new Star(this));
        }
    }

    getStar() {
        const foundStar = this.starPool.find(star => star.available);
        return foundStar ? foundStar : undefined;
    }

    handleStars(deltaTime) {
        if (this.starTimer < this.starInterval) {
            this.starTimer += deltaTime;
        } else {
            this.starTimer = 0;
            const star = this.getStar();
            if (star) {
                star.start();
            }
        }
    }

    drawStatusText() {
        this.ctx.save();

        // Set common style for both text
        this.ctx.fillStyle = 'cyan';
        this.ctx.font = '13px "Press Start 2P"';

        // Calculate the score and life position
        const scoreLifeX = this.canvas.width * 0.10; // 10% from the left
        const scoreLifeY = this.canvas.height * 0.06; // 6% from the top

        this.ctx.fillText(`Score: ${this.score} | Life: ${this.life}`, scoreLifeX, scoreLifeY);

        // Calculate name position
        const nameX = this.canvas.width - this.ctx.measureText(`Name: ${(this.name) ? this.name : 'Guest'}`).width - 100; // 10 pixels from the right
        const nameY = this.canvas.height * 0.06; // Same vertical position as score and life

        this.ctx.fillText(`Name: ${(this.name) ? this.name : 'Guest'}`, nameX, nameY);

        this.ctx.restore();
    }



    // Game Render Function
    render(deltaTime) {
        this.handleStars(deltaTime);
        this.starPool.forEach(star => {
            star.update(deltaTime);
            star.draw();
        });

        this.handleEnemy(deltaTime);
        this.enemyPool.forEach(enemy => {
            enemy.update(deltaTime);
            enemy.draw()
        })
        this.gun.update()
        this.gun2.update()
        this.aim.update(deltaTime)
        this.aim.draw()
        this.boltPool.forEach(bolt => {
            bolt.update(deltaTime);
            bolt.draw();
        })
        this.drawStatusText()
    }
}