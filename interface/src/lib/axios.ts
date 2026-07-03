import axios from 'axios';

// Ensure we have a string fallback so .replace doesn't throw an error if the env variable is undefined
const API_BASE_URL = (
    import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach the API key/token to every request
api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        // Zustand persist wraps state in a `state` object
        const token = parsed?.state?.accessToken;
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing auth from localStorage", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
