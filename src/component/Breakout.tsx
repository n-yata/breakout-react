import React, { useEffect, useRef } from "react";
import { Game } from "../game/Game";

const Breakout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = 480;
    canvas.height = 320;

    const game = new Game(canvas);

    let rafId: number;
    const loop = () => {
      game.update(); // ← 座標更新
      game.draw();   // ← 描画
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return <canvas ref={canvasRef} style={{ border: "1px solid #000" }} />;
};

export default Breakout;
