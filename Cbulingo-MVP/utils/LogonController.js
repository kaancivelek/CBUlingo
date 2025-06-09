import { getUserByEmail, createUser, updateUserPasswordById } from "../src/services/userService";
import { hashPassword } from "./hashUtil";
import { toast, Slide } from "react-toastify";

// Handles user login with email and password verification
export const loginUser = async (email, password, navigate, updateUser = null) => {
  try {
    // Check if user exists
    const user = (await getUserByEmail(email))?.[0];
    if (!user) {
      toast.error("Bu e-posta adresi kayıtlı değil", { transition: Slide, theme: "dark" });
      return;
    }

    // Verify password hash
    const hashedInput = await hashPassword(password);
    if (hashedInput === user.userHashedPassword) {
      toast.success("Giriş Başarılı", { transition: Slide, theme: "dark" });
      
      // Update user state either through context or localStorage
      if (updateUser) {
        updateUser(user);
      } else {
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

// Handles new user registration with password hashing
export const registerUser = async (email, data, navigate, updateUser = null) => {
  try {
    // Check for existing user
    const existingArr = await getUserByEmail(email);
    const existing = Array.isArray(existingArr) ? existingArr[0] : existingArr;
    if (existing && existing.userEmail === email) {
      toast.error("Bu e-posta adresi zaten kayıtlı", { transition: Slide, theme: "dark" });
      return;
    }

    // Hash password and create user
    const hashed = await hashPassword(data.userPassword);
    const userData = { ...data, userHashedPassword: hashed };
    delete userData.userPassword;
    
    const created = await createUser(userData);
    if (created) {
      toast.success("Kayıt Başarılı", { transition: Slide, theme: "dark" });
      
      // Update user state
      if (updateUser) {
        updateUser(created);
      } else {
        localStorage.setItem("user", JSON.stringify(created));
      }
      
      setTimeout(() => navigate("/"), 2000);
    }
  } catch (err) {
    toast.error("Kayıt sırasında bir hata oluştu", { transition: Slide, theme: "dark" });
    console.error(err);
  }
};

// Handles password reset functionality
export const forgotPassword = async (email, data) => {
  try {
    // Verify user exists
    const existingArr = await getUserByEmail(email);
    const existing = Array.isArray(existingArr) ? existingArr[0] : existingArr;

    if (!existing) {
      toast.error("Bu e-posta adresi kayıtlı değil", { transition: Slide, theme: "dark" });
      return;
    }

    // Update password with new hash
    const newHashedPassword = await hashPassword(data.userPassword);
    const updateData = {
      ...existing,
      userHashedPassword: newHashedPassword,
    };

    await updateUserPasswordById(existing.id, updateData);
    toast.success("Şifre başarıyla güncellendi", { transition: Slide, theme: "dark" });

  } catch (err) {
    toast.error("Şifre yenileme sırasında bir hata oluştu", { transition: Slide, theme: "dark" });
    console.error("Hata:", err);
  }
};
