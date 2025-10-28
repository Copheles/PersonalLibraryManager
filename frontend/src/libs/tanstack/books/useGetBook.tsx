import bookApi from "@/libs/apis/book.api";
import { useQuery } from "@tanstack/react-query";

export default function useGetBook(bookId: string) {
  return useQuery({
    queryKey: [bookApi.KEY, bookId],
    queryFn: () => bookApi.getOne(bookId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!bookId,
  });
}
