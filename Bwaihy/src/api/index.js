import axios from "axios";
import { getToken } from "./storage";

const instance = axios.create({

  baseURL: "http://192.168.2.75:8081",
});
instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
