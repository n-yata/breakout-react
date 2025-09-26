import React, { useEffect, useRef } from "react";
import { Game } from "../game/Game";

const Breakout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const baseWidth = 480;
    const baseHeight = 320;

    // デフォルトサイズ
    canvas.width = baseWidth;
    canvas.height = baseHeight;

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
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",          // 画面幅に合わせる
          maxWidth: "480px",      // PCでは480pxで止める
          aspectRatio: "3 / 2",   // アスペクト比を維持
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
