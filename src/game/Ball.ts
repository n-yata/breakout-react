export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;

  constructor(x: number, y: number, radius = 10, color = "#0095DD") {
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = -2;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}