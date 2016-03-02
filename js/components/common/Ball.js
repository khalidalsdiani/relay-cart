export default class Ball {
  constructor(ctx, radius, color) {
    this.ctx = ctx;
    this.radius = radius;
    this.startAngle = 0;
    this.endAngle = 2 * Math.PI;
    this.color = color;
  }

  draw(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, this.startAngle, this.endAngle);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
}
