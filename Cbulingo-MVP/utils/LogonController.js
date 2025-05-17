import { getUserByEmail, createUser, updateUserPassword } from "../src/services/userService";
import { hashPassword } from "./hashUtil";
import { toast, slide } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const handleLogin = async (email, password) => {
  const navigate = useNavigate();
  try {
    const response = await getUserByEmail(email);
    if (response) {
      const hashedInput = await hashPassword(password);
      if (hashedInput === response.userHashedPassword) {
        toast.success("Giriş Başarılı", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: slide,
        });
        localStorage.setItem("user", JSON.stringify(response));
        setTimeout(navigate("/"), 2000);
      } else {
        toast.error("Giriş Başarısız", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: slide,
        });
      }
    }
  } catch (error) {
    toast.error("Giriş Başarısız", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: slide,
    });
    console.error("Error during login:", error);
  }
};

// Kullanıcı kaydı sırasında:
export const handleRegister = async (email, data) => {
  const navigate = useNavigate();
  try {
    const response = await getUserByEmail(email);
    if (response) {
      toast.error("Bu e-posta adresi zaten kayıtlı", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: slide,
      });
      return;
    }
    const hashed = await hashPassword(data.userPassword);
    const userData = { ...data, userHashedPassword: hashed };
    // userPassword alanını göndermeyin!
    const createResponse = await createUser(userData);
    if (createResponse) {
      toast.success("Kayıt Başarılı", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: slide,
      });

      localStorage.setItem("user", JSON.stringify(createResponse));
      setTimeout((navigate("/")), 2000);
    }
  } catch (error) {
    toast.error("Kayıt Başarısız", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: slide,
    });
    console.error("Error during registration:", error);
  }
};

export const handleFogotPassword = async (email, fullName, newPassword) => {
  try {
    const response = await getUserByEmail(email);
    if (response) {
      if (response.userFullName === fullName) {
        const res = await updateUserPassword(email, { userPassword: newPassword });
        if (res) {
          toast.success("Şifre Güncellendi", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: slide,
          });
        } else {
          toast.error("Şifre güncellenemedi", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: slide,
          });
        }
      } else {
        toast.error("İsim uyuşmuyor", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: slide,
        });
      }
    } else {
      toast.error("Bu e-posta adresi kayıtlı değil", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: slide,
      });
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    toast.error("Şifre sıfırlama sırasında hata oluştu", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: slide,
    });
  }
};