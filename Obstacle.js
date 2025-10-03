export default class Obstacle {
  constructor(x,y,vx,game){
    this.x = x; this.y = y;
    this.w = 28; this.h = 20;
    this.vx = vx || -80;
    this.game = game;
    this.color = '#111';
  }

  update(dt){
    this.x += this.vx * dt;
    // wrap-around
    if(this.x < -100) this.x = this.game.width + 40;
    if(this.x > this.game.width + 100) this.x = -40;
  }

  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    // body
    ctx.fillStyle = this.color;
    ctx.fillRect(0,0,this.w,this.h);
    // beak
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.moveTo(this.w, this.h/2);
    ctx.lineTo(this.w+8, this.h/2 - 4);
    ctx.lineTo(this.w+8, this.h/2 + 4);
    ctx.fill();
    ctx.restore();
  }
}
