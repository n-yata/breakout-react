import React from "react";
import Breakout from "./component/Breakout";

const App: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",     // 縦並び
        alignItems: "center",        // 横方向中央
        justifyContent: "center",    // 縦方向中央
        height: "100vh",             // 画面全体を占有
        background: "#f4f4f4",
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "#111", fontFamily: "Segoe UI, sans-serif" }}>
        Breakout Game
      </h1>
      <Breakout />
    </div>
  );
};

export default App;
