//Kaan Civelek

import logo from "../assets/amblem.svg";
import "../styles/Navi.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function VerticalNavbar({ user }) {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToQuiz = () => {
    navigate("/quiz");
  };

  const goToProfileOrLogon = () => {
    if (user && Object.keys(user).length > 0) {
      navigate("/ServiceTest");
    } else {
      navigate("/");
    }
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
        <button className="vertical-navbar-text" onClick={goToDashboard}>
          Dashboard
        </button>
        <button className="vertical-navbar-text" onClick={goToQuiz}>
          Quiz
        </button>
        <button className="vertical-navbar-text" onClick={goToProfileOrLogon}>
          {user && Object.keys(user).length > 0 ? "Profil" : "Giriş Yap"}
        </button>
      </div>
    </div>
  );
}

VerticalNavbar.propTypes = {
  user: PropTypes.object.isRequired, // If 'user' is optional, remove '.isRequired'
};

export default VerticalNavbar;
