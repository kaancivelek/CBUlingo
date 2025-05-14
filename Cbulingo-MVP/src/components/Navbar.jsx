import logo from "../assets/amblem.svg";
import "../styles/Navi.css";
import { useNavigate } from "react-router-dom";

function VerticalNavbar({ user }) {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToProfileOrLogon = () => {
    if (user && Object.keys(user).length > 0) {
      navigate("/profile");
    } else {
      navigate("/Logon");
    }
  };

  return (
    <div className="vertical-navbar">
      <div className="vertical-navbar-content">
        <div className="vertical-logo-img" onClick={() => navigate("/")}>  
          <img src={logo} alt="logo" style={{ width: "100px" }} />
        </div>
        <div className="vertical-navbar-text" onClick={goToDashboard}>
          Dashboard
        </div>
        <div className="vertical-navbar-text" onClick={goToProfileOrLogon}>
          {user && Object.keys(user).length > 0 ? "Profil" : "Giriş Yap"}
        </div>
      </div>
    </div>
  );
}

export default VerticalNavbar;
