import axios, { AxiosInstance } from "axios";

let instance: AxiosInstance;

const setAppInstance = () => {
  if (instance) {
    return instance;
  }

  instance = axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error({
        message: "Error",
        statusCode: error.statusCode,
        err: error,
        sd: error.response.data.issues,
      });

      return Promise.reject(error);
    }
  );

  return instance;
};

export const getAppInstance = () => setAppInstance();
