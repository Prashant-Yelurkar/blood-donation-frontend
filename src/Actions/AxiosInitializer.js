import axios from "axios";
import { getAuthToken } from "./Controllers/TokenController";

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;


export const myrouter = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

myrouter.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); 
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


myrouter.interceptors.response.use(
  (response) => {
    return {
      status: response.status,
      data: response.data,
      success: true,
    };
  },
  (error) => {
    const errResponse = error.response || {};
    const data = errResponse.data || { message: "Something went wrong" };
    return Promise.resolve({
      status: errResponse.status || 500,
      data,
      success: data?.success || false,
    });
  }
);
