import authApi from "@/libs/apis/auth.api";
import { useAppDispatch } from "@/libs/redux/hook";
import { resetUser } from "@/libs/redux/user/userSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export default function useLogout() {
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => authApi.logout(),

    onSuccess: async (data) => {
      console.log("Success logout", data);

      dispatch(resetUser());

      enqueueSnackbar("Logout successful", { variant: "success" });
      queryClient.clear()
    },
  });

  return mutation;
}
