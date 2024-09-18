import Aim from "./aim.js";
import Gun from "./gun.js";
import Bolt from "./bolt.js";

export default class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.width = canvas.width;
        this.height = canvas.height;

        this.aim = new Aim(this, 100);
        this.gun = new Gun(this, 0);
        this.gun2 = new Gun(this, this.width - this.gun.width);
        
        this.boltPool = [];
        this.numberOfbolt = 500;
        this.createboltPool();

        this.mouse = {
            x: undefined,
            y: undefined,
            isClicked: false,
        }

        this.keys = [];

        this.start();

        // Debounced resize function
        window.addEventListener('resize', this.debounce((e) => {
            this.resize(e.target.innerWidth, e.target.innerHeight);
        }, 100));


        window.addEventListener('mousemove', e => {
            e.preventDefault();
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        })
        window.addEventListener('mousedown', e => {
            e.preventDefault();
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.isClicked = true;
        })
        window.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.mouse.isClicked = false;
        })

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
    }


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
    checkCollision(circle1, circle2) {
        const dx = circle2.x - circle1.x;
        const dy = circle2.y - circle1.y;
        const distance = Math.hypot(dx, dy);
        const sumOfRadi = circle1.radius + circle2.radius;
        if (distance <= sumOfRadi) {
            return true;
        }
        else {
            return false;
        }
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

    drawStatusText() {
        this.ctx.save();
        this.ctx.beginPath()
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('Score', this.canvas.width / 2, 35);
        this.ctx.restore();
    }
    a
    render(deltaTime) {
        this.gun.update(deltaTime)
        this.gun2.update(deltaTime)
        this.gun.draw()
        this.gun2.draw()
        this.aim.update()
        this.aim.draw()
        this.boltPool.forEach(bolt => {
            bolt.update(deltaTime);
            bolt.draw();
        })
        this.drawStatusText()
        if (this.width < 1350 && this.width > 400) {
            // this.movement.draw();
        }
    }
}