//Kaan Civelek

import request from "./api";

/**
 * User service functions for CRUD operations
 * All functions use the base request handler from api.js
 */

// Get user by email address
export const getUserByEmail = async (email) =>
  request(`/tblUsers?userEmail=${encodeURIComponent(email)}`, "GET");

// Update user information
export const updateUserInfo = async (email, data) =>
  request(`/tblUsers?userEmail=${encodeURIComponent(email)}`, "PATCH", data);

// Update user password by ID
export const updateUserPasswordById = async (id, data) =>
  request(`/tblUsers/${id}`, "PUT", data);

// Delete user account
export const deleteUser = async (email) =>
  request(`/tblUsers?userEmail=${encodeURIComponent(email)}`, "DELETE");

// Create new user account
export const createUser = async (data) => request("/tblUsers", "POST", data);

// Get all users (admin function)
export const getAllUsers = async () => request("/tblUsers", "GET");