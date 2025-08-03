import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ Vite uses import.meta.env
});
// Attach token to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getPosts = () => API.get("/posts");
export const createPost = (data) => API.post("/posts", data);
export const updateUserProfile = (data) => API.put("/auth/me", data);
export const getUserProfile = () => API.get("/auth/me");
export const uploadCoverImage = (formData) =>
  API.post("/upload/cover", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const uploadProfileImage = (formData) =>
  API.post("/upload/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });


