import Farmer from './Farmer.js';
import Crop from './Crop.js';
import Obstacle from './Obstacle.js';

export default class Game {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} opts
   */
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width; this.height = canvas.height;

    this.score = 0;
    this.level = 1;
    this.initialTime = opts.initialTime || 60;
    this.timeLeft = this.initialTime;
    this.spawnInterval = opts.spawnInterval || 2000;
    this.spawnTimer = 0;

    this.crops = [];
    this.obstacles = [];

    this.running = false;
    this._boundGameLoop = this.gameLoop.bind(this); // bind required for RAF
    // Farmer instance
    this.farmer = new Farmer(40, 40, this);

    // Input handling - we bind the handler so `this` inside handler refers to Game instance
    this._keyHandler = this.handleKey.bind(this);
    document.addEventListener('keydown', this._keyHandler);

    // UI elements
    this.scoreEl = document.getElementById('score');
    this.timerEl = document.getElementById('timer');
    this.levelEl = document.getElementById('level');

    }

  start(){
    this.resetState();
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this._boundGameLoop);
  }

  reset(){
    this.resetState();
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this._boundGameLoop);
  }

  resetState(){
    this.score = 0;
    this.level = 1;
    this.timeLeft = this.initialTime;
    this.crops = [];
    this.obstacles = [];
    this.spawnInterval = Math.max(400, this.spawnInterval); // keep reasonable min
    this.spawnTimer = 0;
    this.updateUI();
  }

  updateUI(){
    if(this.scoreEl) this.scoreEl.textContent = `Score: ${this.score}`;
    if(this.timerEl) this.timerEl.textContent = `Time: ${Math.ceil(this.timeLeft)}`;
    if(this.levelEl) this.levelEl.textContent = `Level: ${this.level}`;
  }

  increaseDifficulty(){
    // Called when score crosses thresholds: speeds up spawning and increases level
    this.level++;
    this.spawnInterval = Math.max(400, this.spawnInterval * 0.85);
    // spawn a moving obstacle when level increases
    this.obstacles.push(new Obstacle(this.width - 60, 60 * (this.level % 6 + 1), -80 - (this.level*20), this));
  }

  spawnCrop(){
    // Different crop types with different points (Q2.a)
    const x = Math.random() * (this.width - 32) + 16;
    const y = Math.random() * (this.height - 32) + 16;
    const crop = Crop.randomAt(x,y);
    this.crops.push(crop);
  }

  gameLoop(now){
    if(!this.running) return;
    const dt = (now - this.lastTime)/1000;
    this.lastTime = now;

    // update timers
    this.timeLeft -= dt;
    this.spawnTimer += (dt*1000);

    // difficulty curve: slightly reduce available time as game progresses (Q2.b)
    if(this.timeLeft < 0) {
      this.running = false;
      this.updateUI();
      alert(`Time's up! Final score: ${this.score}`);
      return;
    }

    if(this.spawnTimer >= this.spawnInterval){
      this.spawnTimer = 0;
      this.spawnCrop();
    }

    // update farmer, crops, obstacles
    this.farmer.update(dt);

    // Using arrow functions for array processing (they capture lexical this if needed)
    this.crops.forEach((c, idx) => {
      // if farmer collects crop
      if(this.farmer.collidesWith(c)){
        this.score += c.points;
        this.crops.splice(idx,1);
        // increase difficulty at score thresholds
        if(this.score > this.level * 10){
          this.increaseDifficulty();
        }
      }
    });

    // update obstacles (moving hazards)
    this.obstacles.forEach((o, idx) => {
      o.update(dt);
      if(this.farmer.collidesWith(o)){
        // hitting an obstacle costs time
        this.timeLeft -= 5;
        // remove obstacle after hit
        this.obstacles.splice(idx,1);
      }
    });

    // render
    this.draw();

    this.updateUI();
    requestAnimationFrame(this._boundGameLoop);
  }

  draw(){
    const ctx = this.ctx;
    ctx.clearRect(0,0,this.width,this.height);

    // draw ground (simple grid for fun)
    for(let gx=0; gx<this.width; gx += 32){
      for(let gy=0; gy<this.height; gy += 32){
        ctx.fillStyle = ( (gx/32 + gy/32) % 2 === 0) ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
        ctx.fillRect(gx,gy,32,32);
      }
    }

    // crops
    this.crops.forEach(c => c.draw(ctx));
    // obstacles
    this.obstacles.forEach(o => o.draw(ctx));
    // farmer
    this.farmer.draw(ctx);
  }

  handleKey(e){
    // bound with .bind(this) so `this` is Game instance and we can access this.farmer
    switch(e.key){
      case 'ArrowUp': this.farmer.moveUp(); break;
      case 'ArrowDown': this.farmer.moveDown(); break;
      case 'ArrowLeft': this.farmer.moveLeft(); break;
      case 'ArrowRight': this.farmer.moveRight(); break;
      case ' ': // space to collect nearby crops (power-up style)
        this.farmer.useScythe(this.crops);
        break;
    }
  }
}
