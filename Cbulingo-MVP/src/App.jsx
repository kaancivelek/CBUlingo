import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navi from "./components/Navbar";
import { ToastContainer, Slide } from "react-toastify";

import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";

import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logon from "../utils/Logon";

function App() {
  const [user, setUser] = useState(null);

  // localStorage'dan kullanıcı verilerini yükle
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("user"); // Bozuk veriyi temizle
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // İlk yüklemede çalıştır
    loadUserFromStorage();

    // localStorage değişikliklerini dinle (diğer sekmeler için)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        loadUserFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Component cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Kullanıcı giriş yaptığında çağırılacak fonksiyon
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Kullanıcı çıkış yaptığında çağırılacak fonksiyon
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="App">
      <div className="Header">
        <Navi user={user} updateUser={updateUser} logoutUser={logoutUser} />
      </div>

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
          </Routes>
        </div>

  
      </div>
       <ToastContainer autoClose={2000} theme="dark" transition={Slide} />
    </div>
  );
}

export default App;
