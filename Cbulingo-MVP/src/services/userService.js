import request from "./api"

export const getUserByEmail = async (email) => request(`/tblUser?userEmail=${encodeURIComponent(email)}`, 'GET');

export const updateUserInfo = async (email, data) => request(`/tblUser?userEmail=${encodeURIComponent(email)}`, 'PATCH', data);
export const updateUserPassword = async (email, data) => request(`/tblUser?userEmail=${encodeURIComponent(email)}`, 'PUT', data);

export const deleteUser = async (email) => request(`/tblUser?userEmail=${encodeURIComponent(email)}`, 'DELETE');

export const createUser = async (data) => request('/tblUser', 'POST', data);
