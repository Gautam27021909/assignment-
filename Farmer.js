/**
 * @class Farmer
 */
export default class Farmer {
  /**
   * @param {number} x
   * @param {number} y
   * @param {Game} game
   */
  constructor(x, y, game){
    this.x = x;
    this.y = y;
    this.w = 28;
    this.h = 28;
    this.speed = 140; // pixels per second
    this.vx = 0;
    this.vy = 0;
    this.game = game;
    this.color = '#5c2e00';
    this.scanning = false;
    // Example: using arrow functions for callbacks in timers keeps lexical this
    // e.g., setTimeout(() => { this.scanning = false; }, 500);
  }

  update(dt){
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    // clamp
    this.x = Math.max(0, Math.min(this.game.width - this.w, this.x));
    this.y = Math.max(0, Math.min(this.game.height - this.h, this.y));
    // friction - stop movement after a short duration to make controls snappy
    this.vx *= 0.88;
    this.vy *= 0.88;
  }

  draw(ctx){
    // Simple representation: body + hat
    ctx.save();
    ctx.translate(this.x, this.y);
    // body
    ctx.fillStyle = this.color;
    ctx.fillRect(0,0,this.w,this.h);
    // hat
    ctx.fillStyle = '#ffd24d';
    ctx.fillRect(4,-6,this.w-8,6);
    ctx.restore();
  }

  moveUp(){ this.vy = -this.speed; }
  moveDown(){ this.vy = this.speed; }
  moveLeft(){ this.vx = -this.speed; }
  moveRight(){ this.vx = this.speed; }

  collidesWith(obj){
    return !(this.x + this.w < obj.x || this.x > obj.x + obj.w ||
             this.y + this.h < obj.y || this.y > obj.y + obj.h);
  }

  /**
   * Example power-up: scythe collects nearby crops
   * Uses arrow function for array filter/map style processing.
   */
  useScythe(crops){
    const range = 48;
    // Collect crops within range
    const collected = crops.filter(c => {
      const dx = (c.x + c.w/2) - (this.x + this.w/2);
      const dy = (c.y + c.h/2) - (this.y + this.h/2);
      return Math.hypot(dx,dy) <= range;
    });
    // remove collected and award points
    collected.forEach(c => {
      const idx = crops.indexOf(c);
      if(idx >= 0) crops.splice(idx,1);
      this.game.score += c.points;
    });
    // short cooldown visual
    this.scanning = true;
    setTimeout(() => { this.scanning = false; }, 250);
  }
}
