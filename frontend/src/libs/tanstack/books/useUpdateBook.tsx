import bookApi from "@/libs/apis/book.api";
import { UpdateBookInputs } from "@/libs/types/book.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export default function useUpdateBook() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookInputs }) => {
      return bookApi.update({ id, data });
    },

    onSuccess: async (data) => {
      console.log("Success in update book, ", data);

      await queryClient.invalidateQueries({
        queryKey: [bookApi.KEY],
      });

      enqueueSnackbar("Updted book successfully", { variant: "success" });
    },
  });

  return mutation;
}
