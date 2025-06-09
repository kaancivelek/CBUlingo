import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navi from "./components/Navbar";
import { ToastContainer, Slide } from "react-toastify";
import WordleGame from "./components/WordleGame";

import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logon from "../utils/Logon";

// Main application component that handles routing and user state management
function App() {
  const [user, setUser] = useState(null);

  // Load and sync user data from localStorage
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("user"); // Clear corrupted data
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Initial load
    loadUserFromStorage();

    // Listen for localStorage changes (for other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        loadUserFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Update user state and localStorage on login
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Clear user state and localStorage on logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="App">
      {/* Navigation header */}
      <div className="Header">
        <Navi user={user} updateUser={updateUser} logoutUser={logoutUser} />
      </div>

      {/* Main content area with routing */}
      <div className="Content">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/leaderboard" element={<Leaderboard/>}/>
            <Route path="/quiz" element={<Quiz user={user}/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/logon" element={<Logon updateUser={updateUser}/>}/>
            <Route path="/login" element={<Login updateUser={updateUser}/>}/>
            <Route path="/register" element={<Register updateUser={updateUser}/>}/>
            <Route path="/wordle" element={<WordleGame/>}/>
          </Routes>
        </div>
      </div>

      {/* Global toast notifications */}
      <ToastContainer autoClose={2000} theme="dark" transition={Slide} />
    </div>
  );
}

export default App;
