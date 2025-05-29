//Kaan Civelek

// Mobile için embedded database kullanan service
import { 
  getUserByEmail as embeddedGetUserByEmail,
  createUser as embeddedCreateUser,
  updateUserPasswordById as embeddedUpdateUserPasswordById
} from './embeddedService.js';

export const getUserByEmail = async (email) => {
  return await embeddedGetUserByEmail(email);
};

export const updateUserInfo = async (email, data) => {
  // Bu fonksiyon şu an kullanılmıyor, gerekirse implement edilebilir
  console.warn('updateUserInfo not implemented for embedded service');
  return null;
};

export const updateUserPasswordById = async (id, data) => {
  return await embeddedUpdateUserPasswordById(id, data);
};

export const deleteUser = async (email) => {
  // Bu fonksiyon şu an kullanılmıyor, gerekirse implement edilebilir
  console.warn('deleteUser not implemented for embedded service');
  return null;
};

export const createUser = async (data) => {
  return await embeddedCreateUser(data);
};
