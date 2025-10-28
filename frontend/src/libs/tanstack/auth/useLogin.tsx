import authApi from "@/libs/apis/auth.api";
import userApi from "@/libs/apis/user.api";
import { useAppDispatch } from "@/libs/redux/hook";
import { setUser } from "@/libs/redux/user/userSlice";
import { LoginInputs } from "@/libs/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export default function useLogin() {
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: (authData: LoginInputs) => {
      return authApi.login(authData);
    },

    onSuccess: async (data) => {
      console.log("success: ", data);

      const user = await userApi.getCurrentUser();
      console.log("user: ", user);

      dispatch(
        setUser({
          _id: user._id,
          email: user.email,
        })
      );

      enqueueSnackbar("Login successful", { variant: "success" });
    },
  });

  return mutation
}
