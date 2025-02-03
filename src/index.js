import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Import global styles (optional)
import Home from "./Components/Home"; // Import the Home component

// Create the root and render the application
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Home /> {/* Render the Home component */}
  </React.StrictMode>
);
