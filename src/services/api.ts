import axios from "axios";

const { VITE_VERCEL_BACKEND_ENDPOINT } = import.meta.env; //vite env variables

const api = axios.create({
  baseURL: VITE_VERCEL_BACKEND_ENDPOINT,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorStatus = error?.response?.status;

    if (errorStatus >= 500 && errorStatus <= 599) {
      console.log(error);
      //(500 - 599) = Server error responses
      return Promise.reject({
        message: "Errro no servidor, por favor, tente novamente ou mais tarde!",
      });
    }

    if (error?.code === "ERR_NETWORK")
      return Promise.reject({
        message:
          "Falha ao connectar-se com o servidor, por favor, verifique a sua conexão com a internet",
      });

    return Promise.reject(error?.response?.data);
  }
);

export default api;