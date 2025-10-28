import { store } from "@/libs/redux/store.";
import { resetUser } from "@/libs/redux/user/userSlice";
import { navigate } from "@/utils/navigate";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;

    console.log("error: ", error);

    if (status === 401 && error?.response?.data?.status === "tokenExpire") {
      axiosClient.post("/auth/refresh");
    }

    // If 401 Unauthorized, reset user in Redux and redirect to login
    if (status === 401 && error?.response?.data?.status === "loginExpire") {
      store.dispatch(resetUser());
      navigate("/login");
    }

    const message =
      error?.response?.data?.message || error.message || "Something went wrong";

    if (
      !(status === 401) &&
      !(error?.response?.data?.status === "tokenExpire")
    ) {
      enqueueSnackbar(message, { variant: "error" });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
