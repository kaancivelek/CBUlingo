//Kaan Civelek

import request from "./api";

export const getUserByEmail = async (email) =>
  request(`/tblUsers?userEmail=${encodeURIComponent(email)}`, "GET");

export const updateUserInfo = async (email, data) =>
  request(`/tblUsers?userEmail=${encodeURIComponent(email)}`, "PATCH", data);

export const updateUserPasswordById = async (id, data) =>
  request(`/tblUsers/${id}`, "PUT", data);

export const deleteUser = async (email) =>
  request(`/tblUsers?userEmail=${encodeURIComponent(email)}`, "DELETE");

export const createUser = async (data) => request("/tblUsers", "POST", data);
