//Kaan Civelek

import logo from "../assets/amblem.svg";
import "../styles/Navi.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function VerticalNavbar({ user, logoutUser }) {
  const navigate = useNavigate();

  const goToLeaderboard = () => {
    navigate("/leaderboard");
  };

  const goToQuiz = () => {
    navigate("/quiz");
  };

  const goToWordle = () => {
    navigate("/wordle");
  };

  const goToProfileOrLogon = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/logon");
    }
  };

  const handleLogout = () => {
    logoutUser(); // App.jsx'den gelen logout fonksiyonunu kullan
    navigate("/");
  };

  return (
    <div className="vertical-navbar">
      <div className="vertical-navbar-content">
        <button
          className="vertical-logo-img"
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          aria-label="Anasayfa"
        >
          <img src={logo} alt="logo" style={{ width: "100px" }} />
        </button>
        
       <button className="vertical-navbar-text" onClick={goToLeaderboard}>
          Leaderboard
        </button> 
        
        <button className="vertical-navbar-text" onClick={goToQuiz}>
          Quiz
        </button>
        
        <button className="vertical-navbar-text" onClick={goToWordle}>
          Wordle
        </button>
        
        <button className="vertical-navbar-text" onClick={goToProfileOrLogon}>
          {user ? user.userFullName || "Profil" : "Giriş Yap"}
        </button>
        
        {user && (
          <button className="vertical-navbar-text logout-button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        )}
      </div>
    </div>
  );
}

VerticalNavbar.propTypes = {
  user: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
};
 VerticalNavbar;
