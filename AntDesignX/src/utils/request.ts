import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { message } from "antd";

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加 token
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    // 这里可以根据后端的响应结构进行调整
    return data;
  },
  (error) => {
    // 统一的错误处理
    const { response } = error;
    if (response?.data?.message) {
      message.error(response.data.message);
    } else {
      message.error("请求失败，请稍后重试");
    }
    return Promise.reject(error);
  }
);

export default request;
