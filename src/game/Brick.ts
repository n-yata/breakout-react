export class Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  status: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.status = 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.status === 1) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  }
}
