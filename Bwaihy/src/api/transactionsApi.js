import axios from "axios";
import { getToken } from "./storage";

const transactionApi = axios.create({

  baseURL: "http://192.168.2.75:8082",
});
transactionApi.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default transactionApi;
