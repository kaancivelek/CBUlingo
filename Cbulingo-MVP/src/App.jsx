import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navi from "./components/Navbar";
import { ToastContainer, Slide } from "react-toastify";

import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import ServiceTest from "./pages/ServiceTest";

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
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/ServiceTest" element={<ServiceTest/>}/>
        </Routes>

        <div className="Footer">
          <p>© 2023 Cbulingo. All rights reserved.</p>
        </div>
      </div>
       <ToastContainer autoClose={2000} theme="dark" transition={Slide} />
    </div>
  );
}

export default App;
