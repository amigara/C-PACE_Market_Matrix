import React from "react";
import "./marketMatrix.css";
import MarketMatrix from "./MarketMatrix.js";

export default function App() {
  return (
    <div className="App">
      <div id="market-matrix-container">
        <MarketMatrix />
      </div>
    </div>
  );
}
