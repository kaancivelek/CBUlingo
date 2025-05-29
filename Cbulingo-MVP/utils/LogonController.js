import { getUserByEmail, createUser, updateUserPasswordById } from "../src/services/userService";
import { hashPassword } from "./hashUtil";
import { toast, Slide } from "react-toastify";

// Giriş (Login)
export const loginUser = async (email, password, navigate, updateUser = null) => {
  try {
    const user = (await getUserByEmail(email))?.[0];
    if (!user) {
      toast.error("Bu e-posta adresi kayıtlı değil", { transition: Slide, theme: "dark" });
      return;
    }
    console.log("Şifre (gelen):", password);
    const hashedInput = await hashPassword(password);
    console.log("Hash:", hashedInput);
    console.log("Kullanıcıdan gelen hash:", user.userHashedPassword);
    console.log("Girişte üretilen hash:", hashedInput);
    console.log("Karşılaştırma sonucu:", hashedInput === user.userHashedPassword);
    if (hashedInput === user.userHashedPassword) {
      toast.success("Giriş Başarılı", { transition: Slide, theme: "dark" });
      
      // App.jsx'den gelen updateUser fonksiyonunu kullan
      if (updateUser) {
        updateUser(user);
      } else {
        // Fallback - doğrudan localStorage'a yaz
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      setTimeout(() => navigate("/"), 2000);
    } else {
      toast.error("Şifre hatalı", { transition: Slide, theme: "dark" });
    }
  } catch (err) {
    toast.error("Giriş sırasında bir hata oluştu", { transition: Slide, theme: "dark" });
    console.error(err);
  }
};

// Kayıt (Register)
export const registerUser = async (email, data, navigate, updateUser = null) => {
  try {
    const existingArr = await getUserByEmail(email);
    const existing = Array.isArray(existingArr) ? existingArr[0] : existingArr;
    if (existing && existing.userEmail === email) {
      toast.error("Bu e-posta adresi zaten kayıtlı", { transition: Slide, theme: "dark" });
      return;
    }
    console.log("Kayıt şifresi:", data.userPassword);
    const hashed = await hashPassword(data.userPassword);
    console.log("Kayıt hash:", hashed);
    const userData = { ...data, userHashedPassword: hashed };
    delete userData.userPassword;
    const created = await createUser(userData);
    if (created) {
      toast.success("Kayıt Başarılı", { transition: Slide, theme: "dark" });
      
      // App.jsx'den gelen updateUser fonksiyonunu kullan
      if (updateUser) {
        updateUser(created);
      } else {
        // Fallback - doğrudan localStorage'a yaz
        localStorage.setItem("user", JSON.stringify(created));
      }
      
      setTimeout(() => navigate("/"), 2000);
    }
  } catch (err) {
    toast.error("Kayıt sırasında bir hata oluştu", { transition: Slide, theme: "dark" });
    console.error(err);
  }
};

// Şifremi Unuttum (Forgot Password)
export const forgotPassword = async (email, data) => {
  try {
    const existingArr = await getUserByEmail(email);
    const existing = Array.isArray(existingArr) ? existingArr[0] : existingArr;

    if (!existing) {
      toast.error("Bu e-posta adresi kayıtlı değil", { transition: Slide, theme: "dark" });
      return;
    }

    const newHashedPassword = await hashPassword(data.userPassword);

    const updateData = {
      ...existing,
      userHashedPassword: newHashedPassword,
    };

    // ŞİFRE GÜNCELLEME (ID ile)
    await updateUserPasswordById(existing.id, updateData);

    toast.success("Şifre başarıyla güncellendi", { transition: Slide, theme: "dark" });

  } catch (err) {
    toast.error("Şifre yenileme sırasında bir hata oluştu", { transition: Slide, theme: "dark" });
    console.error("Hata:", err);
  }
};
