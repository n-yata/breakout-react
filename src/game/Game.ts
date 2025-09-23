import { Ball } from "./Ball";
import { Paddle } from "./Paddle";
import { Brick } from "./Brick";

type GameState = "PLAYING" | "GAMEOVER" | "WIN";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[][];
  score: number = 0;
  lives: number = 3;
  state: GameState = "PLAYING";

  brickRowCount = 3;
  brickColumnCount = 5;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brickOffsetLeft = 30;

  rightPressed = false;
  leftPressed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.ball = new Ball(canvas.width / 2, canvas.height - 30);
    this.paddle = new Paddle(canvas.width);
    this.bricks = [];
    this.initBricks();

    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);
    canvas.addEventListener("click", this.handleClick);
  }

  initBricks() {
    this.bricks = [];
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        const brickX =
          c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
        const brickY =
          r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
        this.bricks[c][r] = new Brick(
          brickX,
          brickY,
          this.brickWidth,
          this.brickHeight
        );
      }
    }
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.state = "PLAYING";
    this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 30);
    this.paddle = new Paddle(this.canvas.width);
    this.initBricks();
  }

  keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Right" || e.key === "ArrowRight") this.rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") this.leftPressed = true;
  };
  keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === "Right" || e.key === "ArrowRight") this.rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") this.leftPressed = false;
  };

  handleClick = (e: MouseEvent) => {
    if (this.state === "GAMEOVER" || this.state === "WIN") {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // ボタン領域を確認
      const btnX = this.canvas.width / 2 - 40;
      const btnY = this.canvas.height / 2 + 20;
      const btnW = 80;
      const btnH = 30;

      if (
        clickX >= btnX &&
        clickX <= btnX + btnW &&
        clickY >= btnY &&
        clickY <= btnY + btnH
      ) {
        this.reset();
      }
    }
  };

  update() {
    if (this.state !== "PLAYING") return;

    const ball = this.ball;
    const paddle = this.paddle;

    // ボール移動
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 壁の反射
    if (
      ball.x + ball.dx > this.canvas.width - ball.radius ||
      ball.x + ball.dx < ball.radius
    ) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    }

    // パドル判定 or ライフ減少
    if (ball.y + ball.dy > this.canvas.height - ball.radius) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
      } else {
        this.lives--;
        if (this.lives === 0) {
          this.state = "GAMEOVER";
        } else {
          this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 30);
          this.paddle = new Paddle(this.canvas.width);
        }
      }
    }

    // パドル移動
    if (this.rightPressed && paddle.x < this.canvas.width - paddle.width)
      paddle.x += 5;
    if (this.leftPressed && paddle.x > 0) paddle.x -= 5;

    // ブロック衝突
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          if (
            ball.x > b.x &&
            ball.x < b.x + this.brickWidth &&
            ball.y > b.y &&
            ball.y < b.y + this.brickHeight
          ) {
            ball.dy = -ball.dy;
            b.status = 0;
            this.score++;
            if (this.score === this.brickRowCount * this.brickColumnCount) {
              this.state = "WIN";
            }
          }
        }
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 通常描画
    this.ball.draw(ctx);
    this.paddle.draw(ctx, this.canvas.height);
    this.bricks.forEach((row) => row.forEach((b) => b.draw(ctx)));

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`Score: ${this.score}`, 8, 20);
    ctx.fillText(`Lives: ${this.lives}`, this.canvas.width - 65, 20);

    if (this.state === "GAMEOVER" || this.state === "WIN") {
      ctx.fillStyle = "#000";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        this.state === "WIN" ? "YOU WIN!" : "GAME OVER",
        this.canvas.width / 2,
        this.canvas.height / 2 - 20
      );

      // Restartボタン
      ctx.fillStyle = "#0095DD";
      const btnX = this.canvas.width / 2 - 40;
      const btnY = this.canvas.height / 2 + 20;
      ctx.fillRect(btnX, btnY, 80, 30);
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.fillText("Restart", this.canvas.width / 2, btnY + 20);
    }
  }
}
