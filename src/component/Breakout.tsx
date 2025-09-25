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
      game.update();
      game.draw();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f4f4f4", // モダンな淡い背景
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "#ffffff",
        }}
      />
    </div>
  );
};

export default Breakout;
