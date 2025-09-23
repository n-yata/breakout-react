export class Paddle {
  width: number;
  height: number;
  x: number;
  color: string;

  constructor(canvasWidth: number, width = 75, height = 10, color = "#0095DD") {
    this.width = width;
    this.height = height;
    this.x = (canvasWidth - width) / 2;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
    ctx.beginPath();
    ctx.rect(this.x, canvasHeight - this.height, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

