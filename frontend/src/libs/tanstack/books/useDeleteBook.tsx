import bookApi from "@/libs/apis/book.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export default function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [bookApi.KEY] });
      enqueueSnackbar("Book deleted successfully", { variant: "success" });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to delete book",
        { variant: "error" }
      );
    },
  });
}
