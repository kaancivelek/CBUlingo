import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navi from "./components/Navbar";

import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState({
    userId: 1,
    userFullName: "Kaan Civelek",
    userEmail: "kaancivelek17@gmail.com",
    userPassword: "123456",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="App">
      <div className="Header">
        <Navi user={user} />
      </div>

      <div className="Content">
        <Routes>
          <Route path="/" />
        </Routes>

        <div className="Footer"></div>
      </div>
    </div>
  );
}

export default App;
