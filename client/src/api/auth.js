// client/src/api/auth.js
import axios from 'axios';

// Create an axios instance with the base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auth API functions
// NOTE: Update these paths to match how you mounted your routes in server.js
export const signIn = (formData) => API.post('/signin', formData);
export const signUp = (formData) => API.post('/signup', formData);

// Alternative paths if you mounted routes as /api/users/...
// export const signIn = (formData) => API.post('/users/signin', formData);
// export const signUp = (formData) => API.post('/users/signup', formData);

export default API;