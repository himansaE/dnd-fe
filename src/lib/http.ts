import axios from "axios";

const Request = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
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
