import bookApi from "@/libs/apis/book.api";
import { CreateBookInputs } from "@/libs/types/book.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export default function useCreateBook() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (bookData: CreateBookInputs) => {
      return bookApi.create(bookData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [bookApi.KEY] });

      enqueueSnackbar("Created book successfully", { variant: "success" });
    },
  });

  return mutation;
}
