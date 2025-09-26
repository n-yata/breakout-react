import React from "react";
import "./App.css";
import Breakout from "./component/Breakout";

const App: React.FC = () => {
  return (
    <div className="page">
      <h1 className="title">Breakout Game</h1>
      <div className="game-wrapper">
        <Breakout />
      </div>
    </div>
  );
};

export default App;
