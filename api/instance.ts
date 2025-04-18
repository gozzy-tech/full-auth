// create axios instances with token and without token
import { Auth } from '@/utils/auth';
import axios from 'axios';

// Axios instance for client-side requests without auth
export const Axiosinstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });


// Axios instance for server-side requests without auth
export const AxiosInstanceServer = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  // Axios instance for client-side requests with auth
  export const AxiosinstanceAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  AxiosinstanceAuth.interceptors.request.use(
    (config) => {
      const token = Auth.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // config.headers.Authorization = `Bearer 96692086-ecfa-4dc9-aab2-73dc5b4858e1`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  