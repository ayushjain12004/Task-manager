import React, { useState, useEffect } from "react";
import Home from "./Components/Home"; // Import the Home component
import Signup from "./Components/Signup"; // Import Signup component
import Login from "./Components/Login"; // Import Login component

const App = () => {
  // Manage user login state
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // Check local storage on initial render to persist login status
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    if (isLoggedIn === "true") {
      setUserLoggedIn(true);
    }
  }, []);

  // Handle user login state
  const handleLogin = () => {
    setUserLoggedIn(true);
    localStorage.setItem("userLoggedIn", "true");
  };

  const handleLogout = () => {
    localStorage.setItem("userLoggedIn", "false");
    setUserLoggedIn(false);
  };

  return (
    <div className="App">
      <h1>Welcome to the Note-Taking App</h1>

      {/* Conditionally render components based on userLoggedIn state */}
      {userLoggedIn ? (
        <div>
          <Home />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <Login onLogin={handleLogin} /> {/* Render Login if not logged in */}
        </div>
      )}
    </div>
  );
};

export default App;
