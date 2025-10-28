import axiosClient from "@/libs/apis";
import { IAuthResponse } from "../../../global";
import { LoginInputs, RegisterInputs } from "@/libs/types/auth.type";

const authApi = {
  register(data: RegisterInputs) {
    return axiosClient.post<unknown, IAuthResponse>("/auth/register", data);
  },

  login(data: LoginInputs) {
    return axiosClient.post<unknown, IAuthResponse>("/auth/login", data);
  },

  logout() {
    return axiosClient.get("/auth/logout");
  },
};

export default authApi;
