import axios from "axios";

const Request = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASEURL,
});

// Ensure FormData requests use proper multipart boundary by removing any preset content-type
Request.interceptors.request.use((config) => {
  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isFormData && config.headers) {
    // Let the browser/axios set the correct multipart/form-data; boundary=...
    delete (config.headers as any)["Content-Type"];
  }
  return config;
});

// Create a function to set the auth token that can be called from components
export const setAuthToken = (token: string | null) => {
  if (token) {
    Request.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete Request.defaults.headers.common["Authorization"];
  }
};

export default Request;
