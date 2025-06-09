//Kaan Civelek

import logo from "../assets/amblem.svg";
import "../styles/Navi.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Vertical navigation bar component that provides access to main application features
 * @param {Object} user - Current user object (null if not logged in)
 * @param {Function} logoutUser - Function to handle user logout
 */
export default function VerticalNavbar({ user, logoutUser }) {
  const navigate = useNavigate();

  // Navigation handlers for different sections
  const goToLeaderboard = () => navigate("/leaderboard");
  const goToQuiz = () => navigate("/quiz");
  const goToWordle = () => navigate("/wordle");

  // Conditional navigation to profile or login page
  const goToProfileOrLogon = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/logon");
    }
  };

  // Handle user logout and redirect to home
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="vertical-navbar">
      <div className="vertical-navbar-content">
        {/* Logo button that navigates to home */}
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
        
        {/* Main navigation buttons */}
        <button className="vertical-navbar-text" onClick={goToLeaderboard}>
          Leaderboard
        </button> 
        
        <button className="vertical-navbar-text" onClick={goToQuiz}>
          Quiz
        </button>
        
        <button className="vertical-navbar-text" onClick={goToWordle}>
          Wordle
        </button>
        
        {/* Conditional profile/login button */}
        <button className="vertical-navbar-text" onClick={goToProfileOrLogon}>
          {user ? user.userFullName || "Profil" : "Giriş Yap"}
        </button>
        
        {/* Logout button (only shown when user is logged in) */}
        {user && (
          <button className="vertical-navbar-text logout-button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        )}
      </div>
    </div>
  );
}

// PropTypes for component validation
VerticalNavbar.propTypes = {
  user: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
};
