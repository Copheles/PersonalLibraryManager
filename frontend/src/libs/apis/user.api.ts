import axiosClient from "@/libs/apis";
import { ICurrentUser } from "../../../global";

const userApi = {
  getCurrentUser() {
    return axiosClient.get<unknown, ICurrentUser>("/users/me");
  },
};

export default userApi;
