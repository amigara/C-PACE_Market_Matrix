import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./MarketMatrix";
import App from "./App";

// Main rendering using React 17 method
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);

// This makes the component available globally for Webflow integration
window.renderMarketMatrix = function(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    ReactDOM.render(<App />, container);
  }
};

// Auto-initialize if the default container exists
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('market-matrix-container');
  if (container && container !== document.getElementById("root")) {
    window.renderMarketMatrix('market-matrix-container');
  }
});
