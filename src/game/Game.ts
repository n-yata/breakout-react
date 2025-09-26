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

    // --- PC操作 ---
    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);

    // --- スマホ操作 ---
    canvas.addEventListener("touchstart", this.handleTouchStart);
    canvas.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", this.handleTouchEnd);

    // --- Restart (PCクリック) ---
    canvas.addEventListener("click", this.handleRestartClick);
  }

  // 表示縮小時の座標スケールを取得（CSSサイズ→内部座標へ）
  private getScale() {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return { rect, scaleX, scaleY };
  }

  // クライアント座標→キャンバス内部座標に変換
  private toCanvasXY(clientX: number, clientY: number) {
    const { rect, scaleX, scaleY } = this.getScale();
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  // --- ブロック初期化 ---
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

  // --- PC操作 ---
  keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Right" || e.key === "ArrowRight") this.rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") this.leftPressed = true;
  };
  keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === "Right" || e.key === "ArrowRight") this.rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") this.leftPressed = false;
  };

  // --- スマホ操作 ---
  handleTouchStart = (e: TouchEvent) => {
    const { x } = this.toCanvasXY(e.touches[0].clientX, e.touches[0].clientY);
    if (x < this.canvas.width / 2) {
      this.leftPressed = true;
      this.rightPressed = false;
    } else {
      this.rightPressed = true;
      this.leftPressed = false;
    }
  };

  handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const { x } = this.toCanvasXY(e.touches[0].clientX, e.touches[0].clientY);
    this.paddle.x = x - this.paddle.width / 2;
    if (this.paddle.x < 0) this.paddle.x = 0;
    if (this.paddle.x + this.paddle.width > this.canvas.width) {
      this.paddle.x = this.canvas.width - this.paddle.width;
    }
  };

  handleTouchEnd = (e: TouchEvent) => {
    this.leftPressed = false;
    this.rightPressed = false;

    if (this.state === "GAMEOVER" || this.state === "WIN") {
      if (e.changedTouches.length > 0) {
        const { x, y } = this.toCanvasXY(
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY
        );
        const btnX = this.canvas.width / 2 - 50;
        const btnY = this.canvas.height / 2 + 10;
        const btnW = 100;
        const btnH = 35;
        if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
          this.reset();
        }
      }
    }
  };

  // --- Restartクリック ---
  handleRestartClick = (e: MouseEvent) => {
    if (this.state === "GAMEOVER" || this.state === "WIN") {
      const { x, y } = this.toCanvasXY(e.clientX, e.clientY);
      const btnX = this.canvas.width / 2 - 50;
      const btnY = this.canvas.height / 2 + 10;
      const btnW = 100;
      const btnH = 35;
      if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
        this.reset();
      }
    }
  };

  // --- ライフを失う処理 ---
  private loseLife() {
    this.lives--;
    if (this.lives === 0) {
      this.state = "GAMEOVER";
    } else {
      // パドル中央から再開
      const startX = this.paddle.x + this.paddle.width / 2;
      const startY = this.canvas.height - 30;
      this.ball = new Ball(startX, startY);
    }
  }

  // --- 更新 ---
  update() {
    if (this.state !== "PLAYING") return;

    const ball = this.ball;
    const paddle = this.paddle;

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
        this.loseLife();
      }
    }

    // パドル移動（PC操作）
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

  // --- 描画 ---
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // ボール
    this.ball.color = "#FF6B35";
    this.ball.draw(ctx);

    // パドル
    ctx.fillStyle = "#3B82F6";
    this.paddle.draw(ctx, this.canvas.height);

    // ブロック
    const colors = ["#60A5FA", "#34D399", "#FBBF24"];
    this.bricks.forEach((row, r) =>
      row.forEach((b) => {
        if (b.status === 1) {
          ctx.fillStyle = colors[r % colors.length];
          ctx.fillRect(b.x, b.y, this.brickWidth, this.brickHeight);
          ctx.strokeStyle = "#fff";
          ctx.strokeRect(b.x, b.y, this.brickWidth, this.brickHeight);
        }
      })
    );

    // スコア & ライフ
    ctx.font = "16px 'Segoe UI', sans-serif";
    ctx.fillStyle = "#374151";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${this.score}`, 8, 20);
    ctx.textAlign = "right";
    ctx.fillText(`Lives: ${this.lives}`, this.canvas.width - 8, 20);

    // 終了画面
    if (this.state === "GAMEOVER" || this.state === "WIN") {
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillRect(
        this.canvas.width / 2 - 120,
        this.canvas.height / 2 - 60,
        240,
        120
      );

      ctx.fillStyle = "#111";
      ctx.font = "20px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        this.state === "WIN" ? "🎉 YOU WIN!" : "💀 GAME OVER",
        this.canvas.width / 2,
        this.canvas.height / 2 - 20
      );

      const btnX = this.canvas.width / 2 - 50;
      const btnY = this.canvas.height / 2 + 10;
      ctx.fillStyle = "#3B82F6";
      ctx.fillRect(btnX, btnY, 100, 35);
      ctx.fillStyle = "#fff";
      ctx.font = "16px 'Segoe UI', sans-serif";
      ctx.fillText("Restart", this.canvas.width / 2, btnY + 23);
    }
  }
}
