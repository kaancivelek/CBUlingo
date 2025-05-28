//Kaan Civelek

import logo from "../assets/amblem.svg";
import "../styles/Navi.css";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function VerticalNavbar({ user }) {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
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
        <div className="vertical-logo-img" onClick={() => navigate("/")}>  
          <img src={logo} alt="logo" style={{ width: "100px" }} />
        </div>
        <button className="vertical-navbar-text" onClick={goToDashboard}>
          Dashboard
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
