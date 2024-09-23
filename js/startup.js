import Star from "./star.js";

export default class Startup {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.width = canvas.width;
        this.height = canvas.height;

        this.starPool = [];
        this.numberOfStars = 3000; // Define the number of stars you want to create
        this.starTimer = 0;
        this.starInterval = 10; // Adjust the interval to control star creation
        this.createStarPool();


        this.start();

        // Debounced resize function
        window.addEventListener('resize', this.debounce((e) => {
            this.resize(e.target.innerWidth, e.target.innerHeight);
        }, 10));
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
    start() {
        this.resize(window.innerWidth, window.innerHeight);
    }
    destroy() {
        this.starPool = [];
        window.removeEventListener('resize', this.resizeHandler);
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
    }

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

    render(deltaTime) {
        this.handleStars(deltaTime);
        this.starPool.forEach(star => {
            star.update(deltaTime);
            star.draw();
        });
    }
}