import { Navbar, NavbarBrand, NavbarText } from "reactstrap";
import logo from "../assets/amblem.svg";
import { useNavigate, useLocation } from "react-router-dom";

function Navi({ user }) {
  const navigate = useNavigate();
  const location = useLocation(); // Mevcut rotayı kontrol etmek için

  const goBackToHomePage = () => {
    navigate("/");
  };

  function logonAndProfile() {
    if (!(user && Object.keys(user).length > 0)) {
      return (
        <div className="navbar-right">
          <NavbarText
            className="navbar-login-text"
            onClick={() => navigate("/Logon")}
          >
            GİRİŞ YAP
          </NavbarText>
        </div>
      );
    } else {
      return (
        <div className="navbar-right">
          <NavbarText
            style={{ textAlign: "center" }}
            className="navbar-login-text"
            onClick={() => navigate("/Profile")}
          >
            {user.userFullName}
            <br></br>
            {(() => {
              switch (user.roleId) {
                case 1:
                  return "Müşteri";
                case 2:
                  return "Emlak Sahibi";
                case 3:
                  return "Admin";
                default:
                  return "Bilinmeyen Rol";
              }
            })()}
          </NavbarText>
        </div>
      );
    }
  }

  return (
    <Navbar className="navbar-custom" fixed="top">
      <div className="navbar-content">
        <NavbarBrand onClick={goBackToHomePage} style={{ cursor: "pointer" }}>
          <img src={logo} alt="logo" className="logo-img" />
        </NavbarBrand>
        {logonAndProfile()}
      </div>
    </Navbar>
  );
}

export default Navi;
