import Aim from "./aim.js";
import Gun from "./gun.js";
import Bolt from "./bolt.js";
import Enemy from "./enemy.js";
import Star from "./star.js";

export default class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.width = canvas.width;
        this.height = canvas.height;

        this.aim = new Aim(this, 100);
        this.gun = new Gun(this, this.width * .25);
        this.gun2 = new Gun(this, this.width * .75);
        this.star = new Star(this)

        this.boltPool = [];
        this.numberOfbolt = 500;
        this.createboltPool();

        this.enemyPool = [];
        this.numberOfEnemies = 3000;
        this.enemyTimer = 0;
        this.enemyInterval = 500;
        this.createEnemyPool();

        this.starPool = [];
        this.numberOfStars = 3000; // Define the number of stars you want to create
        this.starTimer = 0;
        this.starInterval = 10; // Adjust the interval to control star creation
        this.createStarPool();


        this.keys = [];

        this.start();
        // this.toggleFullScreen();

        // Debounced resize function
        window.addEventListener('resize', this.debounce((e) => {
            this.resize(e.target.innerWidth, e.target.innerHeight);
        }, 100));
        window.addEventListener('keydown', e => {
            if (this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        })
        window.addEventListener('keyup', e => {
            const index = this.keys.indexOf(e.key);
            if (index > -1) {
                this.keys.splice(index, 1);
            }
        })

        document.querySelector('#fullScreenButton').addEventListener('click', () => {
            this.toggleFullScreen();
        })
        document.querySelector('#resetButton').addEventListener('click', () => {
            window.location.reload();
        })
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
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
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
    createboltPool() {
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
        this.ctx.beginPath()
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('Score', this.canvas.width / 2, 35);
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