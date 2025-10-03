/**
 * Crop types:
 * wheat: points 1 (common)
 * pumpkin: points 3 (less common)
 * gold: points 5 (rare)
 */

export default class Crop {
  /**
   * @param {number} x
   * @param {number} y
   * @param {string} type
   */
  constructor(x,y,type='wheat'){
    this.x = x; this.y = y;
    this.w = 18; this.h = 18;
    this.type = type;
    this.points = Crop.pointsFor(type);
  }

  static pointsFor(type){
    switch(type){
      case 'pumpkin': return 3;
      case 'gold': return 5;
      default: return 1;
    }
  }

  static randomAt(x,y){
    // random distribution: wheat 70%, pumpkin 25%, gold 5%
    const r = Math.random();
    const type = r < 0.70 ? 'wheat' : (r < 0.95 ? 'pumpkin' : 'gold');
    return new Crop(x,y,type);
  }

  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    // draw by type
    if(this.type === 'wheat'){
      ctx.fillStyle = '#efc45a';
      ctx.fillRect(0,0,this.w,this.h);
    } else if(this.type === 'pumpkin'){
      ctx.fillStyle = '#ff7f2a';
      ctx.fillRect(0,0,this.w,this.h);
      ctx.fillStyle = '#7b3f00';
      ctx.fillRect(6,2,6,2);
    } else if(this.type === 'gold'){
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(this.w/2,this.h/2, this.w/2,0,Math.PI*2);
      ctx.fill();
    }
    // small shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0,this.h-3,this.w,3);
    ctx.restore();
  }
}
